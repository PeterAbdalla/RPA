const express = require('express');
const docsRoute = require('./docs.route');
const projectRoute = require('./project.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/projects',
    route: projectRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
