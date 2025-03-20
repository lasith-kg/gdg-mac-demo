const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 9000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Configure PostgreSQL connection pool for the app
const pool = new Pool(); // Will use environment variables from docker compose

// Function to initialize the table
const initializeTable = async () => {
  let connected = false;
  let attempts = 0;
  const maxAttempts = 5; // Try just a few times

  while (!connected && attempts < maxAttempts) {
    try {
      attempts++;
      console.log(`Attempt ${attempts}/${maxAttempts}: Connecting to database...`);
      
      // Create todos table if not exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          text VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT FALSE
        )
      `);
      
      console.log('Connected to database and todos table is ready');
      connected = true;
    } catch (err) {
      console.error(`Table initialization attempt ${attempts} failed:`, err.message);
      
      // Wait 5 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  if (!connected) {
    console.error('Could not initialize the table after maximum attempts. App may not function correctly.');
  }
  
  return connected;
};

// Initialize the table but don't block server startup
initializeTable().then(success => {
  if (success) {
    console.log('Table initialization completed successfully');
  }
});

// Basic health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Try a simple query to check database connection
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'Backend service is running with database connection' });
  } catch (err) {
    res.status(500).json({ 
      status: 'degraded', 
      message: 'Backend service is running but database connection failed',
      error: err.message 
    });
  }
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Add a new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO todos (text) VALUES ($1) RETURNING *',
      [text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding todo:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Toggle todo completion status
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (todo.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const newCompleted = !todo.rows[0].completed;
    const result = await pool.query(
      'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
      [newCompleted, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Start the server regardless of DB connection
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running at http://localhost:${port}`);
}); 

