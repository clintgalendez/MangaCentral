# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# The development server will be run by docker-compose,
# so no CMD is strictly needed here if only using for dev.
# However, you might have a build step for production:
# RUN npm run build

# Stage 2: Serve (Optional for production, dev server is used in compose)
# FROM nginx:stable-alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# For development, we'll rely on the vite dev server started by docker-compose
# So, this Dockerfile is primarily for setting up the environment and dependencies.
EXPOSE 5173