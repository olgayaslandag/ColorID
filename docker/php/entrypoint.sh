#!/bin/bash
# =============================================================================
# PHP-FPM Entrypoint for Laravel Photo Builder Platform
# Handles migrations, caching, and starts PHP-FPM
# =============================================================================

set -e

# =============================================================================
# Color output helpers
# =============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step()  { echo -e "${CYAN}[STEP]${NC}  $1"; }

# =============================================================================
# Wait for database to be ready
# =============================================================================
wait_for_database() {
    if [ -z "${DB_HOST}" ] || [ "${DB_CONNECTION}" = "sqlite" ]; then
        log_info "SQLite detected or no DB_HOST set — skipping DB wait."
        return 0
    fi

    log_step "Waiting for database at ${DB_HOST}:${DB_PORT:-3306} ..."
    local retries=60
    while ! php -r "
        try {
            new PDO(
                'mysql:host=${DB_HOST};port=${DB_PORT:-3306}',
                '${DB_USERNAME:-root}',
                '${DB_PASSWORD}',
                [PDO::ATTR_TIMEOUT => 3]
            );
            exit(0);
        } catch (PDOException \$e) {
            exit(1);
        }
    " 2>/dev/null; do
        retries=$((retries - 1))
        if [ $retries -le 0 ]; then
            log_error "Database connection failed after 60 attempts!"
            exit 1
        fi
        echo -n "."
        sleep 2
    done
    echo ""
    log_info "Database is ready."
}

# =============================================================================
# Wait for Redis to be ready (if configured)
# =============================================================================
wait_for_redis() {
    if [ -z "${REDIS_HOST}" ] || [ "${REDIS_HOST}" = "127.0.0.1" ]; then
        log_info "No remote Redis configured — skipping Redis wait."
        return 0
    fi

    log_step "Waiting for Redis at ${REDIS_HOST}:${REDIS_PORT:-6379} ..."
    local retries=30
    while ! php -r "
        try {
            \$redis = new Redis();
            \$redis->connect('${REDIS_HOST}', ${REDIS_PORT:-6379});
            exit(0);
        } catch (Exception \$e) {
            exit(1);
        }
    " 2>/dev/null; do
        retries=$((retries - 1))
        if [ $retries -le 0 ]; then
            log_error "Redis connection failed after 30 attempts!"
            exit 1
        fi
        echo -n "."
        sleep 2
    done
    echo ""
    log_info "Redis is ready."
}

# =============================================================================
# Laravel Setup & Optimization
# =============================================================================
setup_laravel() {
    log_step "Setting up Laravel environment..."

    # Ensure storage directories exist with proper permissions
    mkdir -p /var/www/storage/logs \
             /var/www/storage/framework/cache/data \
             /var/www/storage/framework/sessions \
             /var/www/storage/framework/views \
             /var/www/storage/app/public \
             /var/www/bootstrap/cache

    # Set permissions for Laravel
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

    # Storage images are served via /img/{id} route, not symlink

    # Run database migrations (with locking to prevent race conditions)
    if [ "${RUN_MIGRATIONS}" = "true" ] || [ "${APP_ENV}" = "production" ]; then
        log_step "Running database migrations..."
        php artisan migrate --force --isolated --ansi || {
            log_warn "Migration encountered issues. Check logs."
        }
    else
        log_info "Skipping migrations (RUN_MIGRATIONS != true and APP_ENV != production)."
    fi

    # Cache Laravel configs for performance (production only)
    if [ "${APP_ENV}" = "production" ]; then
        log_step "Caching Laravel configuration..."
        php artisan config:cache --ansi --quiet || log_warn "config:cache failed"
        php artisan route:cache --ansi --quiet || log_warn "route:cache failed"
        php artisan view:cache --ansi --quiet || log_warn "view:cache failed"
        php artisan event:cache --ansi --quiet || log_warn "event:cache failed"
    else
        log_info "Development environment — clearing caches..."
        php artisan config:clear --quiet 2>/dev/null || true
        php artisan route:clear --quiet 2>/dev/null || true
        php artisan view:clear --quiet 2>/dev/null || true
    fi
}

# =============================================================================
# Main
# =============================================================================
main() {
    echo ""
    echo -e "${CYAN}====================================================${NC}"
    echo -e "${CYAN}  PHP-FPM — Laravel Photo Builder Platform${NC}"
    echo -e "${CYAN}  Environment: ${APP_ENV:-local}${NC}"
    echo -e "${CYAN}====================================================${NC}"
    echo ""

    wait_for_database
    wait_for_redis
    setup_laravel

    # Start queue worker in background (only if Horizon is not running)
    if [ "${QUEUE_CONNECTION:-database}" != "redis" ] || ! php artisan horizon:status --quiet 2>/dev/null; then
        log_info "Starting queue worker in background..."
        php artisan queue:work --queue=default --tries=3 --timeout=300 > /var/log/queue-worker.log 2>&1 &
        log_info "Queue worker started (PID: $!)."
    fi

    log_info "Starting PHP-FPM..."
    echo ""

    # Start PHP-FPM in foreground
    exec php-fpm -F
}

main
