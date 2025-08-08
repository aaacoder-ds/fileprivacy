# syntax=docker/dockerfile:1.6

ARG NODE_VERSION=20-alpine

FROM --platform=$BUILDPLATFORM node:${NODE_VERSION} AS builder
WORKDIR /app

# Install deps first (better caching)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN set -eux; \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then corepack enable && yarn --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
  else npm i; fi

COPY . .
RUN npm run build

FROM --platform=$TARGETPLATFORM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O - http://localhost/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]



