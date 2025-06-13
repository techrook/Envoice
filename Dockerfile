# 1. Use official Node.js image as base
FROM node:20-alpine

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy package files first for better caching
COPY package*.json ./

# 4. Install dependencies (install both runtime and dev deps for build)
RUN npm install --legacy-peer-deps

# 5. Copy rest of the application
COPY . .

# 6. Generate Prisma client
RUN npx prisma generate

# 7. Build the NestJS application
RUN npm run build

# 8. Expose application port (default NestJS port)
EXPOSE 3000

# 9. Set the command to run the application in production mode
CMD ["npm", "run", "start:prod"]
