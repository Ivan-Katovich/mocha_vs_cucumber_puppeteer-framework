/* eslint-disable no-useless-escape */
import allureCmd from 'allure-commandline';
import * as cucumberHtmlReporter from 'cucumber-html-reporter';
import * as fs from 'fs';
import del from 'del';
import path from 'path';
declare const globalConfig: any;

export const allureGenerate = async (): Promise<void> => {
    const env = `
<environment>
    <parameter>
        <key>Browser</key>
        <value>Chrome</value>
    </parameter>
    <parameter>
        <key>Environment</key>
        <value>Test</value>
    </parameter>
    <parameter>
        <key>Client</key>
        <value>BCDT</value>
    </parameter>
    <parameter>
        <key>User</key>
        <value>Test</value>
    </parameter>
    <parameter>
        <key>Suite</key>
        <value>Smoke</value>
    </parameter>
</environment>
`;
    const defectCategories = [
        {
            'name': 'Ignored tests',
            'matchedStatuses': ['skipped']
        },
        {
            'name': 'Assertion issues',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': '.*AssertionError.*'
        }
    ];
    fs.writeFileSync('reports/allure/allure-results/categories.json', JSON.stringify(defectCategories));
    fs.writeFileSync('reports/allure/allure-results/environment.xml', env);
    const generation = allureCmd(['generate', 'reports/allure/allure-results', '-o', 'reports/allure/allure-report', '--clean']);
    return new Promise((resolve) => {
        generation.on('exit', function(exitCode) {
            console.log('Generation is finished with code:', exitCode);
            resolve();
        });
    });
};

export const cucumberHtmlGenerate = () => {
    const options = {
        theme: 'bootstrap',
        jsonDir: 'reports/json',
        output: 'reports/html/cucumber-report.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        launchReport: false,
        brandTitle: 'Smoke suite',
        // screenshotsDirectory: 'screenshots/',
        storeScreenshots: true,
        metadata: {
            'Test Environment': 'Dev',
            'Browser': 'Chrome',
            'Platform': 'Windows 10'
        }
    };
    // return new Promise((resolve) => {
    //     // @ts-ignore
    //     cucumberHtmlReporter.generate(options, () => {
    //         resolve();
    //     });
    // });
    // @ts-ignore
    cucumberHtmlReporter.generate(options);
};

export const setUpPrebuildSettings = async () => {
    if (globalConfig.clean.match(/all/)) {
        await del('reports');
        console.log('All Reports were deleted');
    }
    if (globalConfig.clean.match(/html/)) {
        await del('reports/allure');
        await del('reports/html');
        console.log('HTML report was deleted');
    }
    if (globalConfig.clean.match(/logs/)) {
        await del('reports/logs');
        console.log('Logs were deleted');
    }
    if (globalConfig.clean.match(/screenshots/)) {
        await del('reports/screenshots');
        console.log('Screenshots were deleted');
    }
    if (globalConfig.clean.match(/json/)) {
        await del('reports/json');
        console.log('JSON reports were deleted');
    }
    if (!fs.existsSync('reports')) fs.mkdirSync('reports');
    if (!fs.existsSync('reports/allure')) fs.mkdirSync('reports/allure');
    if (!fs.existsSync('reports/logs')) fs.mkdirSync('reports/logs');
    if (!fs.existsSync('reports/screenshots')) fs.mkdirSync('reports/screenshots');
    if (!fs.existsSync('reports/json')) fs.mkdirSync('reports/json');
    if (!fs.existsSync('reports/html')) fs.mkdirSync('reports/html');
};

export const setUpGlobal = (global, possibleOptionsArray, defaultValue, isMultiplePossible = false) => {
    if (global === undefined || global === '' || global === ' ' || global === null) {
        global = defaultValue;
    } else {
        if (possibleOptionsArray.length > 0) {
            if (!isMultiplePossible) {
                if (!possibleOptionsArray.includes(global)) {
                    throw new Error(`Wrong global value - '${global}', it should be one of '[${possibleOptionsArray.join(', ')}]'`);
                }
            } else {
                const valuesArr = global.split(/[/,:;.\\]/);
                valuesArr.forEach((value) => {
                    if (!possibleOptionsArray.includes(value)) {
                        throw new Error(`Wrong global's multiple value - '${global}', it should consist of '[${possibleOptionsArray.join(', ')}]'`);
                    }
                });
            }
        }
    }
    return global;
};

export const setUpFlag = (global) => {
    return global === 'true';
};

export const mochaPromisedRunner = (mocha: Mocha) => {
    return new Promise((resolve) => {
        mocha.run(failures => resolve(failures));
    });
};

export const findAllTestFiles = (directories: string[]): string[] => {
    const regexpForJsFiles = new RegExp('\.js$');
    function* findFiles(dir: string, regexp?: RegExp) {
        const occurrences = fs.readdirSync(dir, { withFileTypes: true });
        for (const occurrence of occurrences) {
            const item = path.resolve(dir, occurrence.name);
            if (occurrence.isDirectory()) {
                yield* findFiles(item);
            } else {
                if (regexp) {
                    if (item.match(regexp)) {
                        yield item;
                    }
                } else {
                    yield item;
                }
            }
        }
    }
    const files = [];
    for (const dir of directories) {
        if (dir.match(regexpForJsFiles)) {
            files.push(dir);
        } else {
            const iterator = findFiles(dir, regexpForJsFiles);
            let property = iterator.next();
            while (!property.done) {
                files.push(property.value);
                property = iterator.next();
            }
        }
    }
    console.log(files);
    return files;
};
