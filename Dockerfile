# Stage 1: Build
FROM node:18-alpine AS builder

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Stage 2: Production
FROM node:18-alpine AS runner

RUN npm install -g pnpm pm2 \
 && pm2 -v

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package.json ecosystem.config.js ./

EXPOSE 4000

CMD ["pnpm", "run", "start:dev"]
