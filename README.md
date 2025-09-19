# AgroMarket (squad-404-hackathon2025)

> A full-stack web application designed to connect agricultural producers directly with consumers, facilitating the purchase and sale of fresh farm products.

---

## 📋 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Installation and Setup](#️-installation-and-setup)
3. [Running the Application](#-running-the-application)
4. [Project Structure](#-project-structure)

---

## 📄 Prerequisites

Before you begin, ensure you have the following software installed on your system:

- **Node.js**: Version `v18.x` or higher is recommended. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: This is usually installed automatically with Node.js.

---

## ⚙️ Installation and Setup

Follow these steps to set up the development environment for the first time.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
```

### 2. Navigate to the Root Directory
```bash
cd squad-404-hackathon2025
```



### 3. Install All Dependencies
Run the following command from the **root** directory to install dependencies for both the backend and frontend.

```bash
npm install && npm run install:frontend
```

---

## 🚀 Running the Application

Once the installation is complete, you can start both development servers with a single command from the **root** directory.

```bash
npm run dev
```

This command will use `concurrently` to launch both processes at the same time. You will see the output from both servers in your terminal.

- The **backend** will be available at `http://localhost:4000`.
- The **frontend** will be available at `http://localhost:3000` and should open automatically in your browser.

To stop both servers, press `Ctrl + C` in the terminal where the command is running.

---

## 📂 Project Structure

The project is organized into two main folders:

-   `backend/`: Contains the Node.js and Express server, responsible for business logic and communication with external services.
-   `front_app/`: Contains the React application (Create React App) that makes up the user interface.