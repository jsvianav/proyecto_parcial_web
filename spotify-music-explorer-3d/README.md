# 🎵 Spotify Music Explorer 3D

> Proyecto académico — Parcial universitario

Una aplicación web interactiva que permite explorar música usando la **Spotify Web API**, con un disco de vinilo 3D como elemento central de la experiencia.
---

## 🛠️ Stack tecnológico

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![Three.js](https://img.shields.io/badge/Three.js-latest-000000?logo=threedotjs)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter)
![Axios](https://img.shields.io/badge/Axios-latest-5A29E4)

- **React 18** + **Vite** — framework y bundler
- **Tailwind CSS v3** — estilos utility-first
- **React Router DOM v6** — navegación SPA
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — escena 3D
- **Axios** — peticiones HTTP
- **Spotify Web API** — datos de música

---

## 📋 Requisitos previos

- **Node.js 18+** y **npm**
- Cuenta de **Spotify Developer** (gratuita)

---

## 🔑 Cómo obtener las credenciales de Spotify

1. Ve a [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) e inicia sesión.
2. Haz clic en **"Create app"**.
3. Completa el formulario:
   - **App name:** `Spotify Music Explorer 3D`
   - **App description:** cualquier descripción
   - **Redirect URI:** `http://localhost:5173` (requerido aunque no se usa)
   - **Which API/SDKs are you planning to use?** → marca **Web API**
4. Acepta los términos y haz clic en **Save**.
5. En el dashboard de tu app, haz clic en **Settings** y copia el **Client ID** y **Client Secret**.

---

## 🚀 Instalación y ejecución

```bash
# 1. Clona el repositorio
git clone <repo-url>
cd spotify-music-explorer-3d

# 2. Instala dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env

# 4. Edita .env con tus credenciales de Spotify
#    VITE_SPOTIFY_CLIENT_ID=tu_client_id_aqui
#    VITE_SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui

# 5. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Preview del build de producción |

---

## 📁 Estructura del proyecto

```
spotify-music-explorer-3d/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/         # Header, Footer
│   │   ├── search/         # SearchBar, TypeFilter
│   │   ├── cards/          # ArtistCard, AlbumCard, TrackCard
│   │   ├── three/          # VinylScene, VinylRecord, ReflectiveFloor
│   │   ├── ui/             # LoadingSpinner, ErrorMessage, EmptyState, Pagination
│   │   └── favorites/      # FavoritesList
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── SearchPage.jsx
│   │   ├── DetailPage.jsx
│   │   └── FavoritesPage.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   ├── useSpotifyAuth.js
│   │   └── useSpotifySearch.js
│   ├── services/
│   │   └── spotifyAPI.js
│   ├── context/
│   │   ├── FavoritesContext.jsx
│   │   └── PlayerContext.jsx
│   ├── utils/
│   │   └── formatters.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## 🎵 API utilizada: Spotify Web API

La app usa el **Client Credentials Flow** — no requiere login del usuario, solo acceso a datos públicos de Spotify.

### Autenticación

```
POST https://accounts.spotify.com/api/token
Authorization: Basic <base64(client_id:client_secret)>
Body: grant_type=client_credentials
```

El token se cachea en memoria y se renueva automáticamente cuando expira (cada hora).

### Endpoints consumidos

| Endpoint | Uso |
|----------|-----|
| `GET /v1/search` | Búsqueda de artistas, álbumes y canciones |
| `GET /v1/artists/{id}` | Perfil de un artista |
| `GET /v1/artists/{id}/top-tracks` | Top 10 tracks del artista |
| `GET /v1/artists/{id}/albums` | Discografía del artista |
| `GET /v1/albums/{id}` | Detalle de un álbum + tracklist |
| `GET /v1/tracks/{id}` | Detalle de una canción |

---

## 🎮 Integración 3D: Disco de Vinilo

El elemento 3D central es un **disco de vinilo** construido con:

- **Three.js** — motor 3D WebGL
- **@react-three/fiber** — React renderer para Three.js
- **@react-three/drei** — helpers: `useTexture`, `OrbitControls`, `MeshReflectorMaterial`, `Environment`, `Sparkles`

### Características del vinilo

- **Geometría:** `CylinderGeometry` con material negro metálico + surcos con `TorusGeometry`
- **Rotación automática:** ~0.3 rad/s en reposo, ~2 rad/s al reproducir un preview
- **Interacción:** arrastrable con el mouse via `OrbitControls`
- **Piso reflectivo:** `MeshReflectorMaterial` para un efecto espejo elegante
- **Iluminación:** `pointLight` verde Spotify + `Environment` preset "night"
- **Partículas:** `Sparkles` en la página de inicio

---

## ☁️ Despliegue en Vercel

1. Haz push del proyecto a GitHub (sin el archivo `.env`).
2. Ve a [https://vercel.com](https://vercel.com) y crea una cuenta o inicia sesión.
3. Haz clic en **"Add New Project"** e importa tu repositorio.
4. En la sección **"Environment Variables"**, agrega:
   - `VITE_SPOTIFY_CLIENT_ID` → tu Client ID
   - `VITE_SPOTIFY_CLIENT_SECRET` → tu Client Secret
5. Haz clic en **"Deploy"**. Vercel detectará automáticamente que es un proyecto Vite.

---

## ⚠️ Nota de seguridad

> **Importante:** Este proyecto expone el `VITE_SPOTIFY_CLIENT_SECRET` en el frontend (código JavaScript del cliente), lo cual **no es seguro para producción** ya que cualquier usuario puede inspeccionarlo.
>
> Para producción, la alternativa correcta es crear una **Vercel Serverless Function** (o cualquier backend) que maneje la autenticación con Spotify y devuelva el token al cliente sin exponer el secret.
>

