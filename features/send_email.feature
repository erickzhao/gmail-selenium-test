Feature: Sending email with image attachment

  Background:
    Given CurrentUser is logged into the Gmail web client
    And CurrentUser is has the New Message prompt open

  Scenario Outline: Sending emails to a valid recipient using files from Computer (Normal Flow)
    Given the New Message prompt has <recipient> email address in the recipient field
    And <cc> email address is in CC field
    And some message is currently filled in
    And a single <filetype> image is uploaded from my local computer
    When email is sent
    Then an alert should appear telling CurrentUser that the email was sent
    And the New Message prompt should be closed
    And the email should appear in CurrentUser's "inbox" folder
    And the email should appear in CurrentUser's "sent" folder
    And the email's details should be accessible

    Examples:
      | recipient       | cc              | filetype |
      | "CurrentUser"'s | "OtherUser"'s   | ".png"   |
      | "CurrentUser"'s | "OtherUser"'s   | ".jpg"   |
      | "OtherUser"'s   | "CurrentUser"'s | ".tiff"  |
      | "OtherUser"'s   | "CurrentUser"'s | ".gif"   |
      | "OtherUser"'s   | "CurrentUser"'s | ".svg"   |

  Scenario Outline: Sending emails to a valid recipient using files from Google Drive (Alternate Flow)
    Given the New Message prompt has <recipient> email address in the recipient field
    And <cc> email address is in CC field
    And some message is currently filled in
    And a single <filetype> image is chosen to be attached from Google Drive
    When email is sent
    Then an alert should appear telling CurrentUser that the email was sent
    And the New Message prompt should be closed
    And the email should appear in CurrentUser's "inbox" folder
    And the email should appear in CurrentUser's "sent" folder
    And the email's details should be accessible

    Examples:
      | recipient       | cc              | filetype |
      | "CurrentUser"'s | "OtherUser"'s   | ".png"   |
      | "CurrentUser"'s | "OtherUser"'s   | ".jpg"   |
      | "OtherUser"'s   | "CurrentUser"'s | ".tiff"  |
      | "OtherUser"'s   | "CurrentUser"'s | ".gif"   |
      | "OtherUser"'s   | "CurrentUser"'s | ".svg"   |

  Scenario Outline: Sending emails to invalid recipient using files from Computer (Error Flow)
    Given the New Message prompt has <recipient> email address in the recipient field
    And <cc> email address is in CC field
    And some message is currently filled in
    And a single <filetype> image is uploaded from my local computer
    When email is sent
    Then the New Message prompt should remain open with the existing information
    And a modal warning the user of an invalid email should appear
    And the email should not appear in CurrentUser's "sent" folder
    And the email should not appear in CurrentUser's "inbox" folder
    Examples:
      | recipient       | cc              | filetype |
      | "CurrentUser"'s | "InvalidUser"'s | ".png"   |
      | "CurrentUser"'s  | "InvalidUser"'s | ".jpg"   |
      | "InvalidUser"'s | "CurrentUser"'s | ".tiff"  |
      | "InvalidUser"'s | "CurrentUser"'s | ".gif"   |
      | "InvalidUser"'s | "InvalidUser"'s | ".svg"   |
