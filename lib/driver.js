require('chromedriver');
const { Builder } = require('selenium-webdriver');

const driver = new Builder().forBrowser('chrome').build();

module.exports = driver;
