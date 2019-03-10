/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const until = require('selenium-webdriver/lib/until');
const { expect } = require('../../lib/chai');
const { Given, When, Then } = require('../../lib/cucumber');
const driver = require('../../lib/driver');
const { getUserEmail } = require('../../lib/utils');
const locators = require('../../lib/locators');
const { Credentials } = require('../../lib/users');

Given('an email draft is addressed to {string} with {string} as a Cc', async function (
  recipient,
  Cc,
) {
  this.recipientUser = getUserEmail(recipient);
  this.ccUser = getUserEmail(Cc);
  this.subject = Date.now();
  this.body = `On ${new Date().toUTCString()}, the sobbing rabbit says howdy!`;

  const toField = await driver.wait(until.elementLocated(locators.compose.toField));
  await driver.wait(until.elementIsVisible(toField));
  await toField.sendKeys(this.recipientUser);

  const ccButton = driver.findElement(locators.compose.ccButton);
  await ccButton.click();
  const ccField = driver.findElement(locators.compose.ccField);
  await driver.wait(until.elementIsVisible(ccField));
  await ccField.sendKeys(this.ccUser);

  const subjectField = driver.findElement(locators.compose.subjectField);
  await driver.wait(until.elementIsVisible(subjectField));
  await subjectField.sendKeys(`${this.subject}`);

  const bodyField = driver.findElement(locators.compose.bodyField);
  await driver.wait(until.elementIsVisible(bodyField));
  await bodyField.sendKeys(this.body);
});

Given("a single {string} image is attached from CurrentUser's local computer", async function (
  extension,
) {
  this.attachmentExtension = extension;
  const attachButton = driver.findElement(locators.attach.fromComputerButton);
  await attachButton.sendKeys(`${process.cwd()}/images/howdy${this.attachmentExtension}`);
});

When('email is sent', async function () {
  const sendButton = driver.findElement(locators.compose.sendButton);
  sendButton.click();
});

Then('CurrentUser should be alerted that the email was sent successfully', async function () {
  const alert = await driver.wait(until.elementLocated(locators.send.sentAlert));

  expect(alert).to.be.a('object');
});

Then('the draft should no longer be available', async function () {
  return expect(
    driver.findElement(locators.compose.filledInDialog(this.subject)),
  ).to.be.rejectedWith('no such element');
});

Then('the email should be sent', async function () {
  await driver.get('https://mail.google.com/mail/u/0/#sent');
  await driver.wait(until.titleContains('Sent'));
  driver.wait(until.elementLocated(locators.verify.sent.emailInFolder(this.subject)));

  await driver.get('https://mail.google.com/mail/u/0/#inbox');
  await driver.wait(until.titleContains('Inbox'));

  this.sentEmailLink = driver.wait(
    until.elementLocated(locators.verify.sent.emailInFolder(this.subject)),
  );

  expect(this.sentEmailLink).to.be.a('object');
});

Then('the email should not be sent', async function () {
  await driver.get('https://mail.google.com/mail/u/0/#sent');
  await driver.wait(until.titleContains('Sent'));

  expect(driver.findElement(locators.verify.sent.emailInFolder(this.subject))).to.be.rejectedWith(
    'no such element',
  );

  await driver.get('https://mail.google.com/mail/u/0/#inbox');
  await driver.wait(until.titleContains('Inbox'));

  return expect(
    driver.findElement(locators.verify.sent.emailInFolder(this.subject)),
  ).to.be.rejectedWith('no such element');
});

Then("the email's details should correspond to the original draft that was sent", async function () {
  this.sentEmailLink.click();
  await driver.wait(until.titleIs(`${this.subject} - ${Credentials.email} - Gmail`));

  const showDetails = await driver.findElement(locators.verify.sent.showDetailsButton);
  showDetails.click();

  const attachment = await driver.findElement(
    locators.verify.sent.attachmentPreview(this.attachmentExtension),
  );

  const sender = await driver.findElement(locators.verify.sent.senderInfo);

  const recipient = await driver.findElement(
    locators.verify.sent.recipientInfo(this.recipientUser),
  );

  const cc = await driver.findElement(locators.verify.sent.ccInfo(this.ccUser));

  const subject = await driver.findElement(locators.verify.sent.subject(this.subject));
  const body = await driver.findElement(locators.verify.sent.body(this.body));

  expect(attachment).to.be.a('object');
  expect(sender).to.be.a('object');
  expect(recipient).to.be.a('object');
  expect(cc).to.be.a('object');
  expect(subject).to.be.a('object');
  expect(body).to.be.a('object');
});

Given('a single {string} image is chosen to be attached from Google Drive', async function (
  extension,
) {
  this.attachmentExtension = extension;

  const googleDriveButton = await driver.findElement(locators.attach.fromDriveButton);
  googleDriveButton.click();

  const drivePickerFrame = await await driver.wait(
    until.elementLocated(locators.attach.drive.pickerFrame),
  );

  await driver.switchTo().frame(drivePickerFrame);

  const attachmentIcon = await driver.wait(
    until.elementLocated(locators.attach.drive.attachmentSelect(this.attachmentExtension)),
  );

  const asAttachmentButton = await driver.findElement(locators.attach.drive.asAttachmentButton);

  const attachButton = await driver.findElement(locators.attach.drive.insertAttachmentButton);

  attachmentIcon.click();
  asAttachmentButton.click();
  attachButton.click();
});

Then('the draft should remain open', async function () {
  expect(await driver.findElement(locators.compose.filledInDialog(this.subject))).to.be.a('object');
  expect(
    await driver.findElement(locators.verify.unsent.recipientInfo(this.recipientUser)),
  ).to.be.a('object');
  expect(await driver.findElement(locators.verify.unsent.ccInfo(this.ccUser))).to.be.a('object');
  expect(
    await driver.wait(until.elementLocated(locators.verify.unsent.subject(this.subject))),
  ).to.be.a('object');
});

Then('the user should be warned that the recipients are invalid', async function () {
  expect(await driver.wait(until.elementLocated(locators.send.invalidAlert))).to.be.a('object');

  const modalExit = await driver.findElement(locators.send.invalidAlertExit);

  await modalExit.click();

  try {
    await driver.wait(until.elementIsNotVisible(modalExit));
  } catch (e) {
    if (!e.message.includes('stale')) {
      throw e;
    }
  }

  const draft = await driver.findElement(locators.compose.discardDraftButton);
  await draft.click();

  try {
    await driver.wait(until.elementIsNotVisible(draft));
  } catch (e) {
    if (!e.message.includes('stale')) {
      throw e;
    }
  }
});
