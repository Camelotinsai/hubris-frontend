#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  with-test-host.sh --host-cmd "<host command>" [--ready-url "<url>"] [--ready-timeout-ms <ms>] -- <task command> [args...]

Examples:
  with-test-host.sh --host-cmd "npm run dev -- --host 127.0.0.1 --port 4173" --ready-url "http://127.0.0.1:4173" -- npm test
  with-test-host.sh --host-cmd "node server.js" -- node --test tests/e2e.test.ts
EOF
}

HOST_CMD=""
READY_URL=""
READY_TIMEOUT_MS=30000

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host-cmd)
      HOST_CMD="${2:-}"
      shift 2
      ;;
    --ready-url)
      READY_URL="${2:-}"
      shift 2
      ;;
    --ready-timeout-ms)
      READY_TIMEOUT_MS="${2:-}"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    --)
      shift
      break
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 2
      ;;
  esac
done

if [[ -z "$HOST_CMD" ]]; then
  echo "--host-cmd is required" >&2
  usage
  exit 2
fi

if [[ $# -eq 0 ]]; then
  echo "Task command is required after --" >&2
  usage
  exit 2
fi

if ! command -v setsid >/dev/null 2>&1; then
  echo "setsid is required for reliable host process cleanup" >&2
  exit 1
fi

if [[ -n "$READY_URL" ]] && ! command -v curl >/dev/null 2>&1; then
  echo "curl is required when --ready-url is provided" >&2
  exit 1
fi

host_pid=""
host_log="$(mktemp -t test-host-log.XXXXXX)"
cleaned_up="false"

terminate_host() {
  if [[ -z "$host_pid" ]]; then
    return 0
  fi

  if ! kill -0 "$host_pid" 2>/dev/null; then
    return 0
  fi

  # Host starts in its own process group; kill group to avoid orphan children.
  kill -TERM "-${host_pid}" 2>/dev/null || true

  for _ in {1..50}; do
    if ! kill -0 "$host_pid" 2>/dev/null; then
      return 0
    fi
    sleep 0.1
  done

  kill -KILL "-${host_pid}" 2>/dev/null || true
}

cleanup() {
  if [[ "$cleaned_up" == "true" ]]; then
    return 0
  fi
  cleaned_up="true"
  terminate_host || true
  rm -f "$host_log"
}

trap cleanup EXIT
trap 'cleanup; exit 130' INT TERM

wait_for_ready_url() {
  local attempts=$((READY_TIMEOUT_MS / 100))
  if (( attempts < 1 )); then
    attempts=1
  fi

  for ((i = 0; i < attempts; i++)); do
    if curl -fsS "$READY_URL" >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.1
  done

  echo "Timed out waiting for host readiness at ${READY_URL}" >&2
  if [[ -s "$host_log" ]]; then
    echo "Host output:" >&2
    cat "$host_log" >&2
  fi
  exit 1
}

setsid bash -lc "$HOST_CMD" >"$host_log" 2>&1 &
host_pid="$!"

sleep 0.1
if ! kill -0 "$host_pid" 2>/dev/null; then
  echo "Host command exited before task started" >&2
  if [[ -s "$host_log" ]]; then
    cat "$host_log" >&2
  fi
  exit 1
fi

if [[ -n "$READY_URL" ]]; then
  wait_for_ready_url
fi

"$@"
