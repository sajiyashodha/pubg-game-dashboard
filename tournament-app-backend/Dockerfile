# Use official Node.js 18 image as base (which includes npm 10)
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the backend server port (5000)
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
