# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency configuration files
COPY package*.json ./

# Install all dependencies (including devDependencies for compiling/building)
RUN npm ci

# Copy the rest of the application codebase
COPY . .

# Run the build script, which:
# 1. Runs 'vite build' to compile frontend SPA assets into /app/dist
# 2. Runs 'esbuild server.ts' to bundle backend TypeScript code into /app/dist/server.cjs
RUN npm run build

# --- Production Runner Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package configuration files to install production dependencies
COPY package*.json ./

# Install only production dependencies to keep the image lightweight
RUN npm ci --only=production

# Copy the compiled production assets and server code from builder
COPY --from=builder /app/dist ./dist

# Expose port (Cloud Run will override this via the PORT env var)
EXPOSE 3000

# Start the bundled production server
CMD ["node", "dist/server.cjs"]
