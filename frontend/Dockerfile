# Development Dockerfile for Vite
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend code
COPY . .

# Expose Vite's dev port
EXPOSE 5173

# Run Vite in development mode
CMD ["npm", "run", "dev", "--", "--host"]
