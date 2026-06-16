# Use the official Playwright base image
FROM mcr.microsoft.com/playwright:v1.60.0-noble

# Set the working directory inside the container
WORKDIR /app

# Copy package manifests first to optimize Docker layer caching
COPY package*.json ./

# Install project dependencies cleanly
RUN npm ci

# Copy the rest of your project files
COPY . .

# Default command to run your suite
CMD ["npx", "playwright", "test"]