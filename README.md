## Development Setup

### Prerequisites

Ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js & NPM](https://nodejs.org/en/download/)

### Export current database from server

1. SSH into the server:
   ```sh
   ssh -p 822 <server_username>@<server_address>
   ```
2. Dump the database:
   ```sh
   dokku postgres:export <dokku_app_name> > dump.sql
   ```
3. Copy the dump file to your local machine (run this command on your local machine):
   ```sh
   scp -P 822 <server_username>@<server_address>:/home/<server_username>/dump.sql ./
   ```
4. Delete the dump file from the server:
   ```sh
   rm dump.sql
   ```

### Starting the Development Environment

1. Clone the repository:

2. Install dependencies:

   ```sh
    npm install
   ```

3. Start the containers:
   ```sh
   docker compose up -d
   ```
4. Create a `.env` file based on `.env.example` and set all required environment variables.

5. To import database dumps:

   ```sh
   // sql file
   docker exec -i $(docker compose ps -q postgres) pg_restore -U admin -d database-technibus --clean --if-exists --no-owner < dump.sql

   // text file
   docker exec -i $(docker compose ps -q postgres) psql -U admin -d database-technibus < dump.dump
   ```

6. Start the development server:

   ```sh
   npm run dev
   ```

7. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the app running.

---

## Deployment

1. Add the remote server:
   ```sh
   git remote add <server_name> ssh://dokku@<server_address>:822/<app_name>
   ```
2. Push the code to deploy:
   ```sh
   git push <server_name> main
   ```

---

## Troubleshooting

### Docker container restart loop

If the Docker container keeps restarting, try the following steps:

```sh
docker-compose down
docker volume rm <dokku_app_name>-next_postgres_data
docker-compose up -d
```

### Checking logs

To check container logs for debugging:

```sh
docker compose logs -f <service_name>
```

### Connecting to PostgreSQL container

To manually inspect the database, connect to PostgreSQL inside the running container:

```sh
docker exec -it $(docker compose ps -q postgres) psql -U admin -d database
```
