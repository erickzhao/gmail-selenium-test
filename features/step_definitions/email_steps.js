/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
require('chromedriver');

const { Builder, By } = require('selenium-webdriver');
const until = require('selenium-webdriver/lib/until');
const {
  Given, setDefaultTimeout, Then, When,
} = require('cucumber');

const driver = new Builder().forBrowser('chrome').build();
setDefaultTimeout(10 * 1000);

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
    await driver.executeScript('arguments[0].click();', submitButton);
  }
});

Given('CurrentUser is has the New Message prompt open', async function () {
  await driver.wait(until.urlContains('https://mail.google.com/mail/u/0/'), 10 * 1000);
  await driver.get('https://mail.google.com/mail/u/0/#inbox?compose=new');
});

Given("the New Message prompt has {string}'s email address in the recipient field", async function (
  user,
) {
  const toField = await driver.wait(until.elementLocated(By.css('[name="to"]')), 20 * 1000);
  await toField.sendKeys('sobbingrabbit@gmail.com');
});

Given("{string}'s email address is in CC field", async function (user) {
  const ccButton = driver.findElement(By.css('[aria-label^="Add Cc recipients"]'));
  await ccButton.click();
  const ccField = driver.findElement(By.css('textarea[name="cc"]'));
  await ccField.sendKeys('erick@mailinator.com');
});

Given('some message is currently filled in', async function () {
  const subjectField = driver.findElement(By.css('[name="subjectbox"]'));
  this.subject = Date.now();
  await subjectField.sendKeys(`${this.subject}`);
});

Given('a single {string} image is uploaded from my local computer', async function (file) {
  const attachButton = driver.findElement(By.name('Filedata'));
  await attachButton.sendKeys(`${process.cwd()}/images/howdy.jpg`);
});

When('email is sent', async function () {
  const sendButton = driver.findElement(By.css('[aria-label^="Send"]'));
  sendButton.click();
});
