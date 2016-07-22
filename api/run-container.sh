#!/bin/bash

docker run -p 8080:3000 -v $(pwd):/var/www -w "/var/www" --name api -d node npm start
