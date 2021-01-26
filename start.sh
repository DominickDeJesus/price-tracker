#!/bin/bash
cd /home/pi/programs/price-tracker
sudo -u pi node index.js >> /tmp/price-tracker.log &
