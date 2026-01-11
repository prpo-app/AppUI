# Multi-stage build: build with Node, serve with nginx
FROM node:20-alpine AS build
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

# copy source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine
# nginx config with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
