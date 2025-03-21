# Use official Node.js 18 image as base (which includes npm 10)
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your server will be listening on
EXPOSE 10086

# Create the "log" directory to store logs (if it doesn't already exist)
RUN mkdir -p /app/log

# Command to run when starting the container
CMD ["npm", "start"]