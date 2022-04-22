const path = require('path');
const fs = require('fs');
const { excelService, puppeteerService, sqlService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const task1 = catchAsync(async (req, res) => {
  const df = await excelService.read(path.join(__dirname, `../files/Sample Data.xlsx`));
  const dummyNames = await puppeteerService.scrapNames(df.Name.values);
  df.addColumn('Dummy Name', dummyNames, { inplace: true });
  await excelService.write(path.join(__dirname, `../files/Sample Data with Dummy Names.xlsx`), df);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=Sample Data with Dummy Names.xlsx');
  fs.createReadStream(path.join(__dirname, `../files/Sample Data with Dummy Names.xlsx`)).pipe(res);
});

const task2 = catchAsync(async (req, res) => {
  const df = await excelService.read(path.join(__dirname, `../files/Sample Data with Dummy Names.xlsx`));
  const passwords = await puppeteerService.scrapPasswords(500);
  df.addColumn('Password', passwords, { inplace: true });
  await excelService.write(path.join(__dirname, `../files/Sample Data with Passwords.xlsx`), df);
  const columns = df.columns.slice(1).map((column) => column.replace(' ', '_'));
  const values = Array.from({ length: df.shape[0] }, Object);
  columns.map((column) =>
    df[column.replace('_', ' ')].values.forEach((v, i) => {
      values[i][column] = v;
    })
  );
  await sqlService.insert('sample', columns, values);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=Sample Data with Passwords.xlsx');
  fs.createReadStream(path.join(__dirname, `../files/Sample Data with Passwords.xlsx`)).pipe(res);
});

module.exports = {
  task1,
  task2,
};
