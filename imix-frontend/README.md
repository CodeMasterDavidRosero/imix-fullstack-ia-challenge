# Imix Frontend (Angular)

Frontend para crear solicitudes y consumir la API de `imix-backend`.

## Ejecucion local

```bash
cd imix-frontend
npm install
npm start
```

## URLs locales

- Frontend: `http://localhost:4200`
- Backend esperado por defecto: `http://localhost:3001`
- Swagger backend: `http://localhost:3001/api/docs`

## Configuracion API

La URL base de la API se define en:

- `src/environments/environment.ts` (`apiBaseUrl`)

Valor local actual:

- `http://localhost:3001`

## Build

```bash
cd imix-frontend
npm run build
```
