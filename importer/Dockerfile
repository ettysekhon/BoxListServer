FROM node:latest

WORKDIR /var/worker

# Install app dependencies
COPY package.json /var/worker
RUN npm install

# Copy source
COPY . /var/worker

# Create directory to save data
RUN mkdir -p /var/worker/data

CMD ["npm", "start"]
