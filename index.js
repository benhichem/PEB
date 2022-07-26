/** @format */

const puppeteer = require("puppeteer");

const {
  Solve,
  CLickImages,
  GetImages,
  GetTarget,
  check_skip_or_verify,
} = require("./utils");

const baseURL = "https://captcha.website/";
console.log("[+] Script Started");
const main = async () => {
  console.log("[+] Main Function started");
  const browser = await puppeteer.launch({
    headless: false,
    //executablePath: '/usr/bin/google-chrome',
    ignoreHTTPSErrors: true,
    userDataDir: `data`,
    slowMo: 0,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--window-size=1000,900",
      "--start-maximized",
      "--disable-web-security",
      "--allow-running-insecure-content",
      "--disable-strict-mixed-content-checking",
      "--ignore-certificate-errors",
      "--disable-features=IsolateOrigins,site-per-process",
      "--blink-settings=imagesEnabled=true",
    ],
  });
  const page = await browser.newPage();
  await page.goto(baseURL);
  await page.waitForTimeout(5000);
  const elementHandle = await page.waitForSelector(
    `#cf-hcaptcha-container > div:nth-child(2) > iframe`,
  );
  const capFrame = await elementHandle.contentFrame();
  await capFrame.waitForSelector("div #checkbox");
  console.log("[+] CapFrame Selecting checkbox");
  //console.log(btn)
  await capFrame.click("div #checkbox");
  console.log("[+] Clicked");
  await page.waitForTimeout(4000);
  /////////////////////////////
  let ifram2 = await page.waitForSelector(
    "body > div:nth-child(5) > div:nth-child(1) > iframe",
  );
  const capFrame2 = await ifram2.contentFrame();
  /////////////////////////////

  var target = await GetTarget(capFrame2, page);
  console.log(`[+] This is the target ===> ${target}`);

  var Images = await GetImages(capFrame2, page);
  console.log(`[+] We got ===> ${Object.keys(Images).length} images`);

  var site = await page.evaluate(() => document.location.href);
  console.log(`[+] This is the SITE ===> ${site}`);

  const startSolving = await Solve(Images, target, site);
  console.log(`[+] Pictures Solved ===> ${startSolving.solution}`);

  await CLickImages(startSolving.solution, capFrame2);

  await check_skip_or_verify(capFrame2);

  const Img2 = await GetImages(capFrame2, page);

  const startSolving2 = await Solve(Img2, target, site);
  console.log(`[+] Pictures Solved ===> ${startSolving2.solution}`);

  await CLickImages(startSolving2.solution, capFrame2);

  await check_skip_or_verify(capFrame2);
  console.log("[+] Successfully solve captcha");

  browser.close();
};

main();
