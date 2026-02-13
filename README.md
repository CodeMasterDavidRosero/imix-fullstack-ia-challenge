# Prueba Tecnica Imix - Full Stack (IA y Arquitectura)

Este repositorio contiene la solucion del reto tecnico con:

- Backend en NestJS + MongoDB (`imix-backend`)
- Frontend en Angular (`imix-frontend`)
- Flujo de solicitudes con enriquecimiento por IA mock

## 1. Diseno de Arquitectura

### Componentes

- `Angular Web App`: captura la solicitud y muestra estado/resultado.
- `NestJS API`: valida, procesa y expone endpoints REST.
- `MongoDB Atlas`: persistencia de solicitudes.
- `Mock IA Service`: clasificacion/prioridad simulada en el backend.
- `Swagger`: documentacion de contratos en `/api/docs`.

### Flujo

1. Frontend envia `POST /requests` con `fullName, email, phone, service, message`.
2. Backend valida DTO (class-validator + ValidationPipe global).
3. Backend persiste la solicitud en MongoDB.
4. Backend ejecuta enriquecimiento mock IA (categoria, prioridad, resumen).
5. Backend retorna `request + ai`.
6. Frontend muestra estado de carga y resultado final.

### Manejo de errores

- Validacion de payload con `whitelist` y `forbidNonWhitelisted`.
- Errores de validacion retornan `400 Bad Request`.
- Errores de red/backend en frontend se muestran en UI.

### Escalabilidad

- API stateless para escalar horizontalmente.
- MongoDB Atlas permite escalar almacenamiento y throughput.
- Separacion de responsabilidades facilita evolucion a microservicios.

## 2. Respuestas de Arquitectura y Seguridad (Reto)

### Esquema de capas y proteccion de datos privados

- Presentacion: Angular.
- Aplicacion: controllers/services Nest.
- Infraestructura: MongoDB, proveedores externos.
- Se evita exponer data sensible al frontend; solo se retorna lo minimo necesario.

### Recuperacion de datos del usuario en multiples etapas

- Primera carga: se obtiene contexto base del usuario.
- Etapas siguientes: se reutiliza contexto en cache segura (ej. Redis) con TTL.
- Se evita consultar BD en cada interaccion del frontend.

### Si backend de procesamiento no conoce seguridad/usuario

- La responsabilidad la toma una capa previa: API Gateway/BFF.
- El gateway valida token, scopes y politicas.
- El backend recibe identidad ya validada y claims minimos.

### Web y movil con look & feel diferente

- Enfoque recomendado: BFF por canal (`bff-web`, `bff-mobile`) o composable APIs.
- Mismo dominio backend, adaptadores por canal para formato/latencia.
- Permite UX nativa sin duplicar la logica central de negocio.

### Manejo de sesion

- Sesion stateless con JWT de corta vida + refresh token.
- Revocacion/rotacion de refresh token en almacenamiento seguro.

### Proteger info sensible sin consultar BD en cada request frontend

- Token con claims minimos no sensibles.
- Cache de contexto por usuario (server-side) con TTL y cifrado en reposo.
- El frontend nunca recibe secretos ni atributos no necesarios.

### Integracion SSO y su implementacion

- Estandar: OpenID Connect + OAuth2.
- IdP central (Auth0/Keycloak/Azure AD o propio).
- Apps confian en el IdP; no capturan credenciales localmente.
- Backend valida `issuer`, `audience`, `signature`, `scope`.

## 3. Parte Backend implementada

- `GET /health`: estado del servicio y conectividad Mongo.
- `POST /requests`: crea solicitud, guarda en Mongo y retorna enriquecimiento IA mock.
- `GET /requests`: lista solicitudes.
- Validacion con DTO + class-validator.
- Swagger en `http://localhost:3001/api/docs`.

## 4. Parte Frontend implementada

- Vista `request-form` con formulario y campos reales del contrato.
- Estado de envio (`loading`), error y respuesta.
- Integracion HTTP real a `http://localhost:3001/requests`.

## 5. Criterio Tecnico (Reto Parte 4)

### Mejor modelo de despliegue

- Contenedores (Docker) + orquestacion (Kubernetes/ECS).
- API y frontend desplegados por separado.
- MongoDB Atlas gestionado.

### Escalabilidad transaccional, concurrencia y datos

- Escalado horizontal de API por replicas.
- Pooling de conexiones a Mongo.
- Indices por fecha/estado y paginacion en listados.

### Mejoras para produccion

- Observabilidad (logs estructurados, metricas, trazas).
- Rate limiting y WAF.
- CI/CD con quality gates (lint, test, seguridad).
- Manejo de secretos con vault.

### Limites de responsabilidad entre servicios

- Frontend: UX y validacion basica.
- API: reglas de negocio y orquestacion.
- IA service: enriquecimiento especializado.
- Gateway/IdP: autenticacion/autorizacion.

## 6. Ejecucion local

### URLs locales

- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:3001`
- Swagger: `http://localhost:3001/api/docs`
- Health check: `http://localhost:3001/health`

### Backend

```bash
cd imix-backend
npm install
npm run start:dev
```

Pruebas backend:

```bash
cd imix-backend
npm run test
npm run test:e2e
```

### Frontend

```bash
cd imix-frontend
npm install
npm start
```

Build frontend:

```bash
cd imix-frontend
npm run build
```

## 7. Variables de entorno backend

Usar `imix-backend/.env.example` como base:

- `MONGODB_URI`
- `PORT`
- `CORS_ORIGINS`

Crear el archivo local antes de arrancar backend:

```bash
cd imix-backend

# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Actualizar `MONGODB_URI` en `.env` con una URI valida.

No versionar secretos reales en Git (`.env` esta ignorado).
