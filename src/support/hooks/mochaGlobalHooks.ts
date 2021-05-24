import app from '../../app';

let isFirst: boolean = true;

export const mochaHooks = {
    async beforeAll() {
        await app.ui.start();
        await app.ui.open();
    },
    async afterAll() {
        await app.ui.stop();
        app.writeResults();
    },
    async beforeEach() {
        if (isFirst) {
            isFirst = false;
        } else {
            await app.step('Clean the page', async () => {
                await app.ui.clean();
                app.ui.cleanElementStorageGlobally();
                await app.ui.refresh();
            });
        }
    },
    async afterEach() {
        if (this.currentTest.state == 'failed') {
            const img = await app.ui.takeScreenshot();
            app.ui.attachScreenshot(img);
        }
    }
};
