Feature: Sending email with image attachment

  Background:
    Given CurrentUser is logged into the Gmail web client
    And CurrentUser is composing a new message

  Scenario Outline: Sending emails to a valid recipient using files from Computer (Normal Flow)
    Given an email draft is addressed to <recipient> with <cc> as a Cc
    And a single <filetype> image is attached from CurrentUser's local computer
    When email is sent
    Then CurrentUser should be alerted that the email was sent successfully
    And the draft should no longer be available
    And the email should be sent
    And the email's details should correspond to the original draft that was sent

    Examples:
      | recipient     | cc            | filetype |
      | "CurrentUser" | "OtherUser-1" | ".png"   |
      | "CurrentUser" | "OtherUser-2" | ".jpg"   |
      | "OtherUser-3" | "CurrentUser" | ".tiff"  |
      | "OtherUser-4" | "CurrentUser" | ".gif"   |
      | "OtherUser-5" | "CurrentUser" | ".svg"   |

  Scenario Outline: Sending emails to a valid recipient using files from Google Drive (Alternate Flow)
    Given an email draft is addressed to <recipient> with <cc> as a Cc
    And a single <filetype> image is chosen to be attached from Google Drive
    When email is sent
    Then CurrentUser should be alerted that the email was sent successfully
    And the draft should no longer be available
    And the email should be sent
    And the email's details should correspond to the original draft that was sent

    Examples:
      | recipient     | cc            | filetype |
      | "CurrentUser" | "OtherUser-1" | ".png"   |
      | "CurrentUser" | "OtherUser-2" | ".jpg"   |
      | "OtherUser-3" | "CurrentUser" | ".tiff"  |
      | "OtherUser-4" | "CurrentUser" | ".gif"   |
      | "OtherUser-5" | "CurrentUser" | ".svg"   |

  Scenario Outline: Sending emails to invalid recipient using files from Computer (Error Flow)
    Given an email draft is addressed to <recipient> with <cc> as a Cc
    And a single <filetype> image is attached from CurrentUser's local computer
    When email is sent
    Then the draft should remain open
    And the user should be warned that the recipients are invalid
    And the email should not be sent
    Examples:
      | recipient       | cc              | filetype |
      | "CurrentUser"   | "InvalidUser-1" | ".png"   |
      | "CurrentUser"   | "InvalidUser-2" | ".jpg"   |
      | "InvalidUser-3" | "CurrentUser"   | ".tiff"  |
      | "InvalidUser-4" | "CurrentUser"   | ".gif"   |
      | "InvalidUser-5" | "CurrentUser"   | ".svg"   |
