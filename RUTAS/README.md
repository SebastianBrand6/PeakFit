# Rutas de PeakFit API

Usa `http://localhost:8080` como URL base. Inicia la aplicación con `mvn spring-boot:run` antes de probar las rutas en Postman.

## Aforo

| Método | URL | Descripción |
|---|---|---|
| GET | `http://localhost:8080/api/occupancy` | Consulta el aforo actual. |
| POST | `http://localhost:8080/api/occupancy/entries` | Registra la entrada de un usuario. |
| POST | `http://localhost:8080/api/occupancy/exits` | Registra la salida de un usuario. |

Para las dos solicitudes `POST`, selecciona **Body → raw → JSON** y usa:

```json
{
  "userId": "usuario-123"
}
```

## Gimnasio y analítica

| Método | URL | Descripción |
|---|---|---|
| GET | `http://localhost:8080/api/gym/config` | Consulta la configuración del gimnasio. |
| GET | `http://localhost:8080/api/analytics/peak-hours` | Consulta las horas de mayor aforo. |
| GET | `http://localhost:8080/api/analytics/peak-hours?limit=10` | Ejemplo con límite personalizado (entre 1 y 24; predeterminado: 5). |

## Autenticación

| Método | URL | Detalles |
|---|---|---|
| POST | `http://localhost:8080/api/auth/login` | Recibe `{"email":"correo@ejemplo.com","password":"tu-clave"}`. Actualmente responde `501 Not Implemented`. |
| GET | `http://localhost:8080/api/auth/profile` | Requiere el encabezado `Authorization`. Actualmente responde `501 Not Implemented`. |

Configura `Content-Type: application/json` en las solicitudes `POST` que envían un cuerpo JSON.
