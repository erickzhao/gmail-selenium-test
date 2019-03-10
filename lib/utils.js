const until = require('selenium-webdriver/lib/until');

const { Users } = require('./users');
const driver = require('./driver');

// grab user email from our constants
const getUserEmail = (user) => {
  // usertypes with multiple emails are indexed in gherkin with -# suffixes
  const [userType, userNumber] = user.split('-');
  let email;

  // if no number, we grab straight from the userType, otherwise grab from the index
  if (!userNumber) {
    email = Users[userType];
  } else {
    // 1-indexed because it's easier for non-technical people to read
    email = Users[userType][userNumber - 1];
  }

  return email;
};

const isLoggedOut = url => url.startsWith('https://accounts.google.com/signin/');

// nav to Sent folder
const goToSentFolder = async () => {
  await driver.get('https://mail.google.com/mail/u/0/#sent');
  await driver.wait(until.titleContains('Sent'));
};

// nav to Inbox
const goToInboxFolder = async () => {
  await driver.get('https://mail.google.com/mail/u/0/#inbox');
  await driver.wait(until.titleContains('Inbox'));
};

module.exports = {
  getUserEmail,
  isLoggedOut,
  goToSentFolder,
  goToInboxFolder,
};
