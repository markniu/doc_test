#!/bin/sh
#sleep 5

#taskset -c 3 /home/pi/oprint/bin/python2 /home/pi/oprint/bin/octoprint serve --host=127.0.0.1 --port=5000



#echo "Current DIR is " $PWD
stillRunning=$(pgrep monitor.sh)
if [ "$stillRunning" ]  ; then
#echo "TWS service was already started by another way"
#echo "Kill it and then startup by this shell, other wise this shell will loop out this message annoyingly"
#kill -9 $pidof /home/pi/pi_marlin
sleep 1
else

echo "TWS monitor.sh service was not started"
echo "Starting service ..."
#export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/pi
sudo chmod 777 /home/pi/phtml/html/monitor.sh
sudo /home/pi/phtml/html/monitor.sh &
#echo "TWS service was exited!"
fi


