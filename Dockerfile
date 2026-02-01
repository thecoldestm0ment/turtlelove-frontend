# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for TypeScript)
RUN npm ci && \
    npm cache clean --force

# ============================================
# Stage 2: Build
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment configuration
ARG BUILD_MODE=production
ARG VITE_API_URL=/api
ARG VITE_WS_URL=/ws

# Set environment variables for build time
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_WS_URL=${VITE_WS_URL}
ENV VITE_APP_MODE=${BUILD_MODE}

# Vite build (TypeScript compilation handled by Vite/esbuild)
RUN npx vite build --mode ${BUILD_MODE}

# ============================================
# Stage 3: Production (nginx:alpine)
# ============================================
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactjs -u 1001

# Copy custom nginx config
COPY --chown=reactjs:nodejs nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder
COPY --from=builder --chown=reactjs:nodejs /app/dist /usr/share/nginx/html

# Set permissions
RUN chown -R reactjs:nodejs /usr/share/nginx/html && \
    chown -R reactjs:nodejs /var/cache/nginx && \
    chown -R reactjs:nodejs /var/log/nginx && \
    chown -R reactjs:nodejs /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R reactjs:nodejs /var/run/nginx.pid

# Switch to non-root user
USER reactjs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
