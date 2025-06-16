# Manga Central - Frontend

This is the frontend for Manga Central, a web application to help users save, organize, and discover manga from various sources.

## Features

- User authentication (Sign Up, Login, Logout)
- Add manga bookmarks by URL
- View and manage a collection of manga bookmarks
- Responsive design for various screen sizes
- Toast notifications for user feedback
- Modal dialogs for login, signup, and displaying supported sites

## Tech Stack

- **React** (with TypeScript)
- **Vite** for fast development and bundling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router DOM** for navigation
- **ESLint** and **Prettier** for code linting and formatting

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── App.tsx           # Main application component and routing setup
│   ├── main.tsx          # Entry point of the application
│   ├── index.css         # Global styles and Tailwind imports
│   ├── components/       # Reusable UI components
│   │   ├── auth/         # Authentication related components (e.g., ProtectedRoute)
│   │   ├── dashboardpage/# Components specific to the dashboard page
│   │   ├── global/       # Components used across multiple pages (e.g., Footer)
│   │   ├── landingpage/  # Components specific to the landing page
│   │   └── ui/           # Generic UI elements (e.g., Button, Modal, MangaCard)
│   ├── contexts/         # React context for global state management (AuthContext, ToastContext)
│   ├── hooks/            # Custom React hooks (e.g., useFormValidation, useToast)
│   ├── routes/           # Page-level components (LandingPage, DashboardPage)
│   ├── services/         # API service integrations (AuthenticationService, MangaBookmarkService)
│   └── vite-env.d.ts     # TypeScript definitions for Vite environment variables
├── .env                  # Environment variables (local, not committed)
├── Dockerfile            # Docker configuration for containerization
├── index.html            # Main HTML file
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript compiler options
└── vite.config.ts        # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd MangaCentral/frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

### Running the Development Server

To start the development server (usually on `http://localhost:5173`):

```bash
npm run dev
```

or

```bash
yarn dev
```

The application will automatically reload if you change any of the source files.

### Building for Production

To create a production build in the `dist` folder:

```bash
npm run build
```

or

```bash
yarn build
```

### Linting

To lint the codebase:

```bash
npm run lint
```

or

```bash
yarn lint
```

## Environment Variables

Create a `.env` file in the `frontend` directory and add any necessary environment variables. For example:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Refer to `src/vite-env.d.ts` for TypeScript definitions related to Vite's environment variables.

## Docker

A `Dockerfile` is provided to containerize the frontend application.

To build the Docker image:

```bash
docker build -t manga-central-frontend .
```

To run the Docker container:

```bash
docker run -p 5173:5173 manga-central-frontend
```
This will typically expose the application on port 5173. If you are using the `nginx.conf` provided, the Nginx server within the container will serve the built static files, usually on port 80 (which can be mapped to a host port). The current `Dockerfile` sets up a development server. For production, you'd typically build the static assets and serve them with a web server like Nginx.
The `EXPOSE 5173` line in the Dockerfile suggests it's set up for the Vite development server. For a production build served by Nginx, the Dockerfile would need to be adjusted to build the app and then use an Nginx base image to serve the `dist` folder.
```

This README provides a good overview for anyone looking to understand or contribute to the frontend of your Manga Central project.// filepath: frontend/README.md
# Manga Central - Frontend

This is the frontend for Manga Central, a web application to help users save, organize, and discover manga from various sources.

## Features

- User authentication (Sign Up, Login, Logout)
- Add manga bookmarks by URL
- View and manage a collection of manga bookmarks
- Responsive design for various screen sizes
- Toast notifications for user feedback
- Modal dialogs for login, signup, and displaying supported sites

## Tech Stack

- **React** (with TypeScript)
- **Vite** for fast development and bundling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router DOM** for navigation
- **ESLint** and **Prettier** for code linting and formatting

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── App.tsx           # Main application component and routing setup
│   ├── main.tsx          # Entry point of the application
│   ├── index.css         # Global styles and Tailwind imports
│   ├── components/       # Reusable UI components
│   │   ├── auth/         # Authentication related components (e.g., ProtectedRoute)
│   │   ├── dashboardpage/# Components specific to the dashboard page
│   │   ├── global/       # Components used across multiple pages (e.g., Footer)
│   │   ├── landingpage/  # Components specific to the landing page
│   │   └── ui/           # Generic UI elements (e.g., Button, Modal, MangaCard)
│   ├── contexts/         # React context for global state management (AuthContext, ToastContext)
│   ├── hooks/            # Custom React hooks (e.g., useFormValidation, useToast)
│   ├── routes/           # Page-level components (LandingPage, DashboardPage)
│   ├── services/         # API service integrations (AuthenticationService, MangaBookmarkService)
│   └── vite-env.d.ts     # TypeScript definitions for Vite environment variables
├── .env                  # Environment variables (local, not committed)
├── Dockerfile            # Docker configuration for containerization
├── index.html            # Main HTML file
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript compiler options
└── vite.config.ts        # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd MangaCentral/frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

### Running the Development Server

To start the development server (usually on `http://localhost:5173`):

```bash
npm run dev
```

or

```bash
yarn dev
```

The application will automatically reload if you change any of the source files.

### Building for Production

To create a production build in the `dist` folder:

```bash
npm run build
```

or

```bash
yarn build
```

### Linting

To lint the codebase:

```bash
npm run lint
```

or

```bash
yarn lint
```

## Environment Variables

Create a `.env` file in the `frontend` directory and add any necessary environment variables. For example:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Refer to `src/vite-env.d.ts` for TypeScript definitions related to Vite's environment variables.

## Docker

A `Dockerfile` is provided to containerize the frontend application.

To build the Docker image:

```bash
docker build -t manga-central-frontend .
```

To run the Docker container:

```bash
docker run -p 5173:5173 manga-central-frontend
```
This will typically expose the application on port 5173. If you are using the `nginx.conf` provided, the Nginx server within the container will serve the built static files, usually on port 80 (which can be mapped to a host port). The current `Dockerfile` sets up a development server. For production, you'd typically build the static assets and serve them with a web server like Nginx.
The `EXPOSE 5173` line in the Dockerfile suggests it's set up for the Vite development server. For a production build served by Nginx, the Dockerfile would need to be adjusted to build the app and then use an Nginx base image to serve the `dist` folder.
```

This README provides a good overview for anyone looking to understand or contribute to the frontend of your