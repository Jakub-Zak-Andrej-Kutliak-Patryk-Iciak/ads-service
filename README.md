To run app use 'nodemon index.js'

Docker image should be made like this:

1. 'docker build . -t <choose-namee>/node-web-app'
2. 'docker images' to check if it has built properly
3. Make sure that it's able to connect to redis local 6379 port => causing problems at the moment