# Use the official Node.js latest image as the base image
FROM node:20

# Create and set the working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy the package.json and package-lock.json files to the working directory
COPY ["package.json", "package-lock.json*", "nodemon.json", "npm-shrinkwrap.json*", "./"]

#COPY package*.json ./
#COPY nodemon.json ./

# Install the dependencies
RUN npm install
RUN npm install -g nodemon
RUN npm install -g ts-node

COPY . .

# for typescript
#RUN npm run build

# Expose port 3000
EXPOSE 3000

RUN chown -R node /app
USER node

# Start the server
CMD ["npm", "start"]
