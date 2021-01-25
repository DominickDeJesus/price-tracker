const puppeteer = require("puppeteer"),
	$ = require("cheerio"),
	URL =
		"https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440",
	TAG = `data-sku-id="6429440"`,
	cron = require("node-schedule"),
	rule = new cron.RecurrenceRule();
rule.hour = 1;
rule.minute = 0;

//Entry function
(async () => {
	try {
		const browser = await puppeteer.launch({ headless: true });
		console.log("[", new Date(), "] Browser created");
		const page = await browser.newPage();
		console.log("[", new Date(), "] Window created");
		await page.goto(URL, {
			waitUntil: "load",
			// Remove the timeout
			timeout: 0,
		});

		if (await isInStock(page, TAG)) {
			sendTextNotification();
		}
		console.log("[", new Date(), "] Page reloading");
		await page.reload();

		cron.scheduleJob(rule, async function () {
			if (await isInStock(page, TAG)) {
				sendTextNotification();
			}
			console.log("[", new Date(), "] Page reloading");
			await page.reload();
		});

		await browser.close();
	} catch (error) {
		console.log(error);
		await browser.close();
	}
})();

async function isInStock(page, tag) {
	try {
		console.log("[", new Date(), "] Loading page");
		const html = await page.content();
		const buttonText = $(`button[${tag}]`, html).text();
		if (buttonText.toLocaleLowerCase() === "sold out") {
			console.log("[", new Date(), "] Out of stock!");
			return false;
		}
		console.log("[", new Date(), "] In stock!");
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

function sendTextNotification() {
	console.log("[", new Date(), "] Text Sent");
}
