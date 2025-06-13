# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy all source files
COPY . .

# Expose app port
EXPOSE 4000

# Start app using npm script
CMD ["npm", "run", "dev"]
