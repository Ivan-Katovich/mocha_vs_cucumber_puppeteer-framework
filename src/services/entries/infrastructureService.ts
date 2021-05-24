import printer from '../../support/utils/log';
import { ServiceOptions as Options } from '../serviceOptionsInterface';
declare const allure: any;

const infrastructureService = {
    name: 'InfrastructureService',

    async step(name, stepFunc, options: Options = {}) {
        if (options.isSkipped) {
            printer.print('WARN', `'${name}' skipped`);
        } else {
            printer.print('step', `'${name}' starts`);
            try {
                await (allure.createStep(name, async () => {
                    await stepFunc();
                }))();
            } catch (err) {
                printer.print('ERROR', `'${name}' finished with error`);
                printer.print('ERROR', err.stack);
                if (err.expected) {
                    printer.print('ERROR', `expected: ${err.expected}`);
                    printer.print('ERROR', `compare: ${err.operator}`);
                    printer.print('ERROR', `actual: ${err.actual}`);
                }
                throw err;
            }
            printer.print('step', `'${name}' successfully finished `);
        }
    },

    async doTill(doCallback, tillCallback, iterations: number = 20) {
        let i: number = 0;
        async function doRecursion() {
            const is = await tillCallback();
            if (is) {
                await doCallback();
                i++;
                if (i < iterations) {
                    await doRecursion();
                }
            }
        }
        await doRecursion();
    },

    clone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
};

export default infrastructureService;
