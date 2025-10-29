FROM node:20-alpine
WORKDIR /app
RUN apk update
COPY package*.json ./
RUN npm install
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

