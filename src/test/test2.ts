import app from '../app';

describe('application suite 1', function() {

    it('application test 1', async function() {
        await app.step('step 1', async () => {
            await app.ui.loginPage.login();
            // app.expect(false).to.equal(true);
        });
        await app.step('step 2', async () => {
            await app.ui.mainPage.waitForLoading();
        });
        await app.step('step 3', async () => {
            app.expect(await app.ui.mainPage.isVisible('mainLogo')).to.equal(true);
        });
    });

    it('application test 2', async function() {
        await app.step('step 1', async () => {
            await app.ui.loginPage.login();
            // app.expect(false).to.equal(true);
        });
        await app.step('step 2', async () => {
            await app.ui.mainPage.waitForLoading();
        });
        await app.step('step 3', async () => {
            app.expect(await app.ui.mainPage.isVisible('mainLogo')).to.equal(false);
            app.expect(false).to.equal(true);
        });
    });

    xit('application test 3', async function() {
        await app.step('step 1', async () => {
            await app.ui.waitTimeout(5000);
            app.expect(2).to.be.a('number');
        });
    });
});
