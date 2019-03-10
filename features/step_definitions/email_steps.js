/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
require('chromedriver');

const { Builder, By } = require('selenium-webdriver');
const until = require('selenium-webdriver/lib/until');
const {
  Given, setDefaultTimeout, Then, When,
} = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const { Users } = require('../../lib/users');

const driver = new Builder().forBrowser('chrome').build();
setDefaultTimeout(45 * 1000);

const isLoggedOut = url => url.startsWith('https://accounts.google.com/signin/');

Given('CurrentUser is logged into the Gmail web client', async function () {
  const url = await driver.getCurrentUrl();

  if (url.indexOf('mail.google.com') < 0) {
    await driver.get('https://mail.google.com');
  }

  if (isLoggedOut(await driver.getCurrentUrl())) {
    const emailField = driver.findElement(By.id('identifierId'));
    const nextButton = driver.findElement(By.id('identifierNext'));

    await emailField.sendKeys('sobbingrabbit@gmail.com');
    await nextButton.click();

    const passwordField = await driver.wait(
      until.elementLocated(By.css('input[name="password"]')),
      45 * 1000,
    );
    await driver.wait(until.elementIsVisible(passwordField), 45 * 1000);
    await passwordField.sendKeys('ecse428winter2019');

    const submitButton = driver.findElement(By.id('passwordNext'));
    await driver.executeScript('arguments[0].click();', submitButton);
  }
});

Given('CurrentUser is has the New Message prompt open', async function () {
  await driver.wait(until.urlContains('https://mail.google.com/mail/u/0/'), 45 * 1000);
  await driver.get('https://mail.google.com/mail/u/0/#inbox?compose=new');
});

Given("the New Message prompt has {string}'s email address in the recipient field", async function (
  user,
) {
  this.recipientUser = Users[user];
  const toField = await driver.wait(until.elementLocated(By.css('[name="to"]')), 45 * 1000);
  await toField.sendKeys(this.recipientUser);
});

Given("{string}'s email address is in CC field", async function (user) {
  this.ccUser = Users[user];

  const ccButton = driver.findElement(By.css('[aria-label^="Add Cc recipients"]'));
  await ccButton.click();
  const ccField = driver.findElement(By.css('textarea[name="cc"]'));
  await ccField.sendKeys(this.ccUser);
});

Given('some message is currently filled in', async function () {
  const subjectField = driver.findElement(By.css('[name="subjectbox"]'));
  this.subject = Date.now();
  await subjectField.sendKeys(`${this.subject}`);
});

Given('a single {string} image is uploaded from my local computer', async function (extension) {
  this.attachmentExtension = extension;
  const attachButton = driver.findElement(By.name('Filedata'));
  await attachButton.sendKeys(`${process.cwd()}/images/howdy${this.attachmentExtension}`);
});

When('email is sent', async function () {
  const sendButton = driver.findElement(By.css('[aria-label^="Send"]'));
  sendButton.click();
});

Then('an alert should appear telling CurrentUser that the email was sent', async function () {
  const alert = await driver.wait(
    until.elementLocated(By.xpath('//div[@role="alert" and contains(., "Message sent.")]')),
    45 * 1000,
  );

  expect(alert).to.be.a('object');
});

Then('the New Message prompt should be closed', async function () {
  return expect(
    driver.findElement(By.xpath('//div[@role="dialog" and contains(., "New Message")]')),
  ).to.be.rejectedWith('no such element');
});

Then("the email should appear in CurrentUser's {string} folder", async function (folder) {
  await driver.get(`https://mail.google.com/mail/u/0/#${folder}`);

  this.sentEmailLink = await driver.findElement(By.xpath(`//td[contains(., "${this.subject}")]`));

  expect(this.sentEmailLink).to.be.a('object');
});

Then("the email should not appear in CurrentUser's {string} folder", async function (folder) {
  await driver.get(`https://mail.google.com/mail/u/0/#${folder}`);

  return expect(
    driver.findElement(By.xpath(`//td[contains(., "${this.subject}")]`)),
  ).to.be.rejectedWith('no such element');
});

Then("the email's details should be accessible", async function () {
  this.sentEmailLink.click();
  await driver.wait(until.titleIs(`${this.subject} - sobbingrabbit@gmail.com - Gmail`), 45 * 10000);

  const showDetails = await driver.findElement(
    By.xpath('//img[@role="button" and @aria-label="Show details"]'),
  );
  showDetails.click();

  const attachment = await driver.findElement(
    By.xpath(`//span[contains(., "Preview attachment howdy${this.attachmentExtension}")]`),
  );

  const sender = await driver.findElement(
    By.xpath(
      '//span[contains(., "from:")]/parent::td/following-sibling::td/descendant::span[@email="sobbingrabbit@gmail.com"]',
    ),
  );

  const recipient = await driver.findElement(
    By.xpath(
      `//span[contains(., "to:")]/parent::td/following-sibling::td/descendant::span[@email="${
        this.recipientUser
      }"]`,
    ),
  );

  const cc = await driver.findElement(
    By.xpath(
      `//span[contains(., "cc:")]/parent::td/following-sibling::td/descendant::span[@email="${
        this.ccUser
      }"]`,
    ),
  );

  expect(attachment).to.be.a('object');
  expect(sender).to.be.a('object');
  expect(recipient).to.be.a('object');
  expect(cc).to.be.a('object');
});
