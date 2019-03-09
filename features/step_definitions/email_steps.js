/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

const { Given } = require('cucumber');
require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const until = require('selenium-webdriver/lib/until');

const driver = new Builder().forBrowser('chrome').build();

const isLoggedOut = url => url.startsWith('https://accounts.google.com/signin/');

Given('CurrentUser is logged into the Gmail web client', async function () {
  await driver.get('http://mail.google.com');
  const url = await driver.getCurrentUrl();

  if (isLoggedOut(url)) {
    const emailField = driver.findElement(By.id('identifierId'));
    const nextButton = driver.findElement(By.id('identifierNext'));

    await emailField.sendKeys('sobbingrabbit@gmail.com');
    await nextButton.click();

    const passwordField = await driver.wait(
      until.elementLocated(By.css('input[name="password"]')),
      10 * 1000,
    );
    await driver.wait(until.elementIsVisible(passwordField), 10 * 1000);
    await passwordField.sendKeys('ecse428winter2019');

    const submitButton = driver.findElement(By.id('passwordNext'));
    driver.executeScript('arguments[0].click();', submitButton);
  }
});
