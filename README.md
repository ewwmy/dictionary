# Dictionary

🚀 Backend for language learners 🎓 to easily write down, store, and memorize vocabulary and phrases 📘 with advanced review techniques 🔥

## Run

```bash
cp .env.example .env.development
cp .env.example .env.production
```

### Development

```bash
docker compose --env-file .env.development up --build
```

### Production

```bash
docker compose --env-file .env.production up --build
```

### Shutdown

```bash
docker compose down
# docker volume rm dictionary_postgres-data
```
