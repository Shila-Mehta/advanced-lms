# ---------------------------
# Base stage: dependencies
# ---------------------------
FROM node:18-alpine AS deps
WORKDIR /app

# Install libc6-compat for some npm packages
RUN apk add --no-cache libc6-compat

# Copy only package files first (better caching)
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies
RUN npm ci --legacy-peer-deps --include=dev

# ---------------------------
# Builder stage
# ---------------------------
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js app
RUN npm run build

# ---------------------------
# Production runtime
# ---------------------------
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "run", "start"]
