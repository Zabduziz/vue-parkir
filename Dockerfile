# build stage
FROM node:22-alpine AS build
WORKDIR /app

RUN npm install -g bun

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
ARG VITE_API_BASE=https://apiparkir.zabduziz.com
ENV VITE_API_BASE=$VITE_API_BASE
RUN bun run build

# final stage: static files only (busybox agar bisa diekstrak via compose), diarahkan oleh Caddy
FROM busybox:latest
COPY --from=build /app/dist /app
