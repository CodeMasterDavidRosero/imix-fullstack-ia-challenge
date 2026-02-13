# Imix Backend (NestJS)

API para recepcion y procesamiento de solicitudes con enriquecimiento IA mock.

## Ejecucion local

```bash
cd imix-backend
npm install
npm run start:dev
```

Por defecto corre en `http://localhost:3001`.

## URLs locales

- API base: `http://localhost:3001`
- Swagger: `http://localhost:3001/api/docs`
- Health: `http://localhost:3001/health`

## Endpoints principales

- `POST /requests`
- `GET /requests`
- `GET /health`

## Pruebas

```bash
cd imix-backend
npm run test
npm run test:e2e
```

## Variables de entorno

Copiar desde `.env.example`:

- `MONGODB_URI`
- `PORT` (actual `3001`)
- `CORS_ORIGINS`

Crear archivo local `.env` (no versionado):

```bash
# Windows (PowerShell/cmd)
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Luego editar `.env` y reemplazar `MONGODB_URI` con una cadena valida de MongoDB Atlas o local.
El backend falla al iniciar si `MONGODB_URI` no existe.

## Troubleshooting rapido

- Error `EADDRINUSE`:
  - El puerto ya esta ocupado por otro proceso.
  - Cambia `PORT` en `.env` o libera el proceso que usa ese puerto.

## Notas

- Validacion con `class-validator` + `ValidationPipe`.
- Persistencia en MongoDB Atlas.
- Documentacion de arquitectura y decisiones tecnicas en `../README.md`.
