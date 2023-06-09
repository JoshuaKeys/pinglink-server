FROM node:alpine
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["npm", "start"]
EXPOSE 3000