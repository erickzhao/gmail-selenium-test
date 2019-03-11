/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const until = require('selenium-webdriver/lib/until');
const { expect } = require('../../lib/chai');
const { Given, When, Then } = require('../../lib/cucumber');
const driver = require('../../lib/driver');
const { getUserEmail, goToInboxFolder, goToSentFolder } = require('../../lib/utils');
const locators = require('../../lib/locators');
const { Credentials } = require('../../lib/users');

Given('I have an email draft addressed to {string} with {string} as a Cc', async function (
  recipient,
  Cc,
) {
  // get scenario's recipient and cc
  // save within "this" to reuse in future steps when validating
  this.recipientUser = getUserEmail(recipient);
  this.ccUser = getUserEmail(Cc);
  // unique subject and body based on timestamp at which this command was run
  this.subject = Date.now();
  this.body = `On ${new Date().toUTCString()}, the sobbing rabbit says howdy!`;

  // grab each field and fill it in with appropriate keys
  const toField = await driver.wait(until.elementLocated(locators.compose.toField));
  await driver.wait(until.elementIsVisible(toField));
  await toField.sendKeys(this.recipientUser);

  const ccButton = driver.findElement(locators.compose.ccButton);
  await ccButton.click();
  const ccField = driver.findElement(locators.compose.ccField);
  // cc field not immediately visible after button is clicked, so need to wait
  await driver.wait(until.elementIsVisible(ccField));
  await ccField.sendKeys(this.ccUser);

  const subjectField = driver.findElement(locators.compose.subjectField);
  await driver.wait(until.elementIsVisible(subjectField));
  await subjectField.sendKeys(`${this.subject}`);

  const bodyField = driver.findElement(locators.compose.bodyField);
  await driver.wait(until.elementIsVisible(bodyField));
  await bodyField.sendKeys(this.body);
});

Given('I have chosen a single {string} image to be attached from my local computer', async function (
  extension,
) {
  // normal flow: attach image from /images folder.
  // each is called "howdy" w/ a different extension
  this.attachmentExtension = extension;
  const attachButton = driver.findElement(locators.attach.fromComputerButton);
  await attachButton.sendKeys(`${process.cwd()}/images/howdy${this.attachmentExtension}`);
});

When('I send the email', async function () {
  const sendButton = driver.findElement(locators.compose.sendButton);
  sendButton.click();
});

Then('I should be alerted that the email was sent successfully', async function () {
  // alert only shows matching message after message is successfully sent
  const alert = await driver.wait(until.elementLocated(locators.send.sentAlert));
  expect(alert).to.be.a('object');
});

Then('the draft should no longer be available', async function () {
  // to remove access to the draft, Gmail removes the dialog from the DOM
  return expect(
    driver.findElement(locators.compose.filledInDialog(this.subject)),
  ).to.be.rejectedWith('no such element');
});

Then('the email should be sent', async function () {
  // email should appear in both inbox and sent folders because the CurrentUser
  // is always added as a CC or recipient
  await goToSentFolder();
  driver.wait(until.elementLocated(locators.verify.sent.emailInFolder(this.subject)));

  await goToInboxFolder();
  this.sentEmailLink = driver.wait(
    until.elementLocated(locators.verify.sent.emailInFolder(this.subject)),
  );

  expect(this.sentEmailLink).to.be.a('object');
});

Then('the email should not be sent', async function () {
  // check both inbox and sent folders
  await goToSentFolder();
  expect(driver.findElement(locators.verify.sent.emailInFolder(this.subject))).to.be.rejectedWith(
    'no such element',
  );

  await goToInboxFolder();
  // return Promise here so that email works
  return expect(
    driver.findElement(locators.verify.sent.emailInFolder(this.subject)),
  ).to.be.rejectedWith('no such element');
});

Then("the email's details should correspond to the original draft that was sent", async function () {
  // navigate to the sent email's details page
  this.sentEmailLink.click();
  await driver.wait(until.titleIs(`${this.subject} - ${Credentials.email} - Gmail`));

  // need to click on a specific button so that the detail elements are accessible
  const showDetails = await driver.findElement(locators.verify.sent.showDetailsButton);
  showDetails.click();

  // verify that each field matches up to what was sent earlier
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

  // alt flow: attach from drive
  const googleDriveButton = await driver.findElement(locators.attach.fromDriveButton);
  googleDriveButton.click();

  // google drive picker is in an iframe, so we need to switch Selenium
  // contexts to access its DOM
  const drivePickerFrame = await await driver.wait(
    until.elementLocated(locators.attach.drive.pickerFrame),
  );

  await driver.switchTo().frame(drivePickerFrame);

  const attachmentIcon = await driver.wait(
    until.elementLocated(locators.attach.drive.attachmentSelect(this.attachmentExtension)),
  );

  // need to specify that we want to attach the link as an attachment rather than a GDrive link
  const asAttachmentButton = await driver.findElement(locators.attach.drive.asAttachmentButton);

  const attachButton = await driver.findElement(locators.attach.drive.insertAttachmentButton);

  attachmentIcon.click();
  asAttachmentButton.click();
  attachButton.click();
});

Then('the draft should remain open', async function () {
  // check if dialog and all its info are intact from before we attempted to send the email
  const filledInDialog = await driver.findElement(locators.compose.filledInDialog(this.subject));
  const recipientInfo = await driver.findElement(
    locators.verify.unsent.recipientInfo(this.recipientUser),
  );
  const ccInfo = await driver.findElement(locators.verify.unsent.ccInfo(this.ccUser));
  const subject = await driver.wait(
    until.elementLocated(locators.verify.unsent.subject(this.subject)),
  );
  const body = await driver.wait(until.elementLocated(locators.verify.unsent.body(this.body)));

  expect(filledInDialog).to.be.a('object');
  expect(recipientInfo).to.be.a('object');
  expect(ccInfo).to.be.a('object');

  expect(subject).to.be.a('object');
  expect(body).to.be.a('object');
});

Then('I should be warned that the recipients are invalid', async function () {
  // modal should pop up warning us of error
  expect(await driver.wait(until.elementLocated(locators.send.invalidAlert))).to.be.a('object');

  // need to click away and wait until it goes away to continue any other operations
  const modalExit = await driver.findElement(locators.send.invalidAlertExit);
  await modalExit.click();

  try {
    await driver.wait(until.elementIsNotVisible(modalExit));
  } catch (e) {
    // if WebElement has already gone stale (i.e. already removed from DOM
    // before this fn is executed), catch error and continue.
    if (!e.message.includes('stale')) {
      throw e;
    }
  }

  // discard draft after it's no longer needed, and wait until it's done
  const draft = await driver.findElement(locators.compose.discardDraftButton);
  await draft.click();

  try {
    await driver.wait(until.elementIsNotVisible(draft));
  } catch (e) {
    // if draft already gone stale before the wait function calls, fn will
    // throw, but this is intended behavior.
    if (!e.message.includes('stale')) {
      throw e;
    }
  }
});
