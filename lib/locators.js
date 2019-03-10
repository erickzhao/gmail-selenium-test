const { By } = require('selenium-webdriver');

const locators = {
  signin: {
    emailField: By.xpath('//input[@id="identifierId"]'),
    passwordField: By.xpath('//input[@name="password"]'),
    nextButton: By.xpath('//div[@role="button" and @id="identifierNext"]'),
    submitButton: By.xpath('//div[@id="passwordNext"]'),
  },
  compose: {
    toField: By.xpath('//textarea[@name="to"]'),
    ccButton: By.xpath('//span[@role="link" and contains(@aria-label,"Add Cc recipients")]'),
    ccField: By.xpath('//textarea[@name="cc"]'),
    subjectField: By.xpath('//input[@name="subjectbox"]'),
    bodyField: By.xpath('//div[@aria-label="Message Body"]'),
    sendButton: By.xpath('//div[@role="button" and contains(@aria-label,"Send")]'),
    filledInDialog: subject => By.xpath(`//div[@role="dialog" and contains(., "${subject}")]`),
    discardDraftButton: By.xpath('//div[@role="button" and @aria-label="Discard draft"]'),
  },
  attach: {
    fromComputerButton: By.xpath('//input[@name="Filedata"]'),
    fromDriveButton: By.xpath('//div[@aria-label="Insert files using Drive"]'),
    drive: {
      pickerFrame: By.xpath('//iframe[contains(@src, "docs.google.com/picker")]'),
      attachmentSelect: extension => By.xpath(`//div[contains(@aria-label, "howdy${extension}")]`),
      asAttachmentButton: By.xpath('//div[@role="button" and @value="attach"]'),
      insertAttachmentButton: By.xpath('//div[@role="button" and . = "Insert"]'),
    },
  },
  send: {
    sentAlert: By.xpath('//div[@role="alert" and contains(., "Message sent.")]'),
    invalidAlert: By.xpath(
      '//div[@role="alertdialog" and contains(.,"Please make sure that all addresses are properly formed.")]',
    ),
    invalidAlertExit: By.xpath(
      '//div[@role="alertdialog"]/descendant::span[@role="button" and @aria-label="Close"]',
    ),
  },
  verify: {
    sent: {
      showDetailsButton: By.xpath('//img[@role="button" and @aria-label="Show details"]'),
      emailInFolder: subject => By.xpath(`//tr[contains(., "${subject}")]/descendant::div[@role="link"]`),
      attachmentPreview: extension => By.xpath(`//span[contains(., "Preview attachment howdy${extension}")]`),
      senderInfo: By.xpath(
        '//span[contains(., "from:")]/parent::td/following-sibling::td/descendant::span[@email="sobbingrabbit@gmail.com"]',
      ),
      recipientInfo: recipient => By.xpath(
        `//span[contains(., "to:")]/parent::td/following-sibling::td/descendant::span[@email="${recipient}"]`,
      ),
      ccInfo: cc => By.xpath(
        `//span[contains(., "cc:")]/parent::td/following-sibling::td/descendant::span[@email="${cc}"]`,
      ),
      subject: subject => By.xpath(`//h2[.="${subject}"]`),
      body: body => By.xpath(`//div[boolean(@data-message-id)]/descendant::div[.="${body}"]`),
    },
    unsent: {
      recipientInfo: recipient => By.xpath(`//input[@type="hidden" and @name="to" and contains(@value, "${recipient}")]`),
      ccInfo: cc => By.xpath(`//input[@type="hidden" and @name="cc" and contains(@value, "${cc}")]`),
      subject: subject => By.xpath(`//input[@type="hidden" and @name="subject" and contains(@value, "${subject}")]`),
    },
  },
  after: {
    emptyFolder: By.xpath('//td[contains(., "No sent messages")]'),
    selectAll: By.xpath(
      '//div[@aria-label="Select" and not(ancestor::div[contains(@style, "display: none")])]',
    ),
    deleteSelectedEmails: By.xpath('//div[@aria-label="Delete"]'),
  },
};

module.exports = locators;
