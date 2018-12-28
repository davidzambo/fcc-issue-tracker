FROM node:8
WORKDIR /app
COPY package.json /app
RUN yarn install

COPY .  /app

# will rewrite the default 3000 port
ENV PORT 3030

CMD ["yarn", "run", "production"]

EXPOSE 3030