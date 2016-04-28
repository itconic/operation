FROM node

ENV dbuser demo
ENV dbpwd demo
ENV dbschema demo
ENV PORT 8080

# Bundle app source
COPY src /src
# Install app dependencies
WORKDIR /src

RUN npm install

CMD ["node", "server.js"]


