import BaseObject from '../baseObject';
import {Page} from 'puppeteer';
import printer from '../../support/utils/log';
// declare const globalConfig: any;

export default class MainPage extends BaseObject {
    constructor(page: Page) {
        super();
        this.page = page;
    }
    public name = 'MainPage';
    protected container = {css: '.app'};

    // Elements
    protected spinner = {css: '.spinner-image'};
    protected mainLogo = {css: '.header-bar__main-logo'};

    public async waitForLoading() {
        printer.print('method', 'Waiting for page is loaded');
        await this.page.waitForSelector(this.spinner.css, {visible: true, timeout: 10000});
        await this.page.waitForSelector(this.spinner.css, {hidden: true, timeout: 100000});
    }
}
