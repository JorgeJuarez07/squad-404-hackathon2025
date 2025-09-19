# AgroMarket (squad-404-hackathon2025)

> Una aplicación web full-stack diseñada para conectar a productores agrícolas directamente con los consumidores, facilitando la compra y venta de productos frescos del campo.

---

## 📋 Tabla de Contenidos
1. [Prerrequisitos](#-prerrequisitos)
2. [Instalación y Configuración](#️-instalación-y-configuración)
3. [Ejecutar la Aplicación](#-ejecutar-la-aplicación)
4. [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 📄 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado el siguiente software en tu sistema:

- **Node.js**: Se recomienda la versión `v18.x` o superior. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
- **npm**: Generalmente se instala de forma automática junto con Node.js.

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para configurar el entorno de desarrollo por primera vez.

### 1. Clona el Repositorio
```bash
git clone <URL-de-tu-repositorio>
```

### 2. Navega al Directorio Raíz
```bash
cd squad-404-hackathon2025
```

### 3. Configura las Variables de Entorno
El backend requiere un archivo `.env` para gestionar las claves de la API y la configuración del servidor.

- Navega a la carpeta del backend:
  ```bash
  cd backend
  ```
- Crea un archivo llamado `.env` y copia el siguiente contenido, reemplazando los valores con tus propias credenciales.
  ```env
  # Variables de autenticación (ZITADEL)
  ZITADEL_CLIENT_ID=TU_CLIENT_ID
  ZITADEL_CLIENT_SECRET=TU_CLIENT_SECRET
  ZITADEL_ISSUER=TU_ISSUER_URL
  ZITADEL_REDIRECT_URI=http://localhost:3000/callback

  # Puerto del servidor backend
  PORT=4000
  ```
- Vuelve a la carpeta raíz del proyecto:
  ```bash
  cd ..
  ```

### 4. Instala todas las Dependencias
Ejecuta el siguiente comando desde la carpeta **raíz** para instalar las dependencias del backend y del frontend.

```bash
npm install && npm run install:frontend
```

---

## 🚀 Ejecutar la Aplicación

Una vez que la instalación esté completa, puedes iniciar ambos servidores de desarrollo con un único comando desde la carpeta **raíz**.

```bash
npm run dev
```

Este comando utilizará `concurrently` para lanzar ambos procesos al mismo tiempo. Verás la salida de ambos en tu terminal.

- El **backend** estará disponible en `http://localhost:4000`.
- El **frontend** estará disponible en `http://localhost:3000` y debería abrirse automáticamente en tu navegador.

Para detener ambos servidores, presiona `Ctrl + C` en la terminal donde se está ejecutando el comando.

---

## 📂 Estructura del Proyecto

El proyecto está organizado en dos carpetas principales:

-   `backend/`: Contiene el servidor de Node.js y Express, encargado de la lógica de negocio y la comunicación con servicios externos.
-   `front_app/`: Contiene la aplicación de React (Create React App) que constituye la interfaz de usuario.