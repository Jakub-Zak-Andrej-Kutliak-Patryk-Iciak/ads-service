FROM node:14
WORKDIR /home/andrej/Desktop/Projects/Active/parking-app-ucn/ads-service
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]