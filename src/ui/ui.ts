import BaseObject from './baseObject';
import puppeteer, {Browser} from 'puppeteer';
import LoginPage from './pages/loginPage';
import MainPage from './pages/mainPage';
import printer from '../support/utils/log';
import timeService from '../services/entries/timeService';

declare const allure: any;

export default class Ui extends BaseObject {
    public name = 'Ui';

    private browser: Browser;

    // Getters
    get loginPage() {
        return this.createGetter(LoginPage, this.page);
    }

    get mainPage() {
        return this.createGetter(MainPage, this.page);
    }

    // Puppeteer runner
    public async start() {
        this.browser = await puppeteer.launch({
            product: 'chrome',
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: false,
            defaultViewport: {width: 1280, height: 720},
            // ignoreDefaultArgs: ['--enable-automation'],
            args: [`--window-size=${1280},${720}`]
        });
        printer.print('method', 'Browser under puppeteer control is started');
    }

    public async open() {
        this.page = await this.browser.newPage();
        await this.page.goto('https://localhost', {
            timeout: 120000,
            waitUntil: 'networkidle0'
        });
        await this.page.setCacheEnabled(false);
        printer.print('method', 'Page is opened');
    }

    public async close() {
        await this.page.close();
        printer.print('method', 'Page is closed');
    }

    public async clean() {
        await this.page.setCacheEnabled(false);
        const client = await this.page.target().createCDPSession();
        await client.send('Network.clearBrowserCookies');
        printer.print('method', 'Page is clean');
    }

    public async refresh() {
        await this.page.reload({waitUntil: 'networkidle0'});
        printer.print('method', 'Page is refreshed');
    }

    public async stop() {
        await this.browser.close();
        printer.print('method', 'Browser is closed');
    }

    public async waitTimeout(timeout) {
        printer.print('method', `Wait for ${timeout} milliseconds`);
        await this.page.waitForTimeout(timeout);
    }

    public cleanElementStorageGlobally() {
        function cleanStorage(rootObject: BaseObject) {
            const objects = rootObject.cleanElementStorage();
            if (objects.length) {
                objects.forEach((obj) => {
                    cleanStorage(obj);
                });
            }
        }
        cleanStorage(this);
        printer.print('method', 'Elements storages are clean');
    }

    public async takeScreenshot(): Promise<any> {
        printer.print('method', 'Take screenshot');
        const now = timeService.nowStr({format: 'YYYY-MM-DD_HH-mm-ss'});
        return await this.page.screenshot({path: `reports/screenshots/screenshot-${now}.png`});
    }

    public attachScreenshot(png) {
        printer.print('method', 'Attach screenshot to Allure report');
        allure.createAttachment('screenshots', Buffer.from(png, 'base64'), 'image/png');
    }


}
