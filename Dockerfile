# Build Stage
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production Stage
FROM node:18-alpine as production

WORKDIR /app

# Copy only the built files and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "dist/main"]
