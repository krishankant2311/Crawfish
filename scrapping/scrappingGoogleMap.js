// // const express = require("express");
// // const puppeteer = require("puppeteer-extra");
// // const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// // puppeteer.use(StealthPlugin());

// // const router = express.Router();

// // router.get("/scrap-restaurants", async (req, res) => {
// //   try {
// //     const { lat, lng } = req.query;

// //     if (!lat || !lng) {
// //       return res.status(400).json({ error: "Latitude and Longitude are required!" });
// //     }

// //     const searchQuery = `restaurants near ${lat},${lng}`;
// //     const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

// //     console.log("🚀 Launching Puppeteer...");
// //     const browser = await puppeteer.launch({
// //       headless: "new",
// //       args: ["--no-sandbox", "--disable-setuid-sandbox"],
// //       defaultViewport: null,
// //     });

// //     const page = await browser.newPage();
// //     await page.setUserAgent(
// //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
// //     );

// //     console.log("🔍 Navigating to Google Maps...");
// //     try {
// //       await page.goto(mapsUrl, { waitUntil: "networkidle2", timeout: 60000 });
// //     } catch (error) {
// //       console.error("⚠️ Navigation Timeout or Failed:", error);
// //       return res.status(500).json({ error: "Failed to load Google Maps" });
// //     }

// //     console.log("⏳ Waiting for results...");
// //     try {
// //       await page.waitForSelector(".Nv2PK", { timeout: 30000 });
// //     } catch (error) {
// //       console.error("⚠️ No restaurant results found:", error);
// //       return res.status(404).json({ error: "No restaurants found in this area" });
// //     }

// //     console.log("📜 Scrolling to load more restaurants...");
// //     let previousHeight = 0;
// //     for (let i = 0; i < 5; i++) {
// //       await page.evaluate("window.scrollBy(0, document.body.scrollHeight)");

// //       // ✅ Fixed: Using setTimeout() instead of page.waitForTimeout()
// //       await new Promise(resolve => setTimeout(resolve, 2000));

// //       let newHeight = await page.evaluate("document.body.scrollHeight");
// //       if (newHeight === previousHeight) break;
// //       previousHeight = newHeight;
// //     }

// //     console.log("📦 Extracting restaurant data...");
// //     const restaurants = await page.evaluate(() => {
// //       let results = [];
// //       let list = document.querySelectorAll(".Nv2PK");

// //       list.forEach((item, index) => {
// //         let name = item.querySelector(".qBF1Pd")?.innerText.trim() || "N/A";

// //         // ✅ Extract Rating
// //         let rating = item.querySelector(".ZkP5Je")?.innerText.trim() || "N/A";

// //         // ✅ Extract Total Reviews
// //         let total_reviews = "N/A";
// //         const reviewElement = item.querySelector(".UY7F9");
// //         if (reviewElement) {
// //           let match = reviewElement.innerText.match(/\(([\d,]+)\)/);
// //           total_reviews = match ? match[1].replace(/,/g, "") : "N/A";
// //         }

// //         // ✅ Extract Price
// //         let price = "N/A";
// //         item.querySelectorAll("span, div").forEach((el) => {
// //           let text = el.innerText.trim();
// //           if (text.match(/^₹+/)) price = text;
// //         });

// //         // ✅ Extract Address & Timing
// //         let address = "N/A";
// //         let timing = "N/A";
// //         item.querySelectorAll(".W4Efsd").forEach((el) => {
// //           let text = el.innerText.trim();
// //           if (text.includes("Open") || text.includes("Closes") || text.includes("Reopens")) {
// //             timing = text;
// //           } else if (text.length > 10 && !text.includes("₹")) {
// //             address = text;
// //           }
// //         });

// //         results.push({ index: index + 1, name, rating, total_reviews, price, address, timing });
// //       });

// //       return results;
// //     });

// //     console.log("📌 Final Data Extracted:", JSON.stringify(restaurants, null, 2));

// //     await browser.close();
// //     res.json({ success: true, data: restaurants });
// //   } catch (error) {
// //     console.error("❌ Error scraping restaurants:", error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// // module.exports = router;

// // const puppeteer = require('puppeteer-extra');
// // const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// // puppeteer.use(StealthPlugin());
// // const puppeteer = require("puppeteer");

// // async function scrapeGoogleRestaurants(lat, lng) {

// //   const browser = await puppeteer.launch({
// //     headless: false, // headless true/new is flaky for Google Maps
// //     defaultViewport: null,
// //     args: [
// //       "--start-maximized",
// //       "--no-sandbox",
// //       "--disable-setuid-sandbox",
// //       "--disable-dev-shm-usage"
// //     ]
// //   });

// //   const url = `https://www.google.com/maps/search/restaurants/@${lat},${lng},15z`;
// //   await page.goto(url, { waitUntil: "networkidle2"});

// //   // await page.waitForSelector('[role="article"]', { timeout: 30000 });// wait for list

// //   // await page.waitForTimeout(5000);

// // const consent = await page.$('form[action*="consent"] button');
// // if (consent) {
// //   await consent.click();
// //   console.log("Clicked consent popup");
// //   await page.waitForTimeout(3000);
// // }
// //   const data = await page.evaluate(() => {
// //     const cards = Array.from(document.querySelectorAll('[role="article"]'));
// //     return cards.slice(0, 10).map((el) => {
// //       const name = el.querySelector("div[aria-label]")?.getAttribute("aria-label");
// //       const ratingText = el.innerText.match(/(\d\.\d) ★/);
// //       const rating = ratingText ? parseFloat(ratingText[1]) : null;

// //       return {
// //         placeId: el.getAttribute("data-result-id") || Math.random().toString(),
// //         name,
// //         rating,
// //         address: el.innerText.split("\n")[2] || "",
// //       };
// //     });
// //   });

// //   console.log("Data ", data)

// //   await browser.close();

// //   return data.map((r) => ({
// //     ...r,
// //     latitude: parseFloat(lat),
// //     longitude: parseFloat(lng),
// //     location: {
// //       type: "Point",
// //       coordinates: [parseFloat(lng), parseFloat(lat)],
// //     },
// //   }));
// // }

// // const puppeteer = require('puppeteer-extra');
// // const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// // const fs = require('fs');
// // puppeteer.use(StealthPlugin());

// // async function scrapeGoogleRestaurants(lat, lng) {
// //   const browser = await puppeteer.launch({
// //     headless: false, // run with browser visible
// //     defaultViewport: null,
// //     args: [
// //       "--start-maximized",
// //       "--no-sandbox",
// //       "--disable-setuid-sandbox",
// //       "--disable-dev-shm-usage"
// //     ]
// //   });

// //   const page = await browser.newPage();
// //   console.log("Function Called");

// //   const url = `https://www.google.com/maps/search/restaurants/@${lat},${lng},15z`;
// //   await page.goto(url, { waitUntil: "domcontentloaded" });

// //   // Wait for things to settle and handle cookie consent if it appears
// //   await page.waitForTimeout(5000);

// //   const consentBtn = await page.$('form[action*="consent"] button');
// //   if (consentBtn) {
// //     console.log("Consent popup found. Clicking...");
// //     await consentBtn.click();
// //     await page.waitForTimeout(3000);
// //   }

// //   try {
// //     await page.waitForSelector('[role="article"]', { timeout: 30000 }); // wait for restaurant cards
// //   } catch (err) {
// //     console.error("Selector wait failed:", err.message);
// //     const html = await page.content();
// //     fs.writeFileSync("debug.html", html);
// //     console.log("Saved current page HTML to debug.html for inspection.");
// //     await browser.close();
// //     throw err;
// //   }

// //   const data = await page.evaluate(() => {
// //     const cards = Array.from(document.querySelectorAll('[role="article"]'));
// //     return cards.slice(0, 10).map((el) => {
// //       const name = el.querySelector("div[aria-label]")?.getAttribute("aria-label");
// //       const ratingText = el.innerText.match(/(\d\.\d) ★/);
// //       const rating = ratingText ? parseFloat(ratingText[1]) : null;

// //       return {
// //         placeId: el.getAttribute("data-result-id") || Math.random().toString(),
// //         name,
// //         rating,
// //         address: el.innerText.split("\n")[2] || "",
// //       };
// //     });
// //   });

// //   console.log("Scraped Data:", data);

// //   await browser.close();

// //   return data.map((r) => ({
// //     ...r,
// //     latitude: parseFloat(lat),
// //     longitude: parseFloat(lng),
// //     location: {
// //       type: "Point",
// //       coordinates: [parseFloat(lng), parseFloat(lat)],
// //     },
// //   }));
// // }

// // module.exports = scrapeGoogleRestaurants;

// // module.exports = scrapeGoogleRestaurants;

// // const puppeteer = require('puppeteer-extra');
// // const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// // puppeteer.use(StealthPlugin());

// // async function scrapeGoogleRestaurants(lat, lng) {
// //   const browser = await puppeteer.launch({
// //     headless: "new",
// //     defaultViewport: null,
// //     args: ["--no-sandbox", "--disable-setuid-sandbox"]
// //   });

// //   const page = await browser.newPage();
// //   console.log("Function Called");

// //   const url = `https://www.google.com/maps/search/restaurants/@${lat},${lng},15z`;
// //   await page.goto(url, { waitUntil: "domcontentloaded" });

// //   // Correct wait
// //   await new Promise(res => setTimeout(res, 5000));
// //   // Handle consent if needed
// //   const consentBtn = await page.$('form[action*="consent"] button');
// //   if (consentBtn) {
// //     console.log("Clicking consent button");
// //     await consentBtn.click();
// //     await page.waitForSelector('some-selector', { timeout: 30000 });  // for waiting an element
// //     // await page.waitForTimeout(5000);
// //   }

// //   try {
// //     await page.waitForSelector('[role="article"]', { timeout: 30000 });
// //   } catch (err) {
// //     console.error("Timeout waiting for articles:", err.message);
// //     await browser.close();
// //     throw err;
// //   }

// //   const data = await page.evaluate(() => {
// //     const cards = Array.from(document.querySelectorAll('[role="article"]'));
// //     return cards.slice(0, 10).map((el) => {
// //       const name = el.querySelector("div[aria-label]")?.getAttribute("aria-label");
// //       const ratingText = el.innerText.match(/(\d\.\d) ★/);
// //       const rating = ratingText ? parseFloat(ratingText[1]) : null;

// //       return {
// //         placeId: el.getAttribute("data-result-id") || Math.random().toString(),
// //         name,
// //         rating,
// //         address: el.innerText.split("\n")[2] || "",
// //       };
// //     });
// //   });

// //   await browser.close();

// //   return data.map((r) => ({
// //     ...r,
// //     latitude: parseFloat(lat),
// //     longitude: parseFloat(lng),
// //     location: {
// //       type: "Point",
// //       coordinates: [parseFloat(lng), parseFloat(lat)],
// //     },
// //   }));
// // }

// // module.exports = scrapeGoogleRestaurants;

// // const puppeteer = require("puppeteer-extra");
// // const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// // puppeteer.use(StealthPlugin());

// // async function scrapeGoogleRestaurants(lat, lng) {
// //   const browser = await puppeteer.launch({
// //     headless: true,
// //     defaultViewport: null,
// //     args: ["--no-sandbox", "--disable-setuid-sandbox"],
// //   });

// //   const page = await browser.newPage();
// //   console.log("Function Called");

// //   const url = `https://www.google.com/maps/search/restaurants/@${lat},${lng},15z`;
// //   await page.goto(url, { waitUntil: "domcontentloaded" });

// //   // Accept Google consent popup if it appears
// //   try {
// //     await page.waitForSelector('form[action*="consent"] button', {
// //       timeout: 5000,
// //     });
// //     await page.click('form[action*="consent"] button');
// //     console.log("Consent accepted");
// //   } catch (e) {
// //     console.log("No consent popup");
// //   }

// //   // Wait for the map search results to load
// //   await page.waitForSelector(".hfpxzc", { timeout: 30000 }); // More reliable than [role="article"]

// //   // Scroll to load more restaurants
// //   let previousHeight;
// //   try {
// //     for (let i = 0; i < 5; i++) {
// //       previousHeight = await page.evaluate(
// //         'document.querySelector(".m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd").scrollHeight'
// //       );
// //       await page.evaluate(
// //         'document.querySelector(".m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd").scrollBy(0, document.querySelector(".m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd").scrollHeight)'
// //       );
// //       await new Promise(resolve => setTimeout(resolve, 5000));
// //       const newHeight = await page.evaluate(
// //         'document.querySelector(".m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd").scrollHeight'
// //       );
// //       if (newHeight === previousHeight) break;
// //     }
// //   } catch (err) {
// //     console.log("Scrolling failed", err);
// //   }

// //   const data = await page.evaluate(() => {
// //     const cards = Array.from(document.querySelectorAll(".hfpxzc"));
// //     return cards.slice(0, 10).map((el) => {
// //       const name = el.querySelector(".qBF1Pd")?.textContent;
// //       const ratingText = el.querySelector(".MW4etd")?.textContent;
// //       const rating = ratingText ? parseFloat(ratingText) : null;
// //       const address = el.querySelector(".W4Efsd")?.textContent || "";

// //       const placeId =
// //         el.getAttribute("data-result-id") || Math.random().toString();

// //       return {
// //         placeId,
// //         name,
// //         rating,
// //         address,
// //       };
// //     });
// //   });

// //   await browser.close();

// //   return data.map((r) => ({
// //     ...r,
// //     latitude: parseFloat(lat),
// //     longitude: parseFloat(lng),
// //     location: {
// //       type: "Point",
// //       coordinates: [parseFloat(lng), parseFloat(lat)],
// //     },
// //   }));
// // }

// // module.exports = scrapeGoogleRestaurants;










// // 

// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());

// async function scrapeGoogleRestaurants(lat, lng) {
//   const browser = await puppeteer.launch({
//     headless: true,
//     defaultViewport: null,
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   });

//   const page = await browser.newPage();
//   console.log("Function Called");

//   const url = `https://www.google.com/maps/search/restaurants/@${lat},${lng},15z`;
//   await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

//   await new Promise((r) => setTimeout(r, 5000));

//   // Handle consent
//   const consentBtn = await page.$('form[action*="consent"] button');
//   if (consentBtn) {
//     console.log("Clicking consent button");
//     await consentBtn.click();
//     await page.waitForNavigation({ waitUntil: "networkidle2" });
//   } else {
//     console.log("No consent popup");
//   }

//   // Scroll multiple times to trigger lazy loading
//   try {
//     for (let i = 0; i < 10; i++) {
//       await page.keyboard.press("PageDown");
//       await new Promise((r) => setTimeout(r, 1000));
//     }
//   } catch (e) {
//     console.log("Scrolling error", e);
//   }

//   // Check raw HTML to debug
//   const html = await page.content();
//   if (!html.includes('[role="article"]')) {
//     console.log("❌ No [role='article'] in HTML");
//   }

//   try {
//     await page.waitForSelector('[role="article"]', { timeout: 30000 });
//   } catch (err) {
//     console.log("Timeout waiting for articles:", err.message);
//     await browser.close();
//     return [];
//   }

//   const data = await page.evaluate(() => {
//     const cards = Array.from(document.querySelectorAll('[role="article"]'));
//     return cards.map((el) => {
//       const name = el.querySelector("div[aria-label]")?.getAttribute("aria-label") || "";
//       const ratingMatch = el.innerText.match(/(\d\.\d) ★/);
//       const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
//       const address = el.innerText.split("\n")[2] || "";

//       return {
//         placeId: el.getAttribute("data-result-id") || Math.random().toString(),
//         name,
//         rating,
//         address,
//       };
//     });
//   });

//   await browser.close();

//   console.log("✅ Scraped items:", data.length);
//   return data.map((r) => ({
//     ...r,
//     latitude: parseFloat(lat),
//     longitude: parseFloat(lng),
//     location: {
//       type: "Point",
//       coordinates: [parseFloat(lng), parseFloat(lat)],
//     },
//   }));
// }

// module.exports = scrapeGoogleRestaurants;



const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
console.log(puppeteer.executablePath());
const mongoose = require('mongoose');
const Restaurant = require("../module/restaurants/model/restaurantModel");
puppeteer.use(StealthPlugin());
async function autoScroll(page, itemCount = 10) {
  try {
    let lastCount = 0;
    let retries = 0;
    while (true) {
      const items = await page.$$('.Nv2PK');
      if (items.length >= itemCount || retries > 5) break;
      await page.evaluate(() => {
        const scrollable = document.querySelector('div[role="feed"]');
        if (scrollable) {
          scrollable.scrollBy(0, 1000); // scroll more aggressively
        }
      });
      // await page.waitForTimeout(2000); // wait 2 seconds for new items
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newCount = (await page.$$('.Nv2PK')).length;
      if (newCount === lastCount) retries++;
      else retries = 0;
      lastCount = newCount;
    }
  } catch (err) {
    console.error("Scroll error:", err.message);
  };
};
// tyuiyuio
async function scrapeGoogleMaps(lat, lng, address) {
  const mapUrl = `https://www.google.com/maps/search/restaurants/@${lat},${lng},14z`;
  console.log('Opening:', mapUrl);
  const browser = await puppeteer.launch({
    executablePath:  'C:/Users/DELL/.cache/puppeteer/chrome/win64-135.0.7049.114/chrome-win64/chrome.exe',
    headless: true,
    // executablePath: puppeteer.executablePath(), // Use Puppeteer's executablePath dynamically
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  
  // Use default context
  const page = await browser.newPage();
  
  // Grant geolocation permission to Google
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://www.google.com", ['geolocation']);
  
  // Set fake geolocation
  await page.setGeolocation({
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
  });
  
  
  // const browser = await puppeteer.launch({
  //   executablePath: chromium.path,
  //   headless: chromium.headless,
  //   args: chromium.args || ['--no-sandbox', '--disable-setuid-sandbox'],
  // });
  // const page = await browser.newPage();
  await page.goto(mapUrl, { waitUntil: 'networkidle2', timeout: 0 });

  try {
    await page.waitForSelector('.Nv2PK', { timeout: 10000 });
    await autoScroll(page, 30);
  } catch (err) {
    console.error('Error waiting for restaurant elements:', err.message);
  }
  const results = await page.evaluate(() => {
    const data = [];
    document.querySelectorAll('.Nv2PK').forEach(el => {
      const title = el.querySelector('.qBF1Pd')?.innerText.trim() || '';
      const rating = parseFloat(el.querySelector('.MW4etd')?.innerText) || 0;
      const reviews = el.querySelector('[aria-label*="stars"] .UY7F9')?.innerText || '';
      const address = el.querySelector('.W4Efsd span:nth-child(2) span:nth-child(2)')?.innerText || '';
      const image = el.querySelector('img')?.src || '';
      const link = el.querySelector('a')?.href || '';
      data.push({ title, rating, reviews, address, image, link });
    });
    return data;
  });
  await browser.close();
  for (const r of results) {
    if (!r.title) continue;
    const existing = await Restaurant.findOne({
      restaurantName: r.title,
      'location.coordinates': [lng, lat],
    });
    if (existing) {
      console.log(`Skipping existing restaurant: ${r.title}`);
      continue;
    }

    const restaurant = new Restaurant({
      restaurantName: r.title,
      fullAddress: r.address,
      address: r.address,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      isScraped: true,
      status: "Active",
      rating: r.rating,
      restaurantLogo: r.image,
      website: r.link,
      email: `${r.title.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      password: 'Temp@123',
      phoneNumber: '0000000000',
    });

    try {
      await restaurant.save();
      console.log(`Saved: ${r.title}`);
    } catch (err) {
      console.error(`Error saving ${r.title}:`, err.message);
    }
  }
}
module.exports = scrapeGoogleMaps;