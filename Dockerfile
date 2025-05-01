FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# install curl for reliable health checks and set proper ownership
USER root
RUN apk add --no-cache curl \
  && chown -R node:node /usr/src/app

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
  CMD curl --fail http://localhost:3000/api/v1/__health || exit 1

CMD ["npm", "run", "start"]
