#!/bin/bash
cd /home/pi/programs/supply-tracker
sudo -u pi node index.js >> /tmp/supply-tracker.log &
