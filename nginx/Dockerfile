# Set nginx base image
FROM nginx:latest

# File Author / Maintainer
MAINTAINER Etty Sekhon

# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

ENTRYPOINT ["nginx"]

CMD ["-g", "daemon off;"]
