FROM node:alpine AS builder
ENV PORT=${PORT}

WORKDIR /app
COPY . .
RUN npm install
RUN npm run compile

FROM node:alpine
WORKDIR / 
RUN apk upgrade libssl3 libcrypto3
COPY --from=builder /app/dist /app/dist/
COPY --from=builder /app/node_modules/ /app/node_modules
COPY --from=builder /app/gulpfile.js /app/
COPY --from=builder /app/package.json /app/

EXPOSE ${PORT}

CMD ["node", "/app/dist/server.js"]
