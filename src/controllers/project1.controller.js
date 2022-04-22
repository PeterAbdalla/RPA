const httpStatus = require('http-status');
const { puppeteerService, sqlService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const task1 = catchAsync(async (req, res) => {
  const { header, data } = await puppeteerService.scrapTable(
    'https://www.rpasamples.com/opportunities',
    '#app > div.main-report > div:nth-child(2) > div.table-container > table'
  );
  header.shift();
  data.forEach((obj) => delete obj['']);
  await sqlService.insert('opportunities', header, data);
  res.status(httpStatus.NO_CONTENT).send();
});

const task2 = catchAsync(async (req, res) => {
  await sqlService.addRevenue();
  res.status(httpStatus.NO_CONTENT).send();
});

const task3 = catchAsync(async (req, res) => {
  const rows = await sqlService.select('opportunities', ['*']);
  const conversionRatesProms = {};
  rows.forEach((row) => {
    const currency = row.unit_sales_price.replace(/ .*/i, '');
    const conversionRate = conversionRatesProms[currency] || puppeteerService.scrapCurrency(currency);
    conversionRatesProms[currency] = conversionRate;
  });
  const keys = Object.keys(conversionRatesProms);
  const values = await Promise.all(Object.values(conversionRatesProms));
  const conversionRates = Object.fromEntries(keys.map((_, i) => [keys[i], values[i]]));
  const moneyValue = (s) => +s.replace(/^.* /i, '').replaceAll(',', '');
  rows.forEach((row) => {
    const currency = row.unit_sales_price.replace(/ .*/i, '');
    const conversionRate = conversionRates[currency];
    const value = (v) => moneyValue(v) * conversionRate;
    const limit = (v) => (req.query.n ? v.toFixed(req.query.n) : v);
    const format = (s) => {
      const v = limit(value(s));
      if (typeof v === 'number' && Number.isInteger(v)) return `${v}`.replace(/\d(?=(\d{3})+$)/g, '$&,');
      return `${v}`.replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };
    row.unit_sales_price_egp = `EGP  ${format(row.unit_sales_price)}`;
    row.total_price_egp = `EGP  ${format(row.total_price)}`;
    row.list_price_egp = `EGP  ${format(row.list_price)}`;
    row.revenue_egp = `EGP  ${format(row.revenue)}`;
  });
  if (req.query.sortByRevenue && JSON.parse(req.query.sortByRevenue))
    rows.sort((a, b) => moneyValue(b.revenue_egp) - moneyValue(a.revenue_egp));
  res.send(rows);
});

module.exports = {
  task1,
  task2,
  task3,
};
