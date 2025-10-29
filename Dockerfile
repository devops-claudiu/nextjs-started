FROM node:20-alpine
WORKDIR /app
RUN apk update
COPY package*.json ./
RUN npm install
COPY . .
# Set dummy MongoDB URI for build
ENV MONGODB_URI=mongodb://dummy:dummy@localhost:27017/dummy
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

