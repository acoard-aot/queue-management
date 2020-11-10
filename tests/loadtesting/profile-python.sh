#! /bin/sh
set -e
set -u

# py-spy needs sudo as we're spying on other processes.
if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo $0 $*"
    exit 1
fi

# Get earliest PID, main process, and we can use --subprocessses arg.
MAIN_PROCESS=$(pgrep -f gunicorn |  head -n 1)

if [ -z "$MAIN_PROCESS" ]; then
      echo "gunicorn is not running, unable to profile."
      exit 1
fi

py-spy record -o output/profile-${MAIN_PROCESS}.svg --subprocesses --pid ${MAIN_PROCESS}
