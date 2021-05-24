import {Cli} from '@cucumber/cucumber';
import path from 'path';
import * as helper from '../support/utils/runnerHelper';
import 'source-map-support/register';

// @ts-ignore
global.globalConfig = {
    clean: helper.setUpGlobal(process.env.npm_config_clean, ['all', 'html', 'logs', 'screenshots', 'false'], 'false', true),
    log: helper.setUpGlobal(process.env.npm_config_log, ['all', 'console', 'file', 'false'], 'file'),
    monochrome: helper.setUpFlag(process.env.npm_config_monochrome),
    suite: null
};

(async () => {
    await helper.setUpPrebuildSettings();
    try {
        const params = {
            argv: [
                process.env.NODE,
                path.resolve(process.cwd(), 'node_modules/@cucumber/cucumber/bin/cucumber-js'),
                'features/**/*.feature',
                '--require',
                'dist/steps/**/*.js',
                '--no-strict',
                '--format',
                '@cucumber/pretty-formatter',
                '--format',
                'json:./reports/json/cucumber-report.json'
                // '--format',
                // './dist/configuration/cucumberAllureReporter.js:./dummy.txt'
            ],
            cwd: process.cwd(),
            stdout: process.stdout
        };

        const runner = new Cli(params);
        const succeeded = await runner.run();
        helper.cucumberHtmlGenerate();
        process.exit(succeeded.success ? 0 : 1);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
})();


