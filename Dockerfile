### STAGE 1: Build ###
FROM reg-harbor.agiletechnologies.in/agile_node_20.11.1/agile_node_20.11.1:latest as builder

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build
RUN npm install -g serve

#CMD ["serve", "-s", "-l", "4002", "build"]
CMD ["serve", "-s", "build"]

EXPOSE 3000

