import { Given, When, Then } from '@cucumber/cucumber';

When(/^I click on '([a-zA-z]+)'(?: in the '(.*)'|)$/, async function(element, path) {
    if (path) {
        this.setCurrentObjectByPath(path);
    }
    await this.currentObject.click(element);
});

When(/^I login to the application$/, async function() {
    await this.app.ui.loginPage.login();
});

When(/^I wait for page loading$/, async function() {
    await this.app.ui.mainPage.waitForLoading();
});

Then(/^the '([a-zA-z]*)'(?: in the '(.*)'|) should be (visible|invisible)$/, async function(element, path, condition) {
    condition = condition === 'visible';
    if (path) {
        this.setCurrentObjectByPath(path);
    }
    this.app.expect(await this.currentObject.isVisible(element)).to.equal(condition);
});
