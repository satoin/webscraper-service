FROM alpine:edge

RUN mkdir -p /usr/src/crawler
WORKDIR /usr/src/crawler

ENV PROD=true \
    PORT=8080 \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY . .

RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        chromium \
        nss \
        freetype \
        freetype-dev \
        harfbuzz \
        ca-certificates \
        ttf-freefont \
        nodejs \
        npm

RUN npm install

RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

USER pptruser

EXPOSE 8080

CMD ["npm", "run", "start"]