# Dictionary

🚀 Backend for language learners 🎓 to easily write down, store, and memorize vocabulary and phrases 📘 with advanced review techniques 🔥

## Run

```bash
cp .env.example .env.development
cp .env.example .env.production
```

Edit env-files for your purposes.

### Development

```bash
docker compose --env-file .env.development -f docker-compose.yml -f docker-compose.development.yml up --build
```

### Production

```bash
docker compose --env-file .env.production up --build -d
```

### Shutdown

```bash
docker compose down
# docker volume rm dictionary_postgres-data
```

## Database connection

### Development

```bash
psql -h localhost -p 5432 -U dictionary -d dictionary
```

#### Migrations

##### Example of how to make migrations

Using the predefined npm scripts:

```bash
npm run migrate:dev -- --name migration_name
```

Using the command itself:

```bash
docker compose exec dictionary-backend npx prisma migrate dev --name migration_name
```

In case of running prisma commands on your host (outside the docker container), make sure you have set the `DATABASE_URL` variable in your environment.

You can pass it directly:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dictionary npx prisma migrate dev --name migration_name
```

or create `prisma/.env` file with the `DATABASE_URL` variable and then just:

```bash
npx prisma migrate dev --name migration_name
```

### Production

In this mode the database container is not accessible from outside, so we need to connect to the backend container first to access the database service from it:

```bash
docker exec -it dictionary-backend /bin/sh
apk update
apk add postgresql-client
psql -h postgres -U dictionary -d dictionary # hostname (-h) can be either the service name or the container name from the docker compose config
```
