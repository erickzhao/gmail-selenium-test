/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const until = require('selenium-webdriver/lib/until');
const { Given } = require('../../lib/cucumber');
const driver = require('../../lib/driver');
const { isLoggedOut } = require('../../lib/utils');
const locators = require('../../lib/locators');
const { Credentials } = require('../../lib/users');

Given('CurrentUser is logged into the Gmail web client', async function () {
  const url = await driver.getCurrentUrl();

  if (url.indexOf('mail.google.com') < 0) {
    await driver.get('https://mail.google.com');
  }

  if (isLoggedOut(await driver.getCurrentUrl())) {
    const emailField = driver.findElement(locators.signin.emailField);
    const nextButton = driver.findElement(locators.signin.nextButton);

    await emailField.sendKeys(Credentials.email);
    await nextButton.click();

    const passwordField = await driver.wait(until.elementLocated(locators.signin.passwordField));
    await driver.wait(until.elementIsVisible(passwordField));
    await passwordField.sendKeys(Credentials.password);

    const submitButton = driver.findElement(locators.signin.submitButton);
    await driver.executeScript('arguments[0].click();', submitButton);
  }
});

Given('CurrentUser is composing a new message', async function () {
  await driver.wait(until.urlContains('https://mail.google.com/mail/u/0/'));
  await driver.get('https://mail.google.com/mail/u/0/#inbox?compose=new');
});
