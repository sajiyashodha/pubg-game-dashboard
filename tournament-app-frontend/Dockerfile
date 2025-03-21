# Use official Node.js 18 image as base (which includes npm 10)
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install a simple web server (serve) to serve the build folder
RUN npm install -g serve

# Expose port 3000 (React development server)
EXPOSE 3000

# Start the React app
CMD ["serve", "-s", "build"]
