# =============================================================================
# PHP-FPM Dockerfile for Laravel Photo Builder Platform
# Base: php:8.3-fpm with required extensions for image processing & queues
# =============================================================================

FROM php:8.3-fpm AS base

# =============================================================================
# System Dependencies
# =============================================================================
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Build tools and utilities
    curl \
    git \
    unzip \
    zip \
    libzip-dev \
    libicu-dev \
    # GD and Image Processing dependencies
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libwebp-dev \
    # Imagick dependencies
    libmagickwand-dev \
    # bcmath & mbstring
    libonig-dev \
    # SSL & HTTP client
    libssl-dev \
    ca-certificates \
    # Cron (for Laravel scheduler if needed in this container)
    cron \
    # Supervisor (for process management if needed)
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# =============================================================================
# PHP Extensions Installation
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

# Install Imagick via PECL (not included in core)
RUN pecl install imagick && docker-php-ext-enable imagick

# Install Redis extension via PECL (preferred over predis for performance)
RUN pecl install redis && docker-php-ext-enable redis

# =============================================================================
# Composer Installation
# =============================================================================
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# =============================================================================
# PHP-FPM Configuration
# =============================================================================
COPY docker/php/php.ini /usr/local/etc/php/php.ini
COPY docker/php/www.conf /usr/local/etc/php-fpm.d/www.conf

# =============================================================================
# Working Directory
# =============================================================================
WORKDIR /var/www

# =============================================================================
# Application Files
# =============================================================================
COPY . /var/www

# =============================================================================
# Permissions Setup
# =============================================================================
RUN set -eux; \
    # Ensure storage and bootstrap/cache directories exist
    mkdir -p /var/www/storage/logs \
             /var/www/storage/framework/cache/data \
             /var/www/storage/framework/sessions \
             /var/www/storage/framework/views \
             /var/www/storage/app/public \
             /var/www/bootstrap/cache; \
    # Set ownership to www-data for Laravel requirements
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache; \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache; \
    # Make entrypoint executable
    chmod +x /var/www/docker/php/entrypoint.sh

# =============================================================================
# Entrypoint
# =============================================================================
ENTRYPOINT ["/var/www/docker/php/entrypoint.sh"]

# =============================================================================
# Health Check
# =============================================================================
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD php -m | grep -q pdo_mysql || exit 1
