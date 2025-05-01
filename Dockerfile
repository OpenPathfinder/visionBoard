FROM node:22-alpine

WORKDIR /usr/src/app

# Create directory with proper permissions before copying files
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Copy package files
COPY --chown=node:node package.json package-lock.json ./

# Install dependencies
RUN npm install --only=production --no-cache

# Copy application code
COPY --chown=node:node . .

ENV NODE_ENV=production

EXPOSE 3000

# Add health check using the API health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/__health || exit 1

CMD ["npm", "run", "start"]

