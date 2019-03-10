/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const until = require('selenium-webdriver/lib/until');
const { After } = require('../../lib/cucumber');
const driver = require('../../lib/driver');
const locators = require('../../lib/locators');

After(async () => {
  await driver.get('https://mail.google.com/mail/u/0/#sent');
  await driver.wait(until.titleContains('Sent'));

  const noEmails = await driver.findElements(locators.after.emptyFolder);

  if (noEmails.length === 0) {
    const selectAllButton = await driver.findElement(locators.after.selectAll);
    await selectAllButton.click();
    const deleteEmailsButton = await driver.findElement(locators.after.deleteSelectedEmails);
    await driver.wait(until.elementIsVisible(deleteEmailsButton));
    await deleteEmailsButton.click();
  }
});
