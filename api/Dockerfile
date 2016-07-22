FROM node:6.2.2

WORKDIR /var/www/api

# Install app dependencies
COPY package.json /var/www/api
RUN npm install

# Install app dependencies
COPY . /var/www/api

CMD ["npm", "start"]
