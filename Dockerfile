FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies in a separate layer for better cache usage.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build-time variables used by quasar.config.js
ARG API_BASE_URL=http://localhost:3000
ARG AI_API_URL=http://localhost:8000
ARG DEFAULT_LANGUAGE=ru
ENV API_BASE_URL=$API_BASE_URL
ENV AI_API_URL=$AI_API_URL
ENV DEFAULT_LANGUAGE=$DEFAULT_LANGUAGE

RUN npx quasar build

FROM nginx:1.27-alpine AS production

COPY --from=builder /app/dist/spa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
