const dfd = require('danfojs-node');

/**
 * Read xlsx file into a dataframe
 * @param {string} path - File path
 * @returns {Promise<object>} Dataframe
 */
const read = async (path) => dfd.readExcel(path);

/**
 * Write dataframe into a xlsx file
 * @param {string} path - File path
 * @param {object} dataFrame - Dataframe
 * @returns {Promise<null>}
 */
const write = async (path, dataFrame) => dfd.toExcel(dataFrame, { filePath: path });

module.exports = {
  read,
  write,
};
