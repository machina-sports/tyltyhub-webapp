# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

RUN chmod -R 755 /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm install
RUN npm install @tailwindcss/typography

# Copy the rest of the application
COPY . .

# Copy the .env file to the container (if you need it at build time)
# Ensure that your .env file is in the root directory of your project
COPY .env .env

# Remove devDependencies to reduce image size (after build)
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NODE_ENV production

# Run the app when the container launches
CMD ["npm", "start"]
