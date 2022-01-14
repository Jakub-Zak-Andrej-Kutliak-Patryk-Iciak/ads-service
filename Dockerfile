FROM node:14.18-alpine
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]