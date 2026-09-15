FROM nginxinc/nginx-unprivileged:stable-alpine@sha256:daa17b944bac2b578e962da4c61ad72a59233b3c63abea17113acaf4e6b9aea4
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /srv/index.html
COPY dist/ /srv/dist/
USER 1000:1000
EXPOSE 8080
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
