/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const until = require('selenium-webdriver/lib/until');
const { After } = require('../../lib/cucumber');
const driver = require('../../lib/driver');
const locators = require('../../lib/locators');
const { goToSentFolder, goToInboxFolder } = require('../../lib/utils');

/**
 * Tear-down by clearing the user's sent folder after every scenario.
 * Since our inbox also contains all sent items, Gmail automatically
 * clears the inbox as well.
 */
After(async () => {
  await goToSentFolder();

  // check if any messages saying Sent folder is empty exist
  const noEmails = await driver.findElements(locators.after.emptyFolder);

  // if there is no message saying that the folder is empty,
  // this means there are emails in the folder
  if (noEmails.length === 0) {
    // select entire folder
    const selectAllButton = await driver.findElement(locators.after.selectAll);
    await selectAllButton.click();
    // press delete
    const deleteEmailsButton = await driver.findElement(locators.after.deleteSelectedEmails);
    await driver.wait(until.elementIsVisible(deleteEmailsButton));
    await deleteEmailsButton.click();
  }

  // go back to initial page (inbox)
  await goToInboxFolder();
});
