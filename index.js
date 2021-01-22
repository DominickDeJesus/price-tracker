const puppeteer = require("puppeteer"),
  $ = require("cheerio"),
  URL = "https://www.oneplace.com/ministries/adventures-in-odyssey/listen",
  TAG = "ul.episodesList.accordion-content li a";
require("dotenv").config();

const getURLArray = async (url, tag) => {
  const episodeURLs = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const html = await page.goto(url).then(function () {
    return page.content();
  });

  $(tag, html).each((_, item) => {
    episodeURLs.push($(item).attr("href"));
  });

  return episodeURLs;
};

const getTrackObj = async (sourceHTML) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const html = await page.goto(sourceHTML).then(function () {
    return page.content();
  });
  const trackObj = {};
  trackObj.url = $("audio", html).attr("src");
  trackObj.title = $("div.overlay2 h2", html).text();
  trackObj.description = $("div.description p", html).text();

  const testTrack = await Track.findOne({ title: trackObj.title });
  if (testTrack) throw Error("Track already in database!");

  const track = new Track(trackObj);
  await track.save();
  return track;
};

const addTrackToDB = async () => {
  try {
    const arr = await getURLArray(URL, TAG);
    return await getTrackObj(arr[0].toString());
  } catch (error) {
    console.log(error.toString());
  }
};

module.exports = addTrackToDB;
