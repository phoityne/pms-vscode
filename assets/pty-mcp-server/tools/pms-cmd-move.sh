#!/bin/sh
# usage: pms-cmd-move.sh <src> <dst>
# Note: both <src> and <dst> must be located under ROOT_DIR (one level above this script).

# ROOT_DIR is auto-resolved to one level above this script.
# To override, uncomment the next line and set your path.
# ROOT_DIR=/path/to/work
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
: "${ROOT_DIR:=$(cd "$SCRIPT_DIR/.." && pwd)}"

SRC_FULL=$(realpath -m "$1")
DST_FULL=$(realpath -m "$2")

# Verify both SRC_FULL and DST_FULL are under ROOT_DIR (prefix match).
for P in "$SRC_FULL" "$DST_FULL"; do
  case "$P" in
    "$ROOT_DIR"/*|"$ROOT_DIR") ;;
    *)
      echo "Error: path is outside ROOT_DIR: $P" 1>&2
      exit 1
      ;;
  esac
done

mv "$SRC_FULL" "$DST_FULL"
