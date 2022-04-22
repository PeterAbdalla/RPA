/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

/**
 * Scrap any HTML table
 * @param {string} url - Website url
 * @param {string} tableSelector - HTML table selector (copy using inspection)
 * @returns {Promise<{ header: [string], data: [object] }>}
 */
const scrapTable = async (url, tableSelector) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });
  try {
    const element = await page.$(tableSelector);
    let HTML = await page.evaluate((el) => el.innerHTML, element);
    HTML = `<table>${HTML}</table>`;
    const $ = cheerio.load(HTML);
    const trs = $('tr');
    let header = [];
    let colspan = [];
    let index = 0;
    let maxRowspan = 0;
    while (index < trs.length) {
      const tr = trs[index];
      index += 1;
      // eslint-disable-next-line no-continue
      if (!tr) continue;
      const columnNames = $(tr).children();
      const tempHead = [];
      const tempColspan = [];
      for (let i = 0; i < columnNames.length; i += 1) {
        const col = $(columnNames[i]);
        tempHead.push(
          col
            .text()
            .trim()
            .replace(/[^a-zA-Z0-9]/g, '_')
        );
        tempColspan.push(Number(col.attr('colspan')) ? Number(col.attr('colspan')) : 1);
        maxRowspan = col.attr('rowspan') ? Math.max(maxRowspan, Number(col.attr('rowspan'))) : maxRowspan;
      }
      header.push(tempHead);
      colspan.push(tempColspan);
      if (tempColspan.length !== 0 && tempColspan.every((x) => x === 1)) break;
    }
    header = header.filter((x) => x.length !== 0);
    colspan = colspan.filter((x) => x.length !== 0);
    for (let i = colspan.length - 1; i >= 0; i -= 1) {
      const tempArray = [];
      let k = 0;
      for (let j = 0; j < colspan[i].length; j += 1)
        if (colspan[i][j] === 1) tempArray.push(header[i][j]);
        else
          while (colspan[i][j] !== 0) {
            colspan[i][j] -= 1;
            tempArray.push(`${header[i][j]}_${header[i + 1][k]}`);
            k += 1;
          }
      header[i] = tempArray;
    }
    const headerKeys = header[0];
    if (index < maxRowspan) index = maxRowspan;
    let actualData = [];
    while (index < trs.length) {
      const tr = trs[index];
      index += 1;
      const tds = $(tr).children();
      const rowData = Array.from(tds, (td) => {
        const tdText = $(td).text().trim();
        if (/^-?\d+$/.test(tdText)) return Number(tdText);
        return tdText;
      });
      const obj = {};
      rowData.forEach((data, i) => {
        obj[headerKeys[i]] = data;
      });
      actualData.push(obj);
    }
    actualData = actualData.filter((x) => Object.keys(x).length >= headerKeys.length - 2);
    browser.close();
    return { header: headerKeys, data: actualData };
  } catch (err) {
    browser.close();
    throw new Error(err.message);
  }
};

/**
 * Scrap currency conversion rates
 * @param {string} sourceCurrencyCode - Source Currency Code
 * @param {string} targetCurrencyCode - Target Currency Code
 * @returns {Promise<number>} Conversion rate
 */
const scrapCurrency = async (sourceCurrencyCode, targetCurrencyCode = 'EGP') => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.google.com/search?hl=en&q=${sourceCurrencyCode}+to+${targetCurrencyCode}`, {
    waitUntil: 'networkidle0',
    timeout: 0,
  });
  const currencyExchange = await page.evaluate(() =>
    parseFloat(
      this.document
        .getElementById('knowledge-currency__updatable-data-column')
        .querySelectorAll('input')[1]
        .getAttribute('value')
    )
  );
  browser.close();
  return currencyExchange;
};

/**
 * Scrap names
 * @param {[string]} names - Input names
 * @returns {Promise<[string]>} Output names
 */
const scrapNames = async (names) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.rpasamples.com/findunicornname', {
    waitUntil: 'networkidle0',
    timeout: 0,
  });
  const html = await page.evaluate(() => this.document.documentElement.outerHTML);
  const outputNames = await Promise.all(
    names.map(async (name) => {
      // eslint-disable-next-line no-shadow
      const page = await browser.newPage();
      await page.setContent(html);
      await page.type('#txtName', name);
      await page.click('#getNameButton');
      const element = await page.waitForSelector('#lblUnicornName');
      const value = await element.evaluate((el) => el.textContent);
      page.close();
      return value;
    })
  );
  browser.close();
  return outputNames;
};

/**
 * Scrap passwords
 * @param {number} n - Number of passwords to be generated
 * @returns {Promise<[string]>} Output passwords
 */
const scrapPasswords = async (n) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.rpasamples.com/passwordgenerator', {
    waitUntil: 'networkidle0',
    timeout: 0,
  });
  const html = await page.evaluate(() => this.document.documentElement.outerHTML);
  const outputPasswords = await Promise.all(
    [...Array(n)].map(async (_, i) => {
      // eslint-disable-next-line no-shadow
      const page = await browser.newPage();
      await page.setContent(html);
      if (i + 1 <= n / 4) {
        await page.evaluate(() => {
          const example = this.document.getElementById('txt-length');
          example.value = '10';
        });
        await page.click('#chkLower');
        await page.click('#chkSymbols');
      } else if (i + 1 <= n / 2) {
        await page.evaluate(() => {
          const example = this.document.getElementById('txt-length');
          example.value = '15';
        });
        await page.click('#chkUpper');
        await page.click('#chkSymbols');
      } else if (i + 1 <= (3 * n) / 4) {
        await page.evaluate(() => {
          const example = this.document.getElementById('txt-length');
          example.value = '20';
        });
        await page.click('#chkUpper');
        await page.click('#chkLower');
      } else
        await page.evaluate(() => {
          const example = this.document.getElementById('txt-length');
          example.value = '30';
        });
      const element = await page.waitForSelector('#generated-password');
      const value = await element.evaluate((el) => el.textContent);
      page.close();
      return value;
    })
  );
  browser.close();
  return outputPasswords;
};

module.exports = {
  scrapTable,
  scrapCurrency,
  scrapNames,
  scrapPasswords,
};
