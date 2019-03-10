const {
  Given, When, Then, After, setDefaultTimeout,
} = require('cucumber');

// timeout extended because the default value for the
// default timeout is 5000ms, and Gmail pages don't load that fast
setDefaultTimeout(60 * 1000);

module.exports = {
  Given,
  When,
  Then,
  After,
};
