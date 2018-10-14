FROM node:8

WORKDIR /usr/src/tv-streamer

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Copy sources to image
COPY . .

EXPOSE 5000

# Launch app
CMD [ "npm", "start" ]
