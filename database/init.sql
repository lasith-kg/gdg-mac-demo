-- Make sure we're using the right database
\c todos;

-- Check if the todos table exists, if not create it
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);

-- Insert sample todo items
INSERT INTO todos (text, completed) VALUES
  ('Learn Docker basics', TRUE),
  ('Understand multi-container applications', TRUE),
  ('Create a frontend container', FALSE),
  ('Set up a backend API container', FALSE),
  ('Configure a PostgreSQL database container', FALSE);

-- Display the inserted data
SELECT * FROM todos; 
