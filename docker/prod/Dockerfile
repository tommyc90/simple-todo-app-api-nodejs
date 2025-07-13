# Stage 1: Build
FROM node:24 AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json if exists (to optimize caching)
COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production image
FROM node:24-alpine

WORKDIR /usr/src/app

# Copy only the build output and node_modules from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/Server.js"]
