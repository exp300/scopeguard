# ─── Build stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Install root + sub-package deps for the build
COPY package.json package-lock.json* ./
COPY backend/package.json backend/package-lock.json* ./backend/
COPY frontend/package.json frontend/package-lock.json* ./frontend/

RUN npm install --prefix backend --omit=dev
RUN npm install --prefix frontend

# Copy source and build the frontend
COPY backend ./backend
COPY frontend ./frontend
RUN npm run build --prefix frontend

# ─── Runtime stage ────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build /app/backend ./backend
COPY --from=build /app/frontend/dist ./frontend/dist
COPY package.json ./

EXPOSE 3001

CMD ["node", "backend/server.js"]
