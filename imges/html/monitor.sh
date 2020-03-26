#!/bin/sh
while :
do
echo "Current DIR is " $PWD
stillRunning=$(ps -ef |grep "/home/pi/pi_marlin" |grep -v "grep")
if [ "$stillRunning" ] ; then
echo "TWS service was already started by another way"
echo "Kill it and then startup by this shell, other wise this shell will loop out this message annoyingly"
kill -9 $pidof /home/pi/pi_marlin
else
echo "TWS service was not started"
echo "Starting service ..."
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/pi
/home/pi/pi_marlin
echo "TWS service was exited!"
fi
sleep 10
done
