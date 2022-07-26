/** @format */
const axios = require("axios");
const apiURL = "https://solve.shimul.me/api/solve";

let info = {
  API_KEY: "9420f369-57cb-9509-4745-1f4b6792cf11",
  UID: "62ddc598717f7ddce933",
};

function z(e) {
  e = e.match(/(?<=\(\").+?(?=\"\))/g);
  return e ? e[0] : 0;
}

const check_skip_or_verify = async (capFrame2) => {
  const btn = await capFrame2.evaluate(async () => {
    let X = await document
      .querySelector(
        "body > div.challenge-interface > div.button-submit.button > div",
      )
      .click();
  });
};

const GetTarget = async (capFrame2, page) => {
  await capFrame2.waitForSelector("h2");
  console.log("[+] Selector appeared");
  await page.waitForTimeout(3000);
  const searchValue = await capFrame2.$eval(
    ".prompt-text",
    (el) => el.innerText,
  );
  let T = searchValue.split(" ");
  let Value = T[T.length - 1];
  return Value;
};

const GetImages = async (capFrame2) => {
  var links = {};
  await capFrame2.waitForSelector(".task-grid");
  console.log("[+] Selector appeared");
  let data = await capFrame2.evaluate(async () => {
    let X = Array.from(document.querySelectorAll(".image-wrapper .image"));
    let Y = X.map((item) => {
      return item.style.background;
    });
    return Y;
  });

  console.log(`[+] We got the Images`);
  console.log(`[+] Starting the parsing treatment`);
  for (let i = 0; i < data.length; i++) {
    var link = z(data[i]);
    links[i] = link;
  }
  return links;
};

const CLickImages = async (Solution, capFrame2) => {
  await capFrame2.waitForSelector(".task-grid");
  console.log("[+] Selector appeared");
  for (var sol of Solution) {
    await capFrame2.click(
      `body > div.challenge-container > div > div > div.task-grid > div:nth-child(${
        sol + 1
      })`,
    );
    capFrame2.waitForTimeout(1000);
    console.log(`[+] Clicked on ${sol + 1} Image`);
  }
};

const Solve = async (images, target, site) => {
  let data_type = "images";
  try {
    const res = await axios({
      method: "post",
      url: apiURL,
      headers: {
        "Content-Type": "application/json",
        uid: info.UID,
        apikey: info.API_KEY,
      },
      data: {
        images,
        target,
        data_type: "image",
        site,
        site_key: "33f96e6a-38cd-421b-bb68-7806e1764460",
      },
    });
    const url = res.data.url;
    const res2 = await axios.get(url);
    return res2.data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  Solve,
  CLickImages,
  GetImages,
  GetTarget,
  check_skip_or_verify,
};
