#!/bin/bash
# =============================================================================
# Start Script — Photo Builder Platform
# Starts both the web server and the queue worker
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step()  { echo -e "${CYAN}[STEP]${NC}  $1"; }

cleanup() {
    log_step "Shutting down..."
    if [ -n "$WORKER_PID" ] && kill -0 "$WORKER_PID" 2>/dev/null; then
        kill "$WORKER_PID" 2>/dev/null
        wait "$WORKER_PID" 2>/dev/null
        log_info "Queue worker stopped."
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM

# Ensure storage directories exist
mkdir -p storage/logs storage/framework/cache/data storage/framework/sessions storage/framework/views bootstrap/cache
chmod -R 775 storage bootstrap/cache

log_step "Starting queue worker in background..."
php artisan queue:work --queue=default --tries=3 --timeout=300 &
WORKER_PID=$!
log_info "Queue worker PID: $WORKER_PID"

log_step "Starting development server..."
echo -e "${CYAN}  → http://localhost:8000${NC}"
echo -e "${CYAN}  → Press Ctrl+C to stop all services${NC}"
echo ""

php artisan serve --host=0.0.0.0 --port=8000

cleanup
