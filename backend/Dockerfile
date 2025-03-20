FROM node:21-alpine

# Set working directory to /app within the container context
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
