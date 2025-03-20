FROM node:21-alpine

# Set working directory to /app within the container context
WORKDIR /app

# Copy application code
COPY . .

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["npm", "start"] 
