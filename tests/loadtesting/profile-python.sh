#! /bin/sh

set -e

# py-spy needs sudo as we're spying on other processes.
if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo $0 $*"
    exit 1
fi

# Get earliest PID, main process, and we can use --subprocessses arg.
MAIN_PROCESS=$(pgrep -f gunicorn |  head -n 1)
py-spy record -o profile-${MAIN_PROCESS}.svg --subprocesses --pid ${MAIN_PROCESS}


# # Loop thourgh gunicorn main and subprocesses spawned for requests
# for pid in $(pgrep -f gunicorn); do
#     # Fork it to another  process so we spawn all profilers at same time
#     echo "Forking spy-spy for $pid"
#     py-spy record -o profile-$pid.svg --pid $pid &
# done

# # Trap EXIT command and kill all forked processes when this script exits
# trap 'kill $(jobs -p)' EXIT



# # Loop thourgh gunicorn main and subprocesses spawned for requests
# for pid in $(pgrep -f gunicorn); do
#     # echo "PID1 -- $pid"

#     # todo - must concurrently spawn the pyspy? fork it.
#     # sudo py-spy record -o profile.svg --pid $pid
#     # echo "cmd - py-spy record -o profile-$pid.svg --pid $pid"
    
#     # Fork it to another  process so we spawn all profilers at same time
#     py-spy record -o profile-$pid.svg --pid $pid &

#     # potentially need to trap SIGINT and then kill child jobs?
# done