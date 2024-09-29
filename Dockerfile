FROM node:22.9.0-alpine3.20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install --production --silent

# Bundle app source
COPY . .

ENV DISCORD_TOKEN=your_token_here