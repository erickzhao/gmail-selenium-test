const {
  Given, When, Then, After, setDefaultTimeout,
} = require('cucumber');

setDefaultTimeout(60 * 1000);

module.exports = {
  Given,
  When,
  Then,
  After,
};
