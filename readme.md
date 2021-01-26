### Supply Tracker

This node script will check the availabilty of a product every 5 minutes given the url to scrap of the product and the id of the html tag to check if a product is sold out. If the item has been restocked, it will send a text message notification with a link to the product page. By default, this script is set up to track the bestbuy page for the NVIDIA GeForce RTX 3080.

## Requirements

- Pupeteer
- Cheerio
- Twilio
- Node-Schedule

## Setup

- `clone` this repo and `cd` into it
- Install the dependencies `yarn`
- Sign up for a twilio account, copy the contents of the `sample.env` into a new `.env` file. Fill out the values with the information from the twilio developer console.
- Make the start script executable `chmod +x start.sh`
- In the `start.sh` change the directory and user based on your systems specifications (you will most likely get an error if trying to run this script as root user)
- To have the script run on start up, put the full path to the `start.sh` script in the `/etc/rc.local` file (linux)
