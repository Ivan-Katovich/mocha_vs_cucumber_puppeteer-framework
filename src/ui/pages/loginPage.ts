import BaseObject from '../baseObject';
import {Page} from 'puppeteer';
import printer from '../../support/utils/log';
// declare const globalConfig: any;

export default class LoginPage extends BaseObject {
    constructor(page: Page) {
        super();
        this.page = page;
    }
    public name = 'LoginPage';
    protected container = {css: '.page'};

    // Elements
    protected userNameField = {css: '#username-login-type-discovery,#UserNameTextBox'};
    protected passwordField = {css: '#password,#PasswordTextBox'};
    protected nextButton = {css: '#button-discovery-next'};
    protected signInBtn = {css: '#btnLoginSubmit,#MainContent_SignInButton'};
    protected signInAgainButton = {css: '[name="SignInAgain"]'};
    protected placeHolderArea = {css: '.ca-query-results-placeholder'};
    protected settingsLink = {css: '#MainContent_SettingsAnchor'};

    public async login() {
        printer.print('method', 'Login in to the application');
        // const bodyVis = await this.waitTillElementVisible();
        // console.log(bodyVis);
        await this.waitTillElementVisible('userNameField');
        await this.type('userNameField', '111@abc.com');
        await this.click('nextButton');
        await this.waitTillElementVisible('passwordField');
        await this.type('passwordField', 'qwerty');
        await this.click('signInBtn');
        // await this.page.waitForTimeout(20000);
    }
}
