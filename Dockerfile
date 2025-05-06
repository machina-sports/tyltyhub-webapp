# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

RUN chmod -R 755 /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Copy the .env file to the container (if you need it at build time)
# Ensure that your .env file is in the root directory of your project
COPY .env .env

# Install all dependencies
RUN npm install

# Remove devDependencies to reduce image size
RUN npm prune --production

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NODE_ENV production

# Add this after the build step to verify the `.next` directory exists
RUN npm run build

# Run the app when the container launches
CMD ["npm", "start"]
