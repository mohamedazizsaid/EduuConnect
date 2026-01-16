# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose default Hardhat RPC port
EXPOSE 8545

# Start command
# This starts the local hardhat node
CMD ["npx", "hardhat", "node"]
