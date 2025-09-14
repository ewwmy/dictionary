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
docker compose --env-file .env.development -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Production

```bash
docker compose --env-file .env.production up --build -d
```

### Shutdown

```bash
docker compose down
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

Inside the docker container:

```bash
docker compose exec dictionary-backend npx prisma migrate dev --name migration_name
```

Outside the docker container (make sure you have set the `DATABASE_URL` variable in your environment):

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dictionary npx prisma migrate dev --name migration_name
```

or (`prisma/.env` file with the `DATABASE_URL` variable must exist):

```bash
npx prisma migrate dev --name migration_name
```

#### Seeding

> Warning! Seeding creates an admin user. You must set a strong `ADMIN_PASSWORD` in `.env` file you use for production before seeding and change it through API as soon as possible.

##### Inside the Docker container

```bash
docker compose exec dictionary-backend npx prisma db seed
```

With specific `.env` file:

```bash
docker compose --env-file .env.development exec dictionary-backend npx prisma db seed
```

##### Outside Docker

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dictionary npx prisma db seed
```

or just (if the `DATABASE_URL` environment variable is set properly):

```bash
npx prisma db seed
```

### Production

In this mode the database container is not accessible from outside, so we need to connect to the backend container first to access the database service from it:

```bash
docker exec -it dictionary-backend /bin/sh
apk update
apk add postgresql-client
psql -h postgres -U dictionary -d dictionary # hostname (-h) can be either the service name or the container name from the docker compose config
```
