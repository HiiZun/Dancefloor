FROM node:22.9.0-alpine3.20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./

RUN npm install --production

# Bundle app source
COPY . .

#ENV TOKEN=TOKEN_HERE
#ENV GUILD_ID=000000000000000000
#ENV APPLICATION_ID=000000000000000000

VOLUME [ "/app/nodes.json" ]

CMD ["node", "index.js"]