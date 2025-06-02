# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies required by mysqlclient and other packages
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app/

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application using Gunicorn
# The specific Django project name ("project_user.wsgi" or "project_bookmark.wsgi")
# will be passed via an environment variable or command in docker-compose.yml
# For now, let's assume a default or you'll override this.
# CMD ["gunicorn", "your_project_name.wsgi:application", "--bind", "0.0.0.0:8000"]
# We will set the CMD in the docker-compose.yml for more flexibility per service.