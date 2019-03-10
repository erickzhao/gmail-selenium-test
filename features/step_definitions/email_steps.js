/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
require('chromedriver');

const { Builder, By } = require('selenium-webdriver');
const until = require('selenium-webdriver/lib/until');
const {
  After, Given, setDefaultTimeout, Then, When,
} = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const { Users } = require('../../lib/users');

const driver = new Builder().forBrowser('chrome').build();
setDefaultTimeout(45 * 1000);

const isLoggedOut = url => url.startsWith('https://accounts.google.com/signin/');

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

Given('CurrentUser is composing a new message', async function () {
  await driver.wait(until.urlContains('https://mail.google.com/mail/u/0/'), 45 * 1000);
  await driver.get('https://mail.google.com/mail/u/0/#inbox?compose=new');
});

Given('an email draft is addressed to {string} with {string} as a Cc', async function (
  recipient,
  Cc,
) {
  this.recipientUser = getUserEmail(recipient);
  this.ccUser = getUserEmail(Cc);
  this.subject = Date.now();

  const toField = await driver.wait(until.elementLocated(By.css('[name="to"]')), 45 * 1000);
  const subjectField = driver.findElement(By.css('[name="subjectbox"]'));
  await toField.sendKeys(this.recipientUser);
  const ccButton = driver.findElement(By.css('[aria-label^="Add Cc recipients"]'));
  await ccButton.click();
  const ccField = driver.findElement(By.css('textarea[name="cc"]'));
  await driver.wait(until.elementIsVisible(ccField));
  await ccField.sendKeys(this.ccUser);
  await subjectField.sendKeys(`${this.subject}`);
});

Given("a single {string} image is attached from CurrentUser's local computer", async function (
  extension,
) {
  this.attachmentExtension = extension;
  const attachButton = driver.findElement(By.name('Filedata'));
  await attachButton.sendKeys(`${process.cwd()}/images/howdy${this.attachmentExtension}`);
});

When('email is sent', async function () {
  const sendButton = driver.findElement(By.css('[aria-label^="Send"]'));
  sendButton.click();
});

Then('CurrentUser should be alerted that the email was sent successfully', async function () {
  const alert = await driver.wait(
    until.elementLocated(By.xpath('//div[@role="alert" and contains(., "Message sent.")]')),
    45 * 1000,
  );

  expect(alert).to.be.a('object');
});

Then('the draft should no longer be available', async function () {
  return expect(
    driver.findElement(By.xpath('//div[@role="dialog" and contains(., "New Message")]')),
  ).to.be.rejectedWith('no such element');
});

Then('the email should be sent', async function () {
  await driver.get('https://mail.google.com/mail/u/0/#sent');
  await driver.wait(until.titleContains('Sent'));
  driver.wait(
    until.elementLocated(
      By.xpath(
        `//div[@role="main"]/descendant::span[contains(., "${
          this.subject
        }") and boolean(@data-thread-id)]/ancestor::div[@role="link"]`,
      ),
    ),
    20 * 1000,
  );

  await driver.get('https://mail.google.com/mail/u/0/#inbox');
  await driver.wait(until.titleContains('Inbox'));

  this.sentEmailLink = driver.wait(
    until.elementLocated(
      By.xpath(
        `//div[@role="main"]/descendant::span[contains(., "${
          this.subject
        }") and boolean(@data-thread-id)]/ancestor::div[@role="link"]`,
      ),
    ),
  );

  expect(this.sentEmailLink).to.be.a('object');
});

Then('the email should not be sent', async function () {
  await driver.get('https://mail.google.com/mail/u/0/#sent');
  await driver.wait(until.titleContains('Sent'));

  expect(
    driver.findElement(
      By.xpath(
        `//div[@role="main"]/descendant::span[contains(., "${
          this.subject
        }") and boolean(@data-thread-id)]/ancestor::div[@role="link"]`,
      ),
    ),
  ).to.be.rejectedWith('no such element');

  await driver.get('https://mail.google.com/mail/u/0/#inbox');
  await driver.wait(until.titleContains('Inbox'));

  return expect(
    driver.findElement(
      By.xpath(
        `//div[@role="main"]/descendant::span[contains(., "${
          this.subject
        }") and boolean(@data-thread-id)]/ancestor::div[@role="link"]`,
      ),
    ),
  ).to.be.rejectedWith('no such element');
});

Then("the email's details should correspond to the original draft that was sent", async function () {
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

Given('a single {string} image is chosen to be attached from Google Drive', async function (
  extension,
) {
  this.attachmentExtension = extension;

  const googleDriveButton = await driver.findElement(
    By.xpath('//div[@aria-label="Insert files using Drive"]'),
  );
  googleDriveButton.click();

  const drivePickerFrame = await await driver.wait(
    until.elementLocated(By.xpath('//iframe[contains(@src, "docs.google.com/picker")]')),
    30 * 1000,
  );

  await driver.switchTo().frame(drivePickerFrame);

  const attachmentIcon = await driver.wait(
    until.elementLocated(
      By.xpath(`//div[contains(@aria-label, "howdy${this.attachmentExtension}")]`),
      30 * 1000,
    ),
  );

  const asAttachmentButton = await driver.findElement(
    By.xpath('//div[@role="button" and @value="attach"]'),
  );

  const attachButton = await driver.findElement(By.xpath('//div[@role="button" and . = "Insert"]'));

  attachmentIcon.click();
  asAttachmentButton.click();
  attachButton.click();
});

Then('the draft should remain open', async function () {
  expect(
    await driver.findElement(By.xpath('//div[@role="dialog" and contains(., "New Message")]')),
  ).to.be.a('object');
  expect(
    await driver.findElement(
      By.xpath(
        `//input[@type="hidden" and @name="to" and contains(@value, "${this.recipientUser}")]`,
      ),
    ),
  ).to.be.a('object');
  expect(
    await driver.findElement(
      By.xpath(`//input[@type="hidden" and @name="cc" and contains(@value, "${this.ccUser}")]`),
    ),
  ).to.be.a('object');
  expect(
    await driver.wait(
      until.elementLocated(
        By.xpath(
          `//input[@type="hidden" and @name="subject" and contains(@value, "${this.subject}")]`,
        ),
      ),
      10 * 1000,
    ),
  ).to.be.a('object');
});

Then('the user should be warned that the recipients are invalid', async function () {
  expect(
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//div[@role="alertdialog" and contains(.,"Please make sure that all addresses are properly formed.")]',
        ),
      ),
      10 * 1000,
    ),
  ).to.be.a('object');

  const modalExit = await driver.findElement(
    By.xpath('//div[@role="alertdialog"]/descendant::span[@role="button" and @aria-label="Close"]'),
  );

  await modalExit.click();

  try {
    await driver.wait(until.elementIsNotVisible(modalExit));
  } catch (e) {
    if (!e.message.includes('stale')) {
      throw e;
    }
  }

  const draft = await driver.findElement(
    By.xpath('//div[@role="button" and @aria-label="Discard draft"]'),
  );
  await draft.click();

  try {
    await driver.wait(until.elementIsNotVisible(draft));
  } catch (e) {
    if (!e.message.includes('stale')) {
      throw e;
    }
  }
});

After(async function () {
  await driver.get('https://mail.google.com/mail/u/0/#sent');
  await driver.wait(until.titleContains('Sent'));

  const noEmails = await driver.findElements(By.xpath('//td[contains(., "No sent messages")]'));

  if (noEmails.length === 0) {
    const selectAllButton = await driver.findElement(
      By.xpath(
        '//div[@aria-label="Select" and not(ancestor::div[contains(@style, "display: none")])]',
      ),
    );
    await selectAllButton.click();
    const deleteEmailsButton = await driver.findElement(By.xpath('//div[@aria-label="Delete"]'));
    await driver.wait(until.elementIsVisible(deleteEmailsButton));
    await deleteEmailsButton.click();
  }
});
