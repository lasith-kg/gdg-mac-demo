# Database Initialization

This directory contains scripts that will be automatically executed when the PostgreSQL container starts for the first time. This is useful for:

- Creating database schemas
- Preloading initial data
- Setting up user permissions
- Creating indexes and constraints

## How It Works

PostgreSQL's official Docker image automatically executes scripts from:
1. Any `*.sql` files in the `/docker-entrypoint-initdb.d/` directory
2. Scripts are executed in alphabetical order
3. Scripts only run when the database is first initialized (when the data volume is empty)

## Files

- `init.sql` - Creates the todos table and preloads it with sample tasks related to Docker learning

## Notes

- If you change these files, the changes will only take effect if you recreate the database container with a fresh volume:
  ```
  docker compose down -v
  docker compose up
  ```
- To add more initialization scripts, add additional SQL files to this directory. 
