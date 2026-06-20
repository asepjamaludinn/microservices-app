# Menggunakan Node.js Alpine untuk image yang lebih ringan
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy file package untuk instalasi dependensi
COPY package.json package-lock.json* ./

# Install dependensi
RUN npm install

# Copy seluruh file project
COPY . .

# Build aplikasi Next.js untuk production
RUN npm run build

# Expose port yang digunakan Next.js
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]