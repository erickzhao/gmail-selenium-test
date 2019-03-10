const until = require('selenium-webdriver/lib/until');

const { Users } = require('./users');
const driver = require('./driver');

const getUserEmail = (user) => {
  const [userType, userNumber] = user.split('-');
  let email;

  if (!userNumber) {
    email = Users[userType];
  } else {
    email = Users[userType][userNumber - 1];
  }

  return email;
};

const isLoggedOut = url => url.startsWith('https://accounts.google.com/signin/');

const goToSentFolder = async () => {
  await driver.get('https://mail.google.com/mail/u/0/#sent');
  await driver.wait(until.titleContains('Sent'));
};

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
