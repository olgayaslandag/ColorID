# =============================================================================
# Horizon Dockerfile for Laravel Photo Builder Platform
# Dedicated queue worker container — shares code with PHP-FPM container
#
# Build context is the project root (shares .dockerignore with php)
# =============================================================================

FROM php:8.3-fpm AS horizon-base

# =============================================================================
# System Dependencies
# =============================================================================
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    unzip \
    zip \
    libzip-dev \
    libicu-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libwebp-dev \
    libmagickwand-dev \
    libonig-dev \
    libssl-dev \
    ca-certificates \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# =============================================================================
# PHP Extensions
# =============================================================================
RUN docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg \
    --with-webp

RUN docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    bcmath \
    gd \
    zip \
    exif \
    pcntl \
    intl

RUN pecl install imagick && docker-php-ext-enable imagick
RUN pecl install redis && docker-php-ext-enable redis

# =============================================================================
# Composer
# =============================================================================
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# =============================================================================
# Supervisor & Horizon Config
# =============================================================================
COPY docker/horizon/supervisord.conf /etc/supervisor/conf.d/horizon.conf

# =============================================================================
# Working Directory
# =============================================================================
WORKDIR /var/www

# =============================================================================
# Application Files
# =============================================================================
COPY . /var/www

# =============================================================================
# Permissions
# =============================================================================
RUN set -eux; \
    mkdir -p /var/www/storage/logs \
             /var/www/storage/framework/cache/data \
             /var/www/storage/framework/sessions \
             /var/www/storage/framework/views \
             /var/www/storage/app/public \
             /var/www/bootstrap/cache; \
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache; \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache; \
    chmod +x /var/www/docker/horizon/entrypoint.sh

# =============================================================================
# Log directory for supervisor
# =============================================================================
RUN mkdir -p /var/log/supervisor && chmod 777 /var/log/supervisor

# =============================================================================
# Entrypoint
# =============================================================================
ENTRYPOINT ["/var/www/docker/horizon/entrypoint.sh"]

# =============================================================================
# Health Check — verifies Horizon master process is running
# =============================================================================
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD php artisan horizon:status --quiet || exit 1
