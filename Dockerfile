FROM node:20-bookworm-slim

# Install Python 3 and pip for the compiler engine
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python compiler dependencies
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages ply==3.11

# Copy dependency manifests
COPY package*.json ./
COPY landing/package*.json ./landing/

# Install Node dependencies
RUN npm --prefix landing install

# Copy application source code
COPY . .

# Build Next.js production bundle
WORKDIR /app/landing
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Expose standard port
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Launch Next.js production server
CMD ["npm", "run", "start"]
