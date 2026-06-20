#!/bin/sh
# usage: pms-cmd-tree.sh <path> [depth] [type(dir|all)]
# Note: <path> must be located under ROOT_DIR (one level above this script).

# ROOT_DIR is auto-resolved to one level above this script.
# To override, uncomment the next line and set your path.
# ROOT_DIR=/path/to/work
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
: "${ROOT_DIR:=$(cd "$SCRIPT_DIR/.." && pwd)}"

PATH_ARG="${1:-$ROOT_DIR}"
TARGET_FULL=$(realpath -m "$PATH_ARG")

# Verify TARGET_FULL is under ROOT_DIR (prefix match).
case "$TARGET_FULL" in
  "$ROOT_DIR"/*|"$ROOT_DIR") ;;
  *)
    echo "Error: target path is outside ROOT_DIR: $TARGET_FULL" 1>&2
    echo "Error: ROOT_DIR is: $ROOT_DIR" 1>&2
    exit 1
    ;;
esac

DEPTH_ARG="${2:-}"
TYPE_ARG="${3:-all}"

if command -v tree >/dev/null 2>&1; then
  ARGS=""
  [ -n "$DEPTH_ARG" ] && ARGS="$ARGS -L $DEPTH_ARG"
  [ "$TYPE_ARG" = "dir" ] && ARGS="$ARGS -d"
  tree $ARGS "$TARGET_FULL"
else
  FIND_ARGS="$TARGET_FULL"
  [ -n "$DEPTH_ARG" ] && FIND_ARGS="$FIND_ARGS -maxdepth $DEPTH_ARG"
  [ "$TYPE_ARG" = "dir" ] && FIND_ARGS="$FIND_ARGS -type d"
  find $FIND_ARGS
fi
