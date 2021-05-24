import {BeforeAll, Before, After, AfterAll, setDefaultTimeout} from '@cucumber/cucumber';
import app from '../../app';

let isFirst: boolean = true;

setDefaultTimeout(180000);

BeforeAll(async function() {
    console.log(this);
    await app.ui.start();
    await app.ui.open();
});

AfterAll(async function() {
    await app.ui.stop();
});

Before(async function() {
    if (isFirst) {
        isFirst = false;
    } else {
        await this.app.ui.clean();
        app.ui.cleanElementStorageGlobally();
        await this.app.ui.refresh();
    }
});

After(async function(scenario) {
    if (scenario.result.status !== 1) {
        const img = await app.ui.takeScreenshot();
        this.attach(img, 'image/png');
    }
});
