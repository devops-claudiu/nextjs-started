FROM node:18-alpine
WORKDIR /app
RUN apk update
RUN apk install -y curl tar
COPY package*.json ./
RUN npm install
COPY . .
# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

