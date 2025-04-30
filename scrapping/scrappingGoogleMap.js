const puppeteer = require("puppeteer-core");
const chromium = require("chromium");
const mongoose = require("mongoose");
const Restaurant = require("../module/restaurants/model/restaurantModel");

async function autoScroll(page, itemCount = 10) {
  try {
    let lastCount = 0;
    let retries = 0;
    while (true) {
      const items = await page.$$(".Nv2PK");
      if (items.length >= itemCount || retries > 5) break;
      await page.evaluate(() => {
        const scrollable = document.querySelector('div[role="feed"]');
        if (scrollable) {
          scrollable.scrollBy(0, 1000);
        }
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newCount = (await page.$$(".Nv2PK")).length;
      if (newCount === lastCount) retries++;
      else retries = 0;
      lastCount = newCount;
    }
  } catch (err) {
    console.error("Scroll error:", err.message);
  }
}
// do not remove this function
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
//           el.innerText?.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
//         );
//       const phoneNumber = phoneEl?.innerText?.trim() || "";

//       return {
//         name,
//         description,
//         businessHours: businessHours.join(", "),
//         phoneNumber,
//         fullAddress,
//       };
//     });

//     // 🔍 Clean unreadable characters and extract city/country
//     const cleanedFullAddress = details.fullAddress
//       .replace(/[^\x20-\x7E]/g, "")
//       .trim(); // removes non-ASCII
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
//     console.error("Error fetching restaurant details:", err.message);
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

async function getRestaurantDetails(page, link) {
  try {
    await page.goto(link, { waitUntil: "networkidle2" });
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for dynamic content
    const details = await page.evaluate(() => {
      const name = document.querySelector("h1")?.innerText || "";
      const description =
        document.querySelector('[aria-label^="About"] ~ div div span')
          ?.innerText || "";
      // Business hours
      const businessHours = [];
      const hoursTable = document.querySelectorAll(".OqCZI span");
      hoursTable.forEach((el) => {
        const text = el.innerText;
        if (text && text.includes(":")) businessHours.push(text);
      });
      // Full address
      const addressEl =
        document.querySelector('[data-item-id="address"]') ||
        Array.from(document.querySelectorAll("button, div")).find((el) =>
          el.innerText?.includes("Address")
        );
      let fullAddress = addressEl?.innerText?.trim() || "";
      // Phone number
      const phoneEl =
        document.querySelector('[data-item-id="phone"]') ||
        Array.from(document.querySelectorAll("button, div")).find((el) =>
          el.innerText?.match(/\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/)
        );
      const rawPhone = phoneEl?.innerText?.trim() || "";
      const phoneMatch = rawPhone.match(/(\+?\d{1,3})?[-.\s]?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/);
      const phoneNumber = phoneMatch ? phoneMatch[0] : "";
      return {
        name,
        description,
        businessHours: businessHours.join(", "),
        phoneNumber,
        fullAddress,
      };
    });
    // Clean unreadable characters and extract city/country
    const cleanedFullAddress = details.fullAddress
      .replace(/[^\x20-\x7E]/g, "")
      .trim();
    const addressParts = cleanedFullAddress.split(",").map((p) => p.trim());
    const city =
      addressParts.length >= 3 ? addressParts[addressParts.length - 3] : "";
    const country =
      addressParts.length >= 1 ? addressParts[addressParts.length - 1] : "";
    return {
      name: details.name,
      description: details.description,
      businessHours: details.businessHours,
      phoneNumber: details.phoneNumber,
      fullAddress: cleanedFullAddress,
      city,
      country,
    };
  } catch (err) {
    console.error(":x: Error fetching restaurant details:", err.message);
    return {
      name: "",
      description: "",
      businessHours: "",
      phoneNumber: "",
      fullAddress: "",
      city: "",
      country: "",
    };
  }
}
async function scrapeGoogleMaps(lat, lng, address) {
  const mapUrl = `https://www.google.com/maps/search/restaurants+in+${address}/@${lat},${lng},10z`;
  console.log("Opening:", mapUrl);

  const browser = await puppeteer.launch({
    executablePath: chromium.path,
    headless: chromium.headless,
    args: chromium.args || ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(mapUrl, { waitUntil: "networkidle2" });

  try {
    await page.waitForSelector(".Nv2PK", { timeout: 10000 });
    await autoScroll(page, 30);
  } catch (err) {
    console.error("Error waiting for restaurant elements:", err.message);
  }

  const basicResults = await page.evaluate(() => {
    const data = [];
    document.querySelectorAll(".Nv2PK").forEach((el) => {
      const title = el.querySelector(".qBF1Pd")?.innerText.trim() || "";
      const rating = parseFloat(el.querySelector(".MW4etd")?.innerText) || 0;
      const reviews =
        el.querySelector('[aria-label*="stars"] .UY7F9')?.innerText || "";
      const address =
        el.querySelector(".W4Efsd span:nth-child(2) span:nth-child(2)")
          ?.innerText || "";
      const image = el.querySelector("img")?.src || "";
      const link = el.querySelector("a")?.href || "";
      data.push({ title, rating, reviews, address, image, link });
    });
    return data;
  });

  for (const r of basicResults) {
    if (!r.title) continue;

    const existing = await Restaurant.findOne({
      restaurantName: r.title,
      "location.coordinates": [lng, lat],
    });

    if (existing) {
      console.log(`Skipping existing restaurant: ${r.title}`);
      continue;
    }

    const details = await getRestaurantDetails(page, r.link);
    console.log("Details of city", details.city);
    console.log("Details of county", details.country);
    console.log("Details of hours", details.businessHours);
    console.log("Details of fulladress", details.fullAddress);
    console.log("Details of PHone number", details.phoneNumber);
    console.log("Details56789yugfuikhjo", details);

    const restaurant = new Restaurant({
      restaurantName: r.title,
      fullAddress: details.fullAddress,
      address:details.fullAddress|| r.address,
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
      phoneNumber: details.phoneNumber.replace("\n","") || "0000000000",
      discription: details.description,
      businessHours: details.businessHours,
    });

    try {
      await restaurant.save();
      console.log(`Saved: ${r.title}`);
    } catch (err) {
      console.error(`Error saving ${r.title}:`, err.message);
    }
  }

  await browser.close();
}

module.exports = scrapeGoogleMaps;
