// const express = require("express");
// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// puppeteer.use(StealthPlugin());

// const router = express.Router();

// router.get("/scrap-restaurants", async (req, res) => {
//   try {
//     const { lat, lng } = req.query;

//     if (!lat || !lng) {
//       return res.status(400).json({ error: "Latitude and Longitude are required!" });
//     }

//     const searchQuery = `restaurants near ${lat},${lng}`;
//     const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

//     console.log("🚀 Launching Puppeteer...");
//     const browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       defaultViewport: null,
//     });

//     const page = await browser.newPage();
//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
//     );

//     console.log("🔍 Navigating to Google Maps...");
//     try {
//       await page.goto(mapsUrl, { waitUntil: "networkidle2", timeout: 60000 });
//     } catch (error) {
//       console.error("⚠️ Navigation Timeout or Failed:", error);
//       return res.status(500).json({ error: "Failed to load Google Maps" });
//     }

//     console.log("⏳ Waiting for results...");
//     try {
//       await page.waitForSelector(".Nv2PK", { timeout: 30000 });
//     } catch (error) {
//       console.error("⚠️ No restaurant results found:", error);
//       return res.status(404).json({ error: "No restaurants found in this area" });
//     }

//     console.log("📜 Scrolling to load more restaurants...");
//     let previousHeight = 0;
//     for (let i = 0; i < 5; i++) {
//       await page.evaluate("window.scrollBy(0, document.body.scrollHeight)");

//       // ✅ Fixed: Using setTimeout() instead of page.waitForTimeout()
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       let newHeight = await page.evaluate("document.body.scrollHeight");
//       if (newHeight === previousHeight) break;
//       previousHeight = newHeight;
//     }

//     console.log("📦 Extracting restaurant data...");
//     const restaurants = await page.evaluate(() => {
//       let results = [];
//       let list = document.querySelectorAll(".Nv2PK");

//       list.forEach((item, index) => {
//         let name = item.querySelector(".qBF1Pd")?.innerText.trim() || "N/A";

//         // ✅ Extract Rating
//         let rating = item.querySelector(".ZkP5Je")?.innerText.trim() || "N/A";

//         // ✅ Extract Total Reviews
//         let total_reviews = "N/A";
//         const reviewElement = item.querySelector(".UY7F9");
//         if (reviewElement) {
//           let match = reviewElement.innerText.match(/\(([\d,]+)\)/);
//           total_reviews = match ? match[1].replace(/,/g, "") : "N/A";
//         }

//         // ✅ Extract Price
//         let price = "N/A";
//         item.querySelectorAll("span, div").forEach((el) => {
//           let text = el.innerText.trim();
//           if (text.match(/^₹+/)) price = text;
//         });

//         // ✅ Extract Address & Timing
//         let address = "N/A";
//         let timing = "N/A";
//         item.querySelectorAll(".W4Efsd").forEach((el) => {
//           let text = el.innerText.trim();
//           if (text.includes("Open") || text.includes("Closes") || text.includes("Reopens")) {
//             timing = text;
//           } else if (text.length > 10 && !text.includes("₹")) {
//             address = text;
//           }
//         });

//         results.push({ index: index + 1, name, rating, total_reviews, price, address, timing });
//       });

//       return results;
//     });

//     console.log("📌 Final Data Extracted:", JSON.stringify(restaurants, null, 2));

//     await browser.close();
//     res.json({ success: true, data: restaurants });
//   } catch (error) {
//     console.error("❌ Error scraping restaurants:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;



const puppeteer = require("puppeteer");

async function scrapeGoogleRestaurants(lat, lng) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  console.log("Function Called")

  const url = "https://www.google.com/maps/search/restaurants/@${lat},${lng},15z";
  await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

  await page.waitForSelector('[role="article"]'); // wait for list

  const data = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[role="article"]'));
    return cards.slice(0, 10).map((el) => {
      const name = el.querySelector("div[aria-label]")?.getAttribute("aria-label");
      const ratingText = el.innerText.match(/(\d\.\d) ★/);
      const rating = ratingText ? parseFloat(ratingText[1]) : null;

      return {
        placeId: el.getAttribute("data-result-id") || Math.random().toString(),
        name,
        rating,
        address: el.innerText.split("\n")[2] || "",
      };
    });
  });

  console.log("Data ", data)

  await browser.close();

  return data.map((r) => ({
    ...r,
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
    location: {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    },
  }));
}

module.exports = scrapeGoogleRestaurants;