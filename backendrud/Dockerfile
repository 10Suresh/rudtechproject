# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Give execute permission to ts-node-dev just in case
RUN chmod +x ./node_modules/.bin/ts-node-dev

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 4000

# Start dev server
CMD ["npm", "run", "dev"]
