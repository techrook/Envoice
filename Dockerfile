# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install only production dependencies if NODE_ENV is production
RUN npm install

# Copy the entire project
COPY . .

# Build the NestJS project
RUN npm run build

# Expose port (change if you're using another)
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
