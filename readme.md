# Manga Central

Manga Central is a web application that helps users collect, organize, and access their favorite manga series from various online sources in one centralized place. It consists of a modern frontend, a user management service, and a bookmark management service.

---

## Features

- **User Authentication:** Secure registration and login.
- **Manga Bookmarking:** Save and organize manga from various websites.
- **Automatic Metadata Scraping:** Fetches title and thumbnail for bookmarked manga.
- **Centralized Dashboard:** View all your manga bookmarks in one place.
- **Responsive Design:** Accessible on various devices.
- **Supported Sites Management:** Easily extend supported manga sources.

---

## Project Structure

```
.
├── frontend/                  # React/TypeScript frontend (Vite, Tailwind)
├── user_service/              # Django user management microservice
├── bookmark_manager_service/  # Django bookmark management microservice
├── docker-compose.yml         # Multi-service orchestration
├── .env                       # Root environment variables
└── readme                     # Additional documentation
```

- See [frontend/readme](frontend/readme) for frontend details.
- See [user_service/readme](user_service/readme) for user service details.
- See [bookmark_manager_service/readme](bookmark_manager_service/readme) for bookmark manager details.

---

## Tech Stack

**Frontend**
- React, TypeScript, Vite
- Tailwind CSS
- Lucide Icons

**Backend**
- Python, Django, Django REST Framework
- MySQL (database)
- Redis (caching, task queue broker)
- Celery (async scraping tasks)
- Gunicorn (WSGI server)

**General**
- Docker & Docker Compose
- Nginx (frontend web server/reverse proxy in production)

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Setup & Run

1. **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd MangaCentral
    ```

2. **Configure Environment Variables:**
    - Each service (`frontend/`, `user_service/`, `bookmark_manager_service/`) needs its own `.env` file.
    - See the `readme` in each directory for details.
    - Example root `.env`:
      ```env
      MYSQL_DATABASE=manga_central_db
      MYSQL_USER=manga_central_user
      MYSQL_PASSWORD=yourpassword
      MYSQL_ROOT_PASSWORD=rootpassword
      DJANGO_SECRET_KEY_USER=your_user_service_secret_key
      DJANGO_SECRET_KEY_BOOKMARK=your_bookmark_service_secret_key
      ```

3. **Build and start all services:**
    ```sh
    docker-compose up --build
    ```

4. **Access the application:**
    - Frontend: [http://localhost:5173](http://localhost:5173)
    - User Service API: [http://localhost:8001](http://localhost:8001)
    - Bookmark Manager API: [http://localhost:8000](http://localhost:8000)

5. **Apply database migrations (first run or after model changes):**
    ```sh
    docker-compose exec user_service python manage.py migrate
    docker-compose exec bookmark_manager_service python manage.py migrate
    ```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE) (or specify your license here)

---

## Acknowledgements

- [React](https://react.dev/)
- [Django](https://www.djangoproject.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
-