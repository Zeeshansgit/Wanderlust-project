# ------------------- Stage 1: Build Stage ------------------------------
FROM node:21 AS build

WORKDIR /app

# Copy package files first
COPY package*.json ./
RUN npm install

# Copy environment variables BEFORE build
COPY .env.docker .env

# Copy complete project
COPY . .

# Build Vite production bundle
RUN npm run build

# ------------------- Stage 2: Serve with Nginx -------------------------
FROM nginx:alpine

# Replace default Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
