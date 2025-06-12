FROM node:18

# Set working directory
WORKDIR /src

# Copy package.json and install
COPY package*.json ./
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose port
EXPOSE 4000

# Run the server
CMD ["npm", "run", "dev"]
