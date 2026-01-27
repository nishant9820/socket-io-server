FROM node:21-bullseye AS builder

WORKDIR /app

COPY ./package.json /app/

RUN npm install 

COPY ./index.js /app/



FROM node:21-alpine 
WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/index.js /app/index.js
COPY --from=builder /app/package.json /app/
EXPOSE 3001
CMD ["node","index.js"]
