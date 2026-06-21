#!/bin/bash
# =============================================================================
# Horizon Entrypoint for Laravel Photo Builder Platform
# Waits for dependencies, optimizes Laravel, then starts Horizon via Supervisor
# =============================================================================

set -e

# =============================================================================
# Color output helpers
# =============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step()  { echo -e "${CYAN}[STEP]${NC}  $1"; }

# =============================================================================
# Wait for Redis (critical — Horizon cannot run without it)
# =============================================================================
wait_for_redis() {
    log_step "Waiting for Redis at ${REDIS_HOST:-redis}:${REDIS_PORT:-6379} ..."
    local retries=60
    while ! php -r "
        try {
            \$redis = new Redis();
            \$redis->connect('${REDIS_HOST:-redis}', ${REDIS_PORT:-6379});
            exit(0);
        } catch (Exception \$e) {
            exit(1);
        }
    " 2>/dev/null; do
        retries=$((retries - 1))
        if [ $retries -le 0 ]; then
            log_error "Redis connection failed after 60 attempts! Horizon cannot start."
            exit 1
        fi
        echo -n "."
        sleep 2
    done
    echo ""
    log_info "Redis is ready."
}

# =============================================================================
# Wait for Database (needed for job batching/failed jobs)
# =============================================================================
wait_for_database() {
    if [ -z "${DB_HOST}" ] || [ "${DB_CONNECTION}" = "sqlite" ]; then
        log_info "SQLite or no remote DB — skipping DB wait."
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
# Optimize Laravel for Queue Processing
# =============================================================================
optimize_laravel() {
    log_step "Optimizing Laravel for queue processing..."

    # Ensure storage directories exist
    mkdir -p /var/www/storage/logs \
             /var/www/storage/framework/cache/data

    # Set permissions
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

    # Cache config for performance (critical for Horizon)
    if [ "${APP_ENV}" = "production" ]; then
        php artisan config:cache --ansi --quiet || log_warn "config:cache failed"
        php artisan route:cache --ansi --quiet || log_warn "route:cache failed"
        php artisan view:cache --ansi --quiet || log_warn "view:cache failed"
    else
        php artisan config:clear --quiet 2>/dev/null || true
    fi

    # Ensure Horizon metrics table exists (does nothing if already migrated)
    php artisan horizon:install --quiet 2>/dev/null || true
}

# =============================================================================
# Main
# =============================================================================
main() {
    echo ""
    echo -e "${CYAN}====================================================${NC}"
    echo -e "${CYAN}  Horizon Queue Worker — Laravel Photo Builder${NC}"
    echo -e "${CYAN}  Environment: ${APP_ENV:-local}${NC}"
    echo -e "${CYAN}====================================================${NC}"
    echo ""

    wait_for_redis
    wait_for_database
    optimize_laravel

    log_info "Starting Supervisor (Horizon)..."
    echo ""

    # Start Supervisor in foreground
    exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
}

main
