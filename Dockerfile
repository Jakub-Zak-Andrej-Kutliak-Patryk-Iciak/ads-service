FROM node:14.18-alpine
WORKDIR /app
COPY package.json ./

# npm
#COPY package-lock.json ./
#RUN npm install
# yarn
COPY yarn.lock ./
RUN yarn install

COPY . .
EXPOSE 3000
CMD [ "node", "index.js" ]