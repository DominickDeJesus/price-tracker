require("dotenv").config();
const puppeteer = require("puppeteer");
const $ = require("cheerio");
const cron = require("node-schedule");
const URL =
	"https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440";
const TAG = `button[data-sku-id="${URL.split("skuId=")[1]}"]`;
let lastMessageDate = new Date("1995-12-17T03:24:00");
const isWin = process.platform === "win32";

//Entry function
(async () => {
	try {
		const browserOption = null;
		const browser = await puppeteer.launch({
			headless: true,
			...browserOption,
		});
		console.log(getTimestamp(), " Browser created");

		const page = await browser.newPage();
		console.log(getTimestamp(), " Window created");
		await page.setDefaultNavigationTimeout(0);

		await page.goto(URL, {
			waitUntil: "load",
			// Remove the timeout
			timeout: 0,
		});
		if (await isInStock(page, TAG)) {
			lastMessageDate = new Date();
			await page.screenshot({
				path: `./screenshots/${lastMessageDate}-screenshot.png`,
				fullPage: true,
			});
			sendTextNotification();
		}

		cron.scheduleJob("*/5 * * * *", async function () {
			if ((await isInStock(page, TAG)) && !isToday(lastMessageDate)) {
				sendTextNotification();
				lastMessageDate = new Date();
			}
			await page.reload();
		});
	} catch (error) {
		console.log(error);
	}
})();

async function isInStock(page, tag) {
	try {
		console.log(getTimestamp(), " Loading page content");
		const html = await page.content();
		const buttonText = $(tag, html).text();

		if (buttonText.toLocaleLowerCase() === "sold out") {
			console.log(getTimestamp(), ` Out of stock! Tag content: ${buttonText}`);
			return false;
		} else if (buttonText.toLocaleLowerCase().includes("add")) {
			console.log(getTimestamp(), " In stock!!! Tag content: ", buttonText);
			return true;
		} else {
			console.log(
				getTimestamp(),
				" Button content unkown! Tag content: ",
				buttonText
			);
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function sendTextNotification() {
	try {
		// Download the helper library from https://www.twilio.com/docs/node/install
		// Your Account Sid and Auth Token from twilio.com/console
		// and set the environment variables. See http://twil.io/secure
		const accountSid = process.env.TWILIO_ACCOUNT_SID;
		const authToken = process.env.TWILIO_AUTH_TOKEN;
		const client = require("twilio")(accountSid, authToken);

		const message = await client.messages.create({
			body: `In stock alert!!! \n\n${URL}`,
			from: process.env.FROM_PHONE,
			to: process.env.TO_PHONE,
		});

		console.log(getTimestamp(), " Message sent! ", message.sid);
	} catch (error) {
		console.log(
			getTimestamp(),
			"Something went wrong, message was not sent\n",
			error
		);
	}
}

function getTimestamp() {
	return (
		"[" +
		new Date().toLocaleString("en-US", { timeZone: "America/New_York" }) +
		"]"
	);
}

function screenshot() {
	return (
		"[" +
		new Date().toLocaleString("en-US", { timeZone: "America/New_York" }) +
		"]"
	);
}
const isToday = (someDate) => {
	const today = new Date();
	return (
		someDate.getDate() == today.getDate() &&
		someDate.getMonth() == today.getMonth() &&
		someDate.getFullYear() == today.getFullYear()
	);
};
