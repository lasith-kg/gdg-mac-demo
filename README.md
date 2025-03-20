# Docker Todo App Demo

This project demonstrates using Docker to containerize a simple three-tier web application:
1. **Frontend**: A static HTML/CSS todo app served by Nginx
2. **Backend**: An Express.js API service
3. **Database**: A PostgreSQL database

## Project Structure

```
gdg-mac-demo/
├── frontend/               # Static HTML frontend
│   ├── index.html          # Todo app HTML/CSS with JavaScript
│   └── Dockerfile          # Frontend container definition
├── backend/                # Express.js backend API
│   ├── src/                # Source code directory
│   │   └── index.js        # API server code
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile          # Backend container definition
├── docker compose.yml      # Container orchestration
├── .gitignore              # Git ignore patterns for all components
└── README.md               # Project documentation
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

## Running the Application

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd gdg-mac-demo
   ```

2. Start the containers:
   ```bash
   docker compose up -d --build
   ```

3. Access the application:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

4. Stop the application:
   ```bash
   docker compose down -v
   ```

## Container Details

### Frontend Container
- Base image: Nginx Alpine
- Purpose: Serves static HTML/CSS/JavaScript
- Port: 80 (internal), 8080 (external)

### Backend Container
- Base image: Node.js Alpine
- Purpose: Provides the REST API for todo management
- Port: 3000 (internal & external)
- Connects to the database container

### Database Container
- Base image: PostgreSQL Alpine
- Purpose: Stores todo items
- Port: 5432 (internal & external)
- Data persistence via Docker volumes

## API Endpoints

- `GET /todos` - Get all todos
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Toggle todo completion status
- `DELETE /todos/:id` - Delete a todo

## Learning Objectives

This demo helps students understand:

1. How to containerize different parts of an application
2. How containers can communicate with each other
3. How to use Docker Compose to orchestrate multi-container applications
4. The benefits of running services like databases in containers
5. How to expose container ports to the host system
6. How to persist data using Docker volumes

## Useful Docker Commands

```bash
# View running containers
docker ps

# View container logs
docker logs <container_id>

# Access the database container
docker exec -it <db_container_id> psql -U postgres -d todos

# List volumes
docker volume ls

# Stop and remove all containers, networks, and volumes
docker compose down -v
``` 
