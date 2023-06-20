FROM registry.devneon.com.br/library/node:16-alpine
WORKDIR /app
ENV PORT=3000
EXPOSE ${PORT}
COPY . .
RUN npm install
ENTRYPOINT [ "npm", "start" ]