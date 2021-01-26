### Stock Supply Tracker

This node script will check the availabilty of a product every 5 minutes given the url to scrap of the product and the id of the html tag to check if a product is sold out. If the item has been restocked, it will send a text message notification with a link to the product page. By default, this script is set up to track the bestbuy page for the NVIDIA GeForce RTX 3080.

## Requirements

- Pupeteer
- Cheerio
- Twilio
- Node-Schedule
