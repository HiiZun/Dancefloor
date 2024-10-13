FROM node:22.9.0-alpine3.20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json .

RUN npm install

# Bundle app source
COPY . .


CMD ["node", "index.js"]