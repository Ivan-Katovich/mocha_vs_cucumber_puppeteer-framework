/* eslint-disable */
declare const globalInfo: any;

function AllureReporter(runner, opts) {
    const printer = require('../../utils/log').default;
    const timeService = require('../../../services/entries/timeService').default;
    const Base = require("mocha").reporters.Base;
    const Allure = require("allure-js-commons");
    const allureReporter = new Allure();
    const Runtime = require("allure-js-commons/runtime");

    function* getAllTests(suite) {
        if (suite.tests && suite.tests.length) {
            for (let test of suite.tests) {
                yield test;
            }
        }
        if (suite.suites && suite.suites.length) {
            for (let st of suite.suites) {
                yield* getAllTests(st);
            }
        }

    }

    // @ts-ignore
    global.allure = new Runtime(allureReporter);

    Base.call(this, runner);
    allureReporter.setOptions(opts.reporterOptions || {});

    function invokeHandler(handler) {
        return function() {
            try {
                return handler.apply(this, arguments);
            } catch(error) {
                console.error("Internal error in Allure:", error); // eslint-disable-line no-console
            }
        };
    }

    runner.on("suite", invokeHandler(function (suite) {
        const logLevel = suite.title ? 'DESCRIBE' : 'WARN';
        const suiteName = suite.title ? suite.fullTitle() : 'Global suite';
        const iterator = getAllTests(suite);
        const tests = [];
        let property = iterator.next();
        while (!property.done) {
            tests.push(property.value);
            property = iterator.next();
        }
        if (!suite.title) {
            globalInfo.tests.common = tests.length;
            globalInfo.executionStartTime = timeService.now();
        }
        printer.print(logLevel, `'${suiteName}' starts for ${tests.length}
            `);
        allureReporter.startSuite(suite.fullTitle());
    }));

    runner.on("suite end", invokeHandler(function () {
        allureReporter.endSuite();
    }));

    runner.on("test", invokeHandler(function(test) {
        if (typeof test.currentRetry !== "function" || !test.currentRetry()) {
            printer.print('IT', `'${test.title}' starts`);
            allureReporter.startCase(test.title);
        }
    }));

    runner.on("pending", invokeHandler(function(test) {
        globalInfo.tests.skipped++;
        printer.print('WARN', `IT: '${test.title}' skipped
                `);
        var currentTest = allureReporter.getCurrentTest();
        if(currentTest && currentTest.name === test.title) {
            allureReporter.endCase("skipped");
        } else {
            allureReporter.pendingCase(test.title);
        }
    }));

    runner.on("pass", invokeHandler(function() {
        printer.print('IT', `Test PASSED
                `);
        allureReporter.endCase("passed");
    }));

    runner.on("fail", invokeHandler(function(test, err) {
        globalInfo.tests.failed++;
        printer.print('ERROR', `IT: '${test.title}' fails with error
                `);
        if(!allureReporter.getCurrentTest()) {
            allureReporter.startCase(test.title);
        }
        var isAssertionError = err.name === "AssertionError" || err.code === "ERR_ASSERTION";
        var status = isAssertionError ? "failed" : "broken";
        // @ts-ignore
        if(global.onError) {
            // @ts-ignore
            global.onError(err);
        }
        allureReporter.endCase(status, err);
    }));

    runner.on("hook end", invokeHandler(function(hook) {
        // printer.print('method', `hook end: ${hook.title}`);
        if(hook.title.indexOf('"after each" hook') === 0) {
            allureReporter.endCase("passed");
        }
    }));
}

function fixMochaReporter() {
    const Mocha = require('mocha');
    Mocha.prototype.reporter = function(reporterName, reporterOptions) {
        this._reporter = AllureReporter;
        this.options.reporterOption = reporterOptions;
        this.options.reporterOptions = reporterOptions;
        return this;
    };
}

export default fixMochaReporter;

