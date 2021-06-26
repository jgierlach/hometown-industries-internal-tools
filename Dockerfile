FROM node:16-alpine

WORKDIR /opt/hometown-industries-internal-tools

COPY . ./

RUN npm install
RUN npm run build

EXPOSE 3000

CMD npm start