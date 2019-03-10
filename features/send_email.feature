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
      | recipient       | cc            | filetype |
      | "CurrentUser"'s | "OtherUser"'s | ".PNG"   |
#     | "CurrentUser"s  | "OtherUser"'s   | ".JPG"   |
#     | "OtherUser"'s   | "CurrentUser"'s | ".BMP"   |
#     | "OtherUser"'s   | "CurrentUser"'s | ".GIF"   |
#     | "OtherUser"'s   | "CurrentUser"'s | ".SVG"   |

# Scenario Outline: Sending emails to a valid recipient using files from Google Drive (Alternate Flow)
#   Given the New Message prompt has <recipient> email address in the recipient field
#   And <cc> email address is in CC field
#   And a single <filetype> image is chosen to be attached from Google Drive
#   When email is sent
#   Then the New Message prompt is closed
#   And the email <inbox_status> appear in CurrentUser's inbox
#   And the email should appear in CurrentUser's Sent folder
#   And the recipient should be <recipient>
#   And the <filetype> image file should appear as an attachment to the email

#   Examples:
#     | recipient       | cc              | filetype |
#     | "CurrentUser"'s | "OtherUser"'s   | ".PNG"   |
#     | "CurrentUser"s  | "OtherUser"'s   | ".JPG"   |
#     | "OtherUser"'s   | "CurrentUser"'s | ".BMP"   |
#     | "OtherUser"'s   | "CurrentUser"'s | ".GIF"   |
#     | "OtherUser"'s   | "OtherUser"'s   | ".SVG"   |

# Scenario Outline: Sending emails to invalid recipient using files from Computer (Error Flow)
#   Given the New Message prompt has <recipient> email in the recipient field
#   And <cc> email is in CC field
#   And a single <filetype> image is chosen to be attached from Google Drive
#   When email is sent
#   Then the New Message prompt should remain open with the existing information
#   And a modal warning the user of an invalid email should appear
#   And the email should not appear in CurrentUser's Sent folder
#   And the email should not appear in CurrentUser's Inbox folder
#   Examples:
#     | recipient       | cc              | filetype |
#     | "CurrentUser"'s | "InvalidUser"'s | ".PNG"   |
#     | "CurrentUser"s  | "InvalidUser"'s | ".JPG"   |
#     | "InvalidUser"'s | "CurrentUser"'s | ".BMP"   |
#     | "InvalidUser"'s | "CurrentUser"'s | ".GIF"   |
#     | "InvalidUser"'s | "InvalidUser"'s | ".SVG"   |
