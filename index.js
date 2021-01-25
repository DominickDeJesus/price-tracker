const puppeteer = require("puppeteer"),
  $ = require("cheerio"),
  URL =
    "https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440",
  TAG = `data-sku-id="6429440"`;
//require("dotenv").config();

const checkStock = async (sourceHTML) => {
  try {
    const browser = await puppeteer.launch();
    console.log("browser created");
    const page = await browser.newPage();
    console.log("window created");
    await page.goto(URL, {
      waitUntil: "load",
      // Remove the timeout
      timeout: 0,
    });
    console.log("loading page");
    const html = await page.content();

    // trackObj.url = $("audio", html).attr("src");
    // trackObj.title = $(`button[${TAG}]`, html).text();
    const trackObj = $(`button[${TAG}]`, html).text();
    //  const testTrack = await Track.findOne({ title: trackObj.title });
    //if (testTrack) throw Error("Track already in database!");
    console.log(trackObj);
    return trackObj;
  } catch (error) {
    console.log(error);
  }
};

checkStock(URL).then();
