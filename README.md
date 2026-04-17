## Development Setup

### Prerequisites

Ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js & NPM](https://nodejs.org/en/download/)

### Export current database from server

Run the following command **on your local machine**:

```sh
ssh -p 822 <server_username>@<server_address> "dokku postgres:export <dokku_app_name>" > dump.sql
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

### ⚠️ Important: Full-Text Search (FTS) Index Setup

If you ever delete, rebuild, or start the database from scratch (without importing a dump that already contains it), you **must** manually create the GIN Index required for the Search page's Full-Text Search performance.

Connect to your database client and run the following SQL query:

```sql
CREATE INDEX search_fts_idx ON "search" USING GIN (
  (
    setweight(to_tsvector('portuguese'::regconfig, title::text), 'A') ||
    setweight(to_tsvector('portuguese'::regconfig, coalesce(content, '')::text), 'B')
  )
);
```

_Tip: You can also run this directly via Docker by connecting to the `psql` CLI (see the Troubleshooting section) and pasting the query above._

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

   Example:

   ```sh
   git remote add rufus ssh://dokku@rufus.jogajunto.co:822/technibus-site
   ```

2. Push the code to deploy:
   ````
   ```sh
   git push <server_name> main
   ````

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
