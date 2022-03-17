FROM node:14-alpine
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev
COPY . /src
COPY . /fonts
COPY ./src/ ./package.json
WORKDIR /src
RUN npm install
CMD ["npm","run", "start"]