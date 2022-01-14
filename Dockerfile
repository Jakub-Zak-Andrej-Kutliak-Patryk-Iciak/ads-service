FROM node:14
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]