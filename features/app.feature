Feature: Login
  In order check app
  As a user
  I want to login to the application

  Scenario: Login 1
    When I login to the application
    And I wait for page loading
    Then the 'mainLogo' in the 'mainPage' should be visible
    And the 'mainLogo' should be visible

  Scenario: Login 2
    When I login to the application
    And I wait for page loading
    Then the 'mainLogo' in the 'mainPage' should be visible
    And the 'mainLogo' should be invisible

