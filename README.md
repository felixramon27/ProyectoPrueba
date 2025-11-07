# ProyectoPrueba

ProyectoPrueba es una aplicación web fullstack que permite la gestión de usuarios. El proyecto está dividido en dos partes principales:

- **Backend**: API REST construida con Node.js y Express.
- **Frontend**: Interfaz de usuario desarrollada con React, Vite y Tailwind CSS.

## Características principales

- Listado, creación, edición y eliminación de usuarios.
- Interfaz moderna y responsiva.
- Comunicación entre frontend y backend mediante API REST.

## 🎉 Notificaciones (Toasts)

El sistema incluye notificaciones toast elegantes para:

- ✅ Creación exitosa de usuarios
- ✅ Actualización exitosa de usuarios
- ✅ Eliminación exitosa de usuarios
- ✅ Aplicación de filtros
- ❌ Errores de validación
- ❌ Errores de servidor

Las notificaciones utilizan `react-hot-toast` y están completamente integradas con el diseño de la aplicación.

## Estructura del proyecto

```text
ProyectoPrueba/
├── Backend/
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
└── README.md
```

## Tecnologías utilizadas

### Tecnologías Backend

- Node.js
- Express

### Tecnologías Frontend

- React
- Vite
- Tailwind CSS

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/felixramon27/ProyectoPrueba.git
cd ProyectoPrueba
```

### 2. Configurar el Backend

```bash
cd Backend
npm install
npm start
```

El servidor se ejecutará por defecto en `http://localhost:5000`.

### 3. Configurar el Frontend

```bash
cd ../Frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Uso

1. Accede a la interfaz web en tu navegador.
2. Realiza operaciones CRUD sobre los usuarios.
3. Los cambios se reflejan en tiempo real gracias a la integración con el backend.

## Scripts disponibles

### Scripts Backend

- `npm start`: Inicia el servidor Express.

### Scripts Frontend

- `npm run dev`: Inicia el servidor de desarrollo de Vite.
- `npm run build`: Genera la versión de producción.

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para sugerencias o mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.
