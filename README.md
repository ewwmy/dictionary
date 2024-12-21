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

### Production

In this mode the database container is not accessible from outside, so we need to connect to the backend container first to access the database service from it:

```bash
docker exec -it dictionary-backend /bin/sh
apk update
apk add postgresql-client
psql -h postgres -U dictionary -d dictionary # hostname (-h) can be either the service name or the container name from the docker compose config
```
