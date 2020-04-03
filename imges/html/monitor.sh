#!/bin/sh
#sleep 5

#taskset -c 3 /home/pi/oprint/bin/python2 /home/pi/oprint/bin/octoprint serve --host=127.0.0.1 --port=5000

ocpid=$(pgrep octoprint)
echo "$ocpid"
taskset -pc 3 $ocpid

while :
do
#echo "Current DIR is " $PWD
stillRunning=$(pgrep pi_marlin)
if [ "$stillRunning" ]  ; then
#echo "TWS service was already started by another way"
#echo "Kill it and then startup by this shell, other wise this shell will loop out this message annoyingly"
#kill -9 $pidof /home/pi/pi_marlin
sleep 1
else
echo "TWS service was not started"
echo "Starting service ..."
#export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/pi
sudo nice -n -25 /home/pi/pi_marlin &
#echo "TWS service was exited!"
fi
sleep 10
done
