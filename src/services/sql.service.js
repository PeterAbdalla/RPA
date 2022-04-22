const { Client } = require('pg');
const config = require('../config/config');

const client = new Client({ connectionString: config.postgres.url });
client.connect();

/**
 * Insert into table with columns some values
 * @param {string} tableName - Table Name
 * @param {[string]} columns - Columns
 * @param {[object]} values - Values
 * @returns {Promise<null>}
 */
const insert = async (tableName, columns, values) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (id SERIAL PRIMARY KEY,${columns
    .map((column) => `${column} TEXT`)
    .join(',')});
${columns.map((column) => `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${column} TEXT;`).join('\n')}
INSERT INTO ${tableName} (${columns.join(',')}) VALUES ${values
    .map((value) => `(${Object.values(value).map((v) => `'${v}'`)})`)
    .join(',')};`;
  await client.query(query);
};

/**
 * Select columns from table
 * @param {string} tableName - Table Name
 * @param {[string]} columns - Columns
 * @param {[[string, string]]} order - Columns
 * @returns {Promise<[object]>} Table rows
 */
const select = async (tableName, columns, order) => {
  const query = `SELECT ${columns.join(',')} FROM ${tableName} ${
    order ? `ORDER BY ${order.map((o) => `${o[0]} ${o[1]}`)}` : ''
  };`;
  const res = await client.query(query);
  return res.rows;
};

/**
 * Add revenue column in opportunities table
 * @returns {Promise<null>}
 */
const addRevenue = async () => {
  const query =
    "ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS revenue text; UPDATE opportunities SET revenue = concat(regexp_replace(list_price, ' .*', ''), ' ', to_char((replace(regexp_replace(list_price, '^.* ', ''),',','')::numeric * quantity::numeric) - replace(regexp_replace(total_price, '^.* ', ''),',','')::numeric, ' FM999,999,999,990'));";
  await client.query(query);
};

module.exports = {
  insert,
  select,
  addRevenue,
};
