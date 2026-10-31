# Come en Alvear — Backend

Backend de **Come en Alvear**, la guía gastronómica y de hospedajes de Alvear (Corrientes).

Incluye:

- Un **panel de administración** (Handlebars) para cargar locales, menús, hospedajes y habitaciones.
- Una **API REST** que consume el frontend en React.
- Envío de mails desde el formulario de contacto (Nodemailer).
- Subida de imágenes a Cloudinary.

## Tecnologías

| Pieza | Tecnología |
| --- | --- |
| Servidor | Node.js + Express 5 |
| Base de datos | MySQL / MariaDB (`mysql2`) |
| Panel admin | Handlebars (`hbs`) + Bootstrap 5 |
| Sesiones | `express-session` |
| Imágenes | Cloudinary + `express-fileupload` |
| Mails | Nodemailer |
| Desarrollo | nodemon, morgan, dotenv |

## Requisitos

- Node.js 18 o superior
- MySQL o MariaDB (por ejemplo XAMPP con phpMyAdmin)
- Cuenta de [Cloudinary](https://cloudinary.com)
- Cuenta SMTP para el formulario de contacto (para desarrollo sirve [Mailtrap](https://mailtrap.io))

## Instalación

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Crear la base de datos y las tablas (ver [Base de datos](#base-de-datos)).
3. Crear el archivo `.env` en la raíz (ver [Variables de entorno](#variables-de-entorno)).
4. Iniciar el servidor:

   ```bash
   npm start
   ```

El servidor queda en `http://localhost:3000` (o el puerto definido en `PORT`). Al entrar a la raíz redirige al login del panel admin.

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto (ya está incluido en el `.gitignore`):

```dotenv
PORT=3000

MYSQL_HOST=localhost
MYSQL_DB_NAME=comeenalvear
MYSQL_USER=root
MYSQL_PASSWORD=

CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=tu_usuario_smtp
SMTP_PASS=tu_password_smtp
```

Reemplazar los valores de ejemplo por los reales, **sin** los signos `< >`. `CLOUDINARY_URL` se arma con los datos del Dashboard de Cloudinary, en ese orden: API Key, API Secret y Cloud name.

Además, el destinatario de los mensajes de contacto está en `routes/api.js` (campo `to` del endpoint `POST /api/contacto`). Hay que cambiarlo por el mail real donde se quieren recibir las consultas.

## Base de datos

Crear la base y las tablas, en este orden (las tablas hijas dependen de las padres):

```sql
CREATE DATABASE comeenalvear CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE comeenalvear;

CREATE TABLE usuarios (
  id int(11) NOT NULL AUTO_INCREMENT,
  usuario varchar(250) NOT NULL,
  password varchar(250) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE locales (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(150) NOT NULL,
  slug varchar(150) NOT NULL,
  descripcion text NOT NULL,
  direccion varchar(250) DEFAULT NULL,
  telefono varchar(10) DEFAULT NULL,
  horario varchar(150) DEFAULT NULL,
  tags varchar(250) DEFAULT NULL,
  img_id varchar(250) DEFAULT NULL,
  mapa_url varchar(500) DEFAULT NULL,
  delivery_precio decimal(10,2) DEFAULT NULL,
  menu_pdf_url varchar(500) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE hospedajes (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(150) NOT NULL,
  slug varchar(150) NOT NULL,
  descripcion text NOT NULL,
  direccion varchar(250) DEFAULT NULL,
  telefono varchar(10) DEFAULT NULL,
  capacidad_max int(11) DEFAULT NULL,
  precio_base decimal(10,2) DEFAULT NULL,
  img_id varchar(250) DEFAULT NULL,
  tipo varchar(50) DEFAULT NULL,
  horario_ingreso varchar(50) DEFAULT NULL,
  tags varchar(250) DEFAULT NULL,
  mapa_url varchar(500) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE categorias_menu (
  id int(11) NOT NULL AUTO_INCREMENT,
  local_id int(11) NOT NULL,
  titulo varchar(100) NOT NULL,
  slug varchar(100) NOT NULL,
  avisos text DEFAULT NULL,
  orden int(11) DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE items_menu (
  id int(11) NOT NULL AUTO_INCREMENT,
  categoria_id int(11) NOT NULL,
  nombre varchar(150) NOT NULL,
  descripcion text DEFAULT NULL,
  precio decimal(10,2) NOT NULL,
  img_id varchar(250) DEFAULT NULL,
  orden int(11) DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (categoria_id) REFERENCES categorias_menu(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE habitaciones (
  id int(11) NOT NULL AUTO_INCREMENT,
  hospedaje_id int(11) NOT NULL,
  numero varchar(150) NOT NULL,
  capacidad int(11) NOT NULL,
  precio decimal(10,2) NOT NULL,
  comodidades text DEFAULT NULL,
  img_id varchar(250) DEFAULT NULL,
  orden int(11) DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (hospedaje_id) REFERENCES hospedajes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

Relaciones: un local tiene varias categorías de menú y cada categoría tiene varios ítems; un hospedaje tiene varias habitaciones. Al borrar un local u hospedaje, la base borra en cascada lo que depende de él.

### Crear el usuario administrador

La contraseña se guarda como hash MD5, que se calcula directamente en el `INSERT`:

```sql
INSERT INTO usuarios (usuario, password) VALUES ('admin', MD5('tu_contraseña'));
```

## Estructura del proyecto

```
├── app.js                          # configuración de Express, sesión y rutas
├── bin/www                         # arranque del servidor HTTP
├── models/
│   ├── bd.js                       # pool de conexiones a MySQL
│   ├── usuariosModel.js
│   ├── localesModel.js
│   ├── hospedajesModel.js
│   ├── categoriasMenuModel.js
│   ├── itemsMenuModel.js
│   └── habitacionesModel.js
├── routes/
│   ├── index.js                    # redirige al login
│   ├── api.js                      # API REST pública
│   └── admin/
│       ├── login.js
│       ├── home.js
│       ├── locales.js
│       ├── hospedajes.js
│       ├── categoriasMenu.js       # anidada en un local
│       ├── itemsMenu.js            # anidada en una categoría
│       └── habitacionesHospedaje.js  # anidada en un hospedaje
├── views/
│   ├── error.hbs
│   ├── partials/breadcrumb.hbs     # migas de pan del panel
│   └── admin/                      # layout, login, home y vistas de cada CRUD
└── public/
    ├── stylesheets/style.css
    └── images/logo.png
```

## Panel de administración

Todas las rutas, excepto el login, requieren sesión iniciada. Si no la hay, redirigen a `/admin/login`.

| Ruta | Descripción |
| --- | --- |
| `/admin/login` | Inicio de sesión (`/admin/login/logout` cierra la sesión) |
| `/admin/home` | Panel principal con accesos a las secciones |
| `/admin/locales` | Listado de locales; agregar, modificar y eliminar |
| `/admin/locales/:localId/menu` | Categorías del menú de un local |
| `/admin/locales/:localId/menu/:categoriaId/items` | Platos de una categoría |
| `/admin/hospedajes` | Listado de hospedajes; agregar, modificar y eliminar |
| `/admin/hospedajes/:hospedajeId/habitaciones` | Habitaciones de un hospedaje |

Cada sección tiene las acciones `/agregar`, `/modificar/:id` y `/eliminar/:id`. La navegación entre niveles se hace con las migas de pan de la parte superior de cada pantalla.

## API REST

Base: `http://localhost:3000/api` (CORS habilitado para el frontend).

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/locales` | Listado de locales |
| `GET` | `/hospedajes` | Listado de hospedajes |
| `GET` | `/locales/:slug/menu` | Datos del local y su menú (categorías con ítems anidados) |
| `GET` | `/hospedajes/:slug/habitaciones` | Datos del hospedaje y sus habitaciones |
| `POST` | `/contacto` | Envía un mail con los datos del formulario |

Los endpoints por `slug` responden `404` con `{ "error": true, "message": "..." }` si el slug no existe.

### `GET /api/locales/:slug/menu`

```json
{
  "local": { "nombre": "Good Food", "telefono": "3772304855", "menu_pdf_url": "https://..." },
  "categorias": [
    {
      "id": 1,
      "titulo": "Hamburguesas",
      "slug": "hamburguesas",
      "avisos": [],
      "items": [
        { "id": 1, "nombre": "Clásica", "descripcion": "...", "precio": 5000, "imagen": "https://..." }
      ]
    }
  ]
}
```

### `GET /api/hospedajes/:slug/habitaciones`

```json
{
  "hospedaje": { "nombre": "Hotel Alto Uruguay", "telefono": "3772578987" },
  "habitaciones": [
    { "id": 1, "numero": "Habitación 1 Simple", "capacidad": 1, "precio": 15000, "comodidades": "...", "imagen": "https://..." }
  ]
}
```

### `POST /api/contacto`

Cuerpo JSON:

```json
{ "nombre": "...", "email": "...", "telefono": "...", "mensaje": "..." }
```

Responde `201` con `{ "error": false, "message": "Mensaje Enviado" }`, o `500` si el envío falla.

## Convenciones de datos

- **`slug`**: identificador único y legible de locales, hospedajes y categorías (por ejemplo `good-food`). El frontend lo usa en las URLs (`/menu/:slug`, `/hospedajes/:slug`).
- **`telefono`**: 10 dígitos, sin `+54`, espacios ni guiones (por ejemplo `3772304855`). El panel valida el formato. El frontend arma el formato visible y el link de WhatsApp (`wa.me/549...`).
- **`tags`**: texto separado por comas (`"Cena,Bebidas S/Alcohol"`).
- **`avisos`** (categorías de menú): texto separado por `|`; la API lo devuelve como array.
- **Precios**: se guardan como número (`DECIMAL`) y el frontend les da formato. Si un plato tiene variantes (por ejemplo simple y doble), se cargan como platos separados.
- **`delivery_precio`**: vacío significa que el local no tiene delivery.
- **Imágenes**: en la base se guarda solo el `public_id` de Cloudinary (`img_id`). La API devuelve la URL ya armada en el campo `imagen`.
- **`orden`**: controla el orden de categorías, ítems y habitaciones (se ordena por `orden` y luego por `id`).

## Limitaciones conocidas

- Las contraseñas usan MD5, que no es adecuado para producción. Conviene migrar a bcrypt o argon2.
- El `secret` de la sesión está escrito en `app.js`; debería pasar a una variable de entorno. Las sesiones se guardan en memoria, así que se pierden al reiniciar el servidor.
- La eliminación se hace con enlaces `GET` (`/eliminar/:id`), sin confirmación ni protección CSRF.
- Al eliminar un local o un hospedaje, solo se borra de Cloudinary su propia imagen; las de sus platos y habitaciones quedan huérfanas.
- La API acepta peticiones desde cualquier origen; antes de publicar conviene limitar CORS al dominio del frontend.
