# Menggunakan image resmi PHP 8.3 dengan Apache
FROM php:8.3-apache

# Install ekstensi sistem dan dependensi PHP yang dibutuhkan Laravel & PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql zip

# Mengaktifkan Apache mod_rewrite untuk routing Laravel
RUN a2enmod rewrite

# Mengubah DocumentRoot Apache agar mengarah ke folder public Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy seluruh file project ke dalam container
COPY . .

# Install dependensi Laravel (tanpa dev-dependencies untuk production)
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Memberikan permission yang tepat untuk folder storage dan cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 80
EXPOSE 80