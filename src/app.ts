import Ui from './ui/ui';
import {expect} from 'chai';
import services from './services/services';
import printer from './support/utils/log';

declare const globalInfo: any;

export class App {
    public name = 'App';

    public expect = expect;

    // Application parts
    public ui = new Ui();
    public services = services;

    // Helpers
    public step = this.services.infra.step;

    public writeResults() {
        globalInfo.executionEndTime = this.services.time.now();
        globalInfo.executionDuration = globalInfo.executionEndTime - globalInfo.executionStartTime;
        const time = this.services.time.getTimeItems(globalInfo.executionDuration).time;
        printer.print('WARN', `TASK ENDS
            suite: ${globalInfo.suite}
            total: ${globalInfo.tests.common}
            passed: ${globalInfo.tests.common - globalInfo.tests.failed - globalInfo.tests.skipped}
            skipped: ${globalInfo.tests.skipped}
            failed: ${globalInfo.tests.failed}
            duration: ${time.hours}h ${time.minutes}m ${time.seconds}s
            `);
    }
}

const app = new App();

export default app;
