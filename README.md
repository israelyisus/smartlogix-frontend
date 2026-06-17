# SmartLogix — Frontend

Interfaz web de SmartLogix construida con React. Permite a las PYMEs gestionar inventario, crear pedidos, hacer seguimiento de envíos y ver notificaciones del sistema.

## Tecnologías

- React 18
- React Router (navegación)
- Axios (consumo de API REST)
- CSS plano con variables de tema oscuro

## Patrones de diseño implementados

- **Singleton** — `services/api.js` mantiene una única instancia de Axios configurada con el token JWT para todas las peticiones.
- **Observer** — `context/AuthContext.js` notifica a todos los componentes suscritos cuando cambia el estado de autenticación del usuario.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- El backend de SmartLogix corriendo en `http://localhost:8080` (ver repositorio principal para levantar todo con Docker)

## Instalación

```bash
npm install
```

## Ejecución en modo desarrollo

```bash
npm start
```

La aplicación se abre automáticamente en `http://localhost:3000`.

## Construcción para producción

```bash
npm run build
```

Genera la carpeta `build/` con los archivos optimizados, listos para servir con Nginx u otro servidor estático.

## Estructura del proyecto

```
frontend/
├── public/              Archivos estáticos (index.html, íconos)
├── src/
│   ├── components/      Componentes reutilizables (Navbar, etc.)
│   ├── context/          AuthContext (Observer Pattern)
│   ├── pages/            Páginas: Dashboard, Inventario, Pedidos, Envíos, Notificaciones, Perfil
│   ├── services/         api.js (Singleton Axios)
│   ├── App.js             Definición de rutas
│   └── index.js           Punto de entrada
├── Dockerfile             Build multi-stage con Nginx
├── nginx.conf             Configuración de Nginx para SPA
└── package.json
```

## Cómo probar la aplicación

1. Asegúrate de que el backend esté corriendo (`docker-compose up` en el repositorio principal).
2. Ejecuta `npm start`.
3. Regístrate como usuario PYME desde la pantalla de login.
4. Inicia sesión y navega por Dashboard, Inventario, Pedidos y Envíos para verificar que los datos se cargan correctamente desde la API.

## Variables de entorno

La URL del API Gateway está configurada directamente en `src/services/api.js`:

```javascript
const API_URL = 'http://localhost:8080';
```

Si el backend corre en otra dirección, modifica esa constante.
