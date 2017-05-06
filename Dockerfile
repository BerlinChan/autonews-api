# Use an official Python runtime as a base image
FROM node:7.9

# Set the working directory to /app
WORKDIR /

# Copy the current directory contents into the container at /app
ADD ./server /server
ADD ./utils /utils
ADD ./package.json /

# Install any needed packages specified in requirements.txt
RUN npm i --registry=https://registry.npm.taobao.org

# Make port 80 available to the world outside this container
EXPOSE 3090

# Define environment variable
ENV NAME autonews-api

# Run app.py when the container launches
CMD ["node", "/server/index.js"]
