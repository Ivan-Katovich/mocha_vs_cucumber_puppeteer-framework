/* eslint-disable @typescript-eslint/no-var-requires*/
import Mocha from 'mocha';
import 'source-map-support/register';
import 'mocha-allure-reporter';
import * as helper from '../support/utils/runnerHelper';
import * as plugins from '../support/plugins/plugins';
import { mochaHooks } from '../support/hooks/mochaGlobalHooks';

// @ts-ignore
global.globalConfig = {
    clean: helper.setUpGlobal(process.env.npm_config_clean, ['all', 'html', 'logs', 'screenshots', 'json', 'false'], 'false', true),
    log: helper.setUpGlobal(process.env.npm_config_log, ['all', 'console', 'file', 'false'], 'all'),
    monochrome: helper.setUpFlag(process.env.npm_config_monochrome),
    suite: null
};

//@ts-ignore
global.globalInfo = {
    executionStartTime: null,
    executionEndTime: null,
    executionDuration: null,
    tests: {
        common: 0,
        passed: 0,
        skipped: 0,
        failed: 0,
    },
    //@ts-ignore
    suite: globalConfig.suite
};

(async () => {
    await helper.setUpPrebuildSettings();
    plugins.fixReporting();
    try {
        const mocha = new Mocha({
            // grep: /test/,
            rootHooks: mochaHooks,
            timeout: 250000,
            reporter: 'mocha-allure-reporter',
            reporterOptions: {
                targetDir: 'reports/allure/allure-results'
            }
        });
        mocha.files = helper.findAllTestFiles(['./dist/test/test2.js']);
        const failures = await helper.mochaPromisedRunner(mocha);
        await helper.allureGenerate();
        process.exit(failures ? 1 : 0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();

