To run app use 'nodemon index.js'

Docker image should be made like this:

1. Run the following command from the root folder
```shell
docker build . -t <choose-namee>/node-web-app
```
2. To check if it has built properly run
```shell
docker images
```
3. Make sure that it's able to connect to redis local 6379 port => causing problems at the moment