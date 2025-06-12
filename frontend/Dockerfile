# Build stage
FROM node:18 AS build

WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve using nginx
FROM nginx:alpine

COPY --from=build /src/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
