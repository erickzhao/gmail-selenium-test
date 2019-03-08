Feature: Sending email with image attachment

  Background:
    Given I am logged into the Gmail web client
    And I am on the homepage
    And the "New Message" prompt is open

  Scenario: Sending email to myself with uploaded image from computer
    Given I have my own email address in the recipient field
    And a single image is uploaded from my local computer
    When I send the email
    Then the "New Message" prompt is closed
    And the email should appear in my inbox
    And the email should appear in my "Sent" folder
    And the recipient should be "me"
    And the appropriate image file should be joined as an attachment to the email

  Scenario: Sending email to myself with image from Google Drive
    Given I have my own email address in the recipient field
    And I have chosen an image from my Google Drive to upload
    When I send the email
    Then the "New Message" prompt is closed
    And the email should appear in my inbox
    And the email should appear in my "Sent" folder
    And the recipient should be "me"
    And the appropriate image file should be joined as an attachment to the email

  Scenario: Sending email to someone else with uploaded image from computer
    Given I have someone else's email address in the recipient field
    And a single image is uploaded from my local computer
    When I send the email
    Then the "New Message" prompt is closed
    And the email should not appear in my inbox
    And the email should appear in my "Sent" folder
    And the recipient should be the recipient's email address
    And the appropriate image file should be joined as an attachment to the email

  Scenario: Adding myself as CC in email to someone else with uploaded image from computer
    Given I have someone else's email address in the recipient field
    And I have my own email address in the CC field
    And a single image is uploaded from my local computer
    When I send the email
    Then the "New Message" prompt is closed
    And the email should appear in my inbox
    And the email should appear in my "Sent" folder
    And the recipient should be the recipient's email address
    And my email should be listed as a CC
    And the appropriate image file should be joined as an attachment to the email

  Scenario: Sending image as attachment without recipient
    Given there is no email in the recipient, CC, or BCC fields
    And a single image is uploaded from my local computer
    When I send the email
    Then a modal appears asking me to specify at least one recipient
    And the "New Message" prompt is still there with the attachment
    And the email should not appear in my "Sent" folder
    And the email should not appear in my inbox
