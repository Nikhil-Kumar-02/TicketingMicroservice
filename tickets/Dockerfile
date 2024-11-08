# Use a slightly larger image to reduce compilation time
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install dependencies only when package.json or lock file changes
COPY package.json package-lock.json ./
RUN npm install --omit=dev --prefer-offline

# Copy application files
COPY . .

# Start the application
CMD ["npm", "start"]
