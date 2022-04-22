const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.3',
  info: {
    title: 'RPA APIs',
    description:
      'Project 1: \n\n 1. Create a BOT that can scrap the data off the website and move it to SQL.\n\n 2. BOT to create column that calculates revenue.\n\n 3. BOT to detect convert all currencies to EGP with the current live conversation rate.\n\n 4. Limit all columns to n decimals.\n\n 5. Sort rows based on sales revenue from the highest to lowest.\n\n Project 2: \n\n 1. Using the attached sheet with the random names.\n\n 2. BOT to create dummy name for each person in the excel sheet through the first link, then store it back into Excel.\n\n 3. Then create a password for each name and store it as well.\n\n 4. Then load all data to SQL database.',
    version,
    contact: {
      name: 'Peter Abdalla',
      email: 'peter.adel.abdalla@gmail.com',
      url: 'https://www.linkedin.com/in/peterabdalla/',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Local server',
    },
  ],
  tags: [
    {
      name: 'Project 1 APIs',
    },
    {
      name: 'Project 2 APIs',
    },
  ],
  components: {
    schemas: {
      opportunity: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'The ID of the opportunity. This is a serial primary key.',
            example: 1,
          },
          account_name: {
            type: 'string',
            description: 'The name of the account',
            example: 'Bank',
          },
          country: {
            type: 'string',
            description: 'The name of the country',
            example: 'USA',
          },
          opportunity_owner: {
            type: 'string',
            description: 'The name of the opportunity owner',
            example: 'Bob Gravel',
          },
          stage: {
            type: 'string',
            description: 'The stage of the account',
            example: 'Proposal',
          },
          quantity: {
            type: 'string',
            description: 'Quantity',
            example: '250',
          },
          unit_sales_price: {
            type: 'string',
            description: 'Expenses',
            example: 'EUR 675',
          },
          total_price: {
            type: 'string',
            description: 'Quantity * Unit Sales Price',
            example: 'EUR 4,800',
          },
          list_price: {
            type: 'string',
            description: 'Selling price',
            example: 'EUR 1,250',
          },
          revenue: {
            type: 'string',
            description: 'Quantity * List Price - Total Price',
            example: 'EUR 250',
          },
        },
      },
      opportunity_EGP: {
        allOf: [
          { $ref: '#/components/schemas/opportunity' },
          {
            type: 'object',
            properties: {
              unit_sales_price_egp: {
                type: 'string',
                description: 'Expenses',
                example: 'EGP 675',
              },
              total_price_egp: {
                type: 'string',
                description: 'Quantity * Unit Sales Price',
                example: 'EGP 4,800',
              },
              list_price_egp: {
                type: 'string',
                description: 'Selling price',
                example: 'EGP 1,250',
              },
              revenue_egp: {
                type: 'string',
                description: 'Quantity * List Price - Total Price',
                example: 'EGP 250',
              },
            },
          },
        ],
      },
    },
  },
  paths: {
    '/projects/1/1': {
      get: {
        tags: ['Project 1 APIs'],
        description: '1. Create a BOT that can scrap the data off the website and move it to SQL.',
        operationId: '1/1',
        responses: {
          200: {
            description: 'Table has been scrapped and saved to DB successfully.',
            content: { 'application/json': {} },
          },
        },
      },
    },
    '/projects/1/2': {
      get: {
        tags: ['Project 1 APIs'],
        description: '2. BOT to create column that calculates revenue.',
        operationId: '1/2',
        responses: {
          200: {
            description: 'Revenue column has been created successfully.',
            content: { 'application/json': {} },
          },
        },
      },
    },
    '/projects/1/3,4,5': {
      get: {
        tags: ['Project 1 APIs'],
        description:
          '3. BOT to detect convert all currencies to EGP with the current live conversation rate.\n\n 4. Limit all columns to n decimals.\n\n 5. Sort rows based on sales revenue from the highest to lowest.',
        operationId: '1/3,4,5',
        parameters: [
          {
            in: 'query',
            name: 'n',
            schema: { type: 'integer' },
            description: 'Optional, limit all columns to n decimals.',
          },
          {
            in: 'query',
            name: 'sortByRevenue',
            schema: { type: 'boolean' },
            description: 'Optional, sort rows based on sales revenue from the highest to lowest.',
          },
        ],
        responses: {
          200: {
            description: 'Currencies has been scrapped and converted successfuly',
            content: {
              'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/opportunity_EGP' } } },
            },
          },
        },
      },
    },
    '/projects/2/1,2': {
      get: {
        tags: ['Project 2 APIs'],
        description:
          '1. Using the attached sheet with the random names.\n\n 2. BOT to create dummy name for each person in the excel sheet through the first link, then store it back into Excel.',
        operationId: '2/1,2',
        responses: {
          200: {
            description: 'Names has been scrapped and saved to the excel sheet successfully.',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
    },
    '/projects/2/3,4': {
      get: {
        tags: ['Project 2 APIs'],
        description:
          '3. Then create a password for each name and store it as well.\n\n 4. Then load all data to SQL database.',
        operationId: '2/3,4',
        responses: {
          200: {
            description: 'Passwords has been scrapped and saved to the excel sheet and DB successfully.',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerDef;
