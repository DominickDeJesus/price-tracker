require("dotenv").config();
const SupplyChecker = require("./supplyChecker");
const cron = require("node-schedule");
const TEST = "https://www.bestbuy.com/site/macbook-air-13-3-laptop-apple-m1-chip-8gb-memory-256gb-ssd-latest-model-gold/6418599.p?skuId=6418599";
const GPU =
	"https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440";
const PS5 =
	"https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149";
const sc = new SupplyChecker(TEST, "test");

sc.init()
	.then(() =>
		cron.scheduleJob("*/5 * * * *", async function () {
			await sc.checkStock();
		})
	)
	.catch((error) => {
		console.log(error.message);
	});
