// const puppeteer = require("puppeteer-core");
// const chromium = require("chromium");
// const mongoose = require("mongoose");
// const Restaurant = require("../module/restaurants/model/restaurantModel");

// async function autoScroll(page, itemCount = 10) {
//   try {
//     let lastCount = 0;
//     let retries = 0;
//     while (true) {
//       const items = await page.$$(".Nv2PK");
//       if (items.length >= itemCount || retries > 5) break;
//       await page.evaluate(() => {
//         const scrollable = document.querySelector('div[role="feed"]');
//         if (scrollable) {
//           scrollable.scrollBy(0, 1000);
//         }
//       });
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       const newCount = (await page.$$(".Nv2PK")).length;
//       if (newCount === lastCount) retries++;
//       else retries = 0;
//       lastCount = newCount;
//     }
//   } catch (err) {
//     console.error("Scroll error:", err.message);
//   }
// }
// // do not remove this function
// // async function getRestaurantDetails(page, link) {
// //   try {
// //     await page.goto(link, { waitUntil: "networkidle2" });
// //     await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for dynamic content

// //     const details = await page.evaluate(() => {
// //       const name = document.querySelector("h1")?.innerText || "";
// //       const description =
// //         document.querySelector('[aria-label^="About"] ~ div div span')
// //           ?.innerText || "";

// //       // Business hours
// //       const businessHours = [];
// //       const hoursTable = document.querySelectorAll(".OqCZI span");
// //       hoursTable.forEach((el) => {
// //         const text = el.innerText;
// //         if (text && text.includes(":")) businessHours.push(text);
// //       });

// //       // Full address
// //       const addressEl =
// //         document.querySelector('[data-item-id="address"]') ||
// //         Array.from(document.querySelectorAll("button, div")).find((el) =>
// //           el.innerText?.includes("Address")
// //         );
// //       let fullAddress = addressEl?.innerText?.trim() || "";

// //       // Phone number
// //       const phoneEl =
// //         document.querySelector('[data-item-id="phone"]') ||
// //         Array.from(document.querySelectorAll("button, div")).find((el) =>
// //           el.innerText?.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
// //         );
// //       const phoneNumber = phoneEl?.innerText?.trim() || "";

// //       return {
// //         name,
// //         description,
// //         businessHours: businessHours.join(", "),
// //         phoneNumber,
// //         fullAddress,
// //       };
// //     });

// //     // 🔍 Clean unreadable characters and extract city/country
// //     const cleanedFullAddress = details.fullAddress
// //       .replace(/[^\x20-\x7E]/g, "")
// //       .trim(); // removes non-ASCII
// //     const addressParts = cleanedFullAddress.split(",").map((p) => p.trim());
// //     const city =
// //       addressParts.length >= 3 ? addressParts[addressParts.length - 3] : "";
// //     const country =
// //       addressParts.length >= 1 ? addressParts[addressParts.length - 1] : "";

// //     return {
// //       name: details.name,
// //       description: details.description,
// //       businessHours: details.businessHours,
// //       phoneNumber: details.phoneNumber,
// //       fullAddress: cleanedFullAddress,
// //       city,
// //       country,
// //     };
// //   } catch (err) {
// //     console.error("Error fetching restaurant details:", err.message);
// //     return {
// //       name: "",
// //       description: "",
// //       businessHours: "",
// //       phoneNumber: "",
// //       fullAddress: "",
// //       city: "",
// //       country: "",
// //     };
// //   }
// // }

// async function getRestaurantDetails(page, link) {
//   try {
//     await page.goto(link, { waitUntil: "networkidle2" });
//     await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for dynamic content
//     const details = await page.evaluate(() => {
//       const name = document.querySelector("h1")?.innerText || "";
//       const description =
//         document.querySelector('[aria-label^="About"] ~ div div span')
//           ?.innerText || "";
//       // Business hours
//       const businessHours = [];
//       const hoursTable = document.querySelectorAll(".OqCZI span");
//       hoursTable.forEach((el) => {
//         const text = el.innerText;
//         if (text && text.includes(":")) businessHours.push(text);
//       });
//       // Full address
//       const addressEl =
//         document.querySelector('[data-item-id="address"]') ||
//         Array.from(document.querySelectorAll("button, div")).find((el) =>
//           el.innerText?.includes("Address")
//         );
//       let fullAddress = addressEl?.innerText?.trim() || "";
//       // Phone number
//       const phoneEl =
//         document.querySelector('[data-item-id="phone"]') ||
//         Array.from(document.querySelectorAll("button, div")).find((el) =>
//           el.innerText?.match(/\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/)
//         );
//       const rawPhone = phoneEl?.innerText?.trim() || "";
//       const phoneMatch = rawPhone.match(/(\+?\d{1,3})?[-.\s]?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/);
//       const phoneNumber = phoneMatch ? phoneMatch[0] : "";
//       return {
//         name,
//         description,
//         businessHours: businessHours.join(", "),
//         phoneNumber,
//         fullAddress,
//       };
//     });
//     // Clean unreadable characters and extract city/country
//     const cleanedFullAddress = details.fullAddress
//       .replace(/[^\x20-\x7E]/g, "")
//       .trim();
//     const addressParts = cleanedFullAddress.split(",").map((p) => p.trim());
//     const city =
//       addressParts.length >= 3 ? addressParts[addressParts.length - 3] : "";
//     const country =
//       addressParts.length >= 1 ? addressParts[addressParts.length - 1] : "";
//     return {
//       name: details.name,
//       description: details.description,
//       businessHours: details.businessHours,
//       phoneNumber: details.phoneNumber,
//       fullAddress: cleanedFullAddress,
//       city,
//       country,
//     };
//   } catch (err) {
//     console.error(":x: Error fetching restaurant details:", err.message);
//     return {
//       name: "",
//       description: "",
//       businessHours: "",
//       phoneNumber: "",
//       fullAddress: "",
//       city: "",
//       country: "",
//     };
//   }
// }
// async function scrapeGoogleMaps(lat, lng, address) {
//   const mapUrl = `https://www.google.com/maps/search/restaurants+in+${address}/@${lat},${lng},10z`;
//   console.log("Opening:", mapUrl);

//   const browser = await puppeteer.launch({
//     executablePath: chromium.path,
//     headless: chromium.headless,
//     args: chromium.args || ["--no-sandbox", "--disable-setuid-sandbox"],
//   });
//   const page = await browser.newPage();
//   await page.goto(mapUrl, { waitUntil: "networkidle2" });

//   try {
//     await page.waitForSelector(".Nv2PK", { timeout: 10000 });
//     await autoScroll(page, 30);
//   } catch (err) {
//     console.error("Error waiting for restaurant elements:", err.message);
//   }

//   const basicResults = await page.evaluate(() => {
//     const data = [];
//     document.querySelectorAll(".Nv2PK").forEach((el) => {
//       const title = el.querySelector(".qBF1Pd")?.innerText.trim() || "";
//       const rating = parseFloat(el.querySelector(".MW4etd")?.innerText) || 0;
//       const reviews =
//         el.querySelector('[aria-label*="stars"] .UY7F9')?.innerText || "";
//       const address =
//         el.querySelector(".W4Efsd span:nth-child(2) span:nth-child(2)")
//           ?.innerText || "";
//       const image = el.querySelector("img")?.src || "";
//       const link = el.querySelector("a")?.href || "";
//       data.push({ title, rating, reviews, address, image, link });
//     });
//     return data;
//   });

//   for (const r of basicResults) {
//     if (!r.title) continue;

//     const existing = await Restaurant.findOne({
//       restaurantName: r.title,
//       "location.coordinates": [lng, lat],
//     });

//     if (existing) {
//       console.log(`Skipping existing restaurant: ${r.title}`);
//       continue;
//     }

//     const details = await getRestaurantDetails(page, r.link);
//     console.log("Details of city", details.city);
//     console.log("Details of county", details.country);
//     console.log("Details of hours", details.businessHours);
//     console.log("Details of fulladress", details.fullAddress);
//     console.log("Details of PHone number", details.phoneNumber);
//     console.log("Details56789yugfuikhjo", details);

//     const restaurant = new Restaurant({
//       restaurantName: r.title,
//       fullAddress: details.fullAddress,
//       address:details.fullAddress|| r.address,
//       city: details.city,
//       country: details.country,
//       location: {
//         type: "Point",
//         coordinates: [lng, lat],
//       },
//       isScraped: true,
//       status: "Active",
//       rating: r.rating,
//       restaurantLogo: r.image,
//       website: r.link,
//       email: `${r.title.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
//       password: "Temp@123",
//       phoneNumber: details.phoneNumber.replace("\n","") || "0000000000",
//       discription: details.description,
//       businessHours: details.businessHours,
//     });

//     try {
//       await restaurant.save();
//       console.log(`Saved: ${r.title}`);
//     } catch (err) {
//       console.error(`Error saving ${r.title}:`, err.message);
//     }
//   }

//   await browser.close();
// }

// module.exports = scrapeGoogleMaps;





const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const mongoose = require("mongoose");
const Restaurant = require("../module/restaurants/model/restaurantModel");

// Dynamic imports based on environment
let puppeteer;
let chromium;

if (IS_PRODUCTION) {
  puppeteer = require("puppeteer-core");
  chromium = require("@sparticuz/chromium-min");
} else {
  puppeteer = require("puppeteer");
}

// Improved autoScroll with better error handling
async function autoScroll(page, itemCount = 10) {
  try {
    let lastCount = 0;
    let retries = 0;
    const maxRetries = 5;
    const scrollDelay = 2000;
    
    while (retries <= maxRetries) {
      const items = await page.$$(".Nv2PK");
      if (items.length >= itemCount) break;
      
      await page.evaluate(() => {
        const scrollable = document.querySelector('div[role="feed"]') || window;
        scrollable.scrollBy(0, 1000);
      });
      
      await new Promise(resolve => setTimeout(resolve, scrollDelay));
      
      const newCount = (await page.$$(".Nv2PK")).length;
      if (newCount === lastCount) retries++;
      else retries = 0;
      
      lastCount = newCount;
    }
  } catch (err) {
    console.error("Scroll error:", err.message);
    throw err;
  }
}

// Optimized restaurant details extraction
async function getRestaurantDetails(page, link) {
  try {
    await page.goto(link, { 
      waitUntil: "networkidle2",
      timeout: 30000 
    });
    
    await page.waitForSelector('h1', { timeout: 10000 });

    const details = await page.evaluate(() => {
      const getCleanText = (selector) => 
        (document.querySelector(selector)?.textContent || "").trim();
      
      const name = getCleanText("h1");
      const description = getCleanText('[aria-label^="About"] ~ div div span');
      
      // Business hours
      const businessHours = Array.from(document.querySelectorAll(".OqCZI span"))
        .map(el => el.textContent.trim())
        .filter(text => text.includes(":"));
      
      // Address
      const addressEl = document.querySelector('[data-item-id="address"]') || 
        Array.from(document.querySelectorAll("button, div")).find(el => 
          el.textContent?.includes("Address")
        );
      
      // Phone (more robust regex)
      const phoneEl = document.querySelector('[data-item-id="phone"]') ||
        Array.from(document.querySelectorAll("button, div")).find(el => 
          /\+\d[\d -]{8,}\d/.test(el.textContent)
        );
      
      const rawPhone = phoneEl?.textContent?.trim() || "";
      const phoneMatch = rawPhone.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/);
      
      return {
        name,
        description,
        businessHours: businessHours.join(", "),
        phoneNumber: phoneMatch?.[0] || "",
        fullAddress: (addressEl?.textContent || "").trim()
      };
    });

    // Clean and parse address
    const cleanedFullAddress = details.fullAddress.replace(/[^\x20-\x7E]/g, "").trim();
    const addressParts = cleanedFullAddress.split(",").map(p => p.trim());
    
    return {
      ...details,
      fullAddress: cleanedFullAddress,
      city: addressParts.length >= 3 ? addressParts[addressParts.length - 3] : "",
      country: addressParts.length >= 1 ? addressParts[addressParts.length - 1] : ""
    };
    
  } catch (err) {
    console.error("Error fetching restaurant details:", err.message);
    return {
      name: "",
      description: "",
      businessHours: "",
      phoneNumber: "",
      fullAddress: "",
      city: "",
      country: ""
    };
  }
}

// Main scraping function with environment-aware configuration
async function scrapeGoogleMaps(lat, lng, address) {
  // Validate address
  if (!address) {
    throw new Error('Address parameter is required');
  }

  const mapUrl = `https://www.google.com/maps/search/restaurants+in+${encodeURIComponent(address)}/@${lat},${lng},10z`;
  console.log("Opening:", mapUrl);

  let browser;
  try {
    // Environment-specific configuration
    const browserConfig = IS_PRODUCTION 
      ? {
          executablePath: await chromium.executablePath(),
          args: [
            ...chromium.args,
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process"
          ],
          headless: chromium.headless,
          defaultViewport: chromium.defaultViewport,
          ignoreHTTPSErrors: true,
        }
      : {
          headless: false, // Visible browser for local debugging
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage"
          ]
        };

    browser = await puppeteer.launch(browserConfig);
    const page = await browser.newPage();
    
    // Set realistic user agent and timeouts
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    page.setDefaultNavigationTimeout(60000);
    
    await page.goto(mapUrl, { 
      waitUntil: "networkidle2",
      timeout: 60000 
    });

    try {
      await page.waitForSelector(".Nv2PK", { timeout: 15000 });
      await autoScroll(page, 30);
    } catch (err) {
      console.error("Error waiting for restaurant elements:", err.message);
      throw err;
    }

    const basicResults = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".Nv2PK")).map(el => {
        const title = el.querySelector(".qBF1Pd")?.textContent.trim() || "";
        const rating = parseFloat(el.querySelector(".MW4etd")?.textContent) || 0;
        const reviews = el.querySelector('[aria-label*="stars"] .UY7F9')?.textContent || "";
        const address = el.querySelector(".W4Efsd span:nth-child(2) span:nth-child(2)")?.textContent || "";
        const image = el.querySelector("img")?.src || "";
        const link = el.querySelector("a")?.href || "";
        
        return { title, rating, reviews, address, image, link };
      });
    });

    // Process results in batches
    const batchSize = IS_PRODUCTION ? 3 : 5; // Smaller batches in production
    for (let i = 0; i < basicResults.length; i += batchSize) {
      const batch = basicResults.slice(i, i + batchSize);
      
      for (const r of batch) {
        if (!r.title) continue;

        try {
          const existing = await Restaurant.findOne({
            restaurantName: r.title,
            "location.coordinates": [lng, lat],
          });

          if (existing) {
            console.log(`Skipping existing restaurant: ${r.title}`);
            continue;
          }

          const details = await getRestaurantDetails(page, r.link);
          
          const restaurant = new Restaurant({
            restaurantName: r.title,
            fullAddress: details.fullAddress,
            address: details.fullAddress || r.address,
            city: details.city,
            country: details.country,
            location: {
              type: "Point",
              coordinates: [lng, lat],
            },
            isScraped: true,
            status: "Active",
            rating: r.rating,
            restaurantLogo: r.image,
            website: r.link,
            email: `${r.title.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
            password: "Temp@123",
            phoneNumber: details.phoneNumber.replace(/\D/g, "").slice(0, 15) || "0000000000",
            discription: details.description,
            businessHours: details.businessHours,
          });

          await restaurant.save();
          console.log(`Saved: ${r.title}`);
          
        } catch (err) {
          console.error(`Error processing ${r.title}:`, err.message);
          continue;
        }
      }
      
      // Longer delay in production
      await new Promise(resolve => setTimeout(resolve, IS_PRODUCTION ? 3000 : 2000));
    }

  } catch (err) {
    console.error("Scraping failed:", err);
    throw err;
  } finally {
    if (browser) {
      await browser.close().catch(err => console.error("Browser close error:", err));
    }
  }
}

module.exports = scrapeGoogleMaps;