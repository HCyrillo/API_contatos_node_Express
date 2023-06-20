FROM node:14
WORKDIR /app
ENV PORT=3000
EXPOSE ${PORT}
COPY . .
RUN npm install
ENTRYPOINT [ "npm", "start" ]