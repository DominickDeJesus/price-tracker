require("dotenv").config();
const SupplyChecker = require("./supplyChecker");
const cron = require("node-schedule");
const TEST =
	"https://www.bestbuy.com/site/macbook-air-13-3-laptop-apple-m1-chip-8gb-memory-256gb-ssd-latest-model-gold/6418599.p?skuId=6418599";
const GPU =
	"https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440";
const PS5 =
	"https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149";
const AMAZON =
	"https://www.amazon.com/Amazon-Smart-Plug-works-Alexa/dp/B01MZEEFNX/ref=gbps_img_s-5_73d8_315dddac?smid=ATVPDKIKX0DER&pf_rd_p=053dbaf4-c04d-4cb8-a61c-d2729fac73d8&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=PHG6DDVCT3VKRM3AABWC";
const GAMESTOP =
	"https://www.gamestop.com/electronics/cell-phones/accessories/chargers-power-adapters/products/star-wars-millennium-falcon-wireless-charger-with-ac-adapter-only-at-gamestop/11095928.html";

const sc = new SupplyChecker(GPU, "GPU-BB");
sc.init()
	.then(() =>
		cron.scheduleJob("*/5 * * * *", async function () {
			await sc.checkStock();
		})
	)
	.catch((error) => {
		console.log(error.message);
	});
