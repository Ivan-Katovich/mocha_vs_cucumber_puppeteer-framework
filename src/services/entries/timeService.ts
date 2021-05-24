import moment = require('moment');
import { ServiceOptions as Options } from '../serviceOptionsInterface';
import printer from '../../support/utils/log';

const timeService = {
    name: 'TimeService',

    moment,

    getSeconds(date, options: Options = {}) {
        const offset = options.reduceOffset ? moment().utcOffset() * 60 : 0;
        const seconds = parseInt(moment(date, options.pattern).format('X')) - offset;
        printer.print('method', `Date "${date}" contains ${seconds} seconds ${options.reduceOffset ? ` with offset ${offset} sec` : ''}`);
        return seconds;
    },

    now(options: Options = {}) {
        options.format = options.format || 'x';
        const offset = options.reduceOffset ? moment().utcOffset() * 60 : 0;
        options.number = options.number !== false;
        const _now = parseInt(moment().format(options.format)) - offset;
        // printer.print('method', `Now is: '${_now}' in format '${options.format}'`);
        if (!options.number) return _now.toString();
        return _now;
    },

    nowStr(options: Options = {}) {
        options.format = options.format || 'x';
        options.number = options.number !== false;
        // printer.print('method', `Now is: '${_now}' in format '${options.format}'`);
        return moment().format(options.format);
    },

    timestamp() {
        return moment().format('DD/MM/YY_HH:mm:ss');
    },

    today(format: string) {
        return moment().format(format);
    },

    tomorrow(format: string) {
        return moment().add(1, 'day').format(format);
    },

    yesterday(format: string) {
        return moment().add(-1, 'day').format(format);
    },

    startOfWeek(format: string) {
        return moment().startOf('week').format(format);
    },

    startOfMonth(format: string) {
        return moment().startOf('month').format(format);
    },

    timestampShort() {
        return moment().utc().format('DDMMHHmmss');
    },

    timestampShortWithMilliseconds() {
        return moment().utc().format('DDMMHHmmssSS');
    },

    getDate() {
        return moment().format('MM/DD/YYYY');
    },

    matchDateFormat(dateValue: string, stringDateFormat: string) {
        const result = moment(dateValue, stringDateFormat, true).isValid();
        printer.print('method', `The date value ${result ? 'matches' : 'does not match'} format ${stringDateFormat}.`);
        return result;
    },

    format(value: string, format: string, options: Options = {}): string {
        return moment(value, options.pattern).format(format);
    },

    sleep(timeout = 10000): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, timeout);
        });
    },

    toLocal(dateValue: string, format: string = 'MM/DD/YYYY HH:mm:ss'): string {
        return moment.utc(dateValue).local().format(format);
    },

    wait(callback: () => any, options: any = {}) {
        const start = Date.now();
        const timeout = options.timeout || 10000;
        const interval = options.interval || 200;
        const waitCallback = async () => {
            let state;
            try {
                state = await callback();
            } catch (err) {
                state = false;
            }
            const delta = Date.now() - start;
            if (state) {
                return true;
            } else if (delta > timeout) {
                printer.print('WARN', `Wait fails because of timeout = ${timeout}`);
                return false;
            } else {
                await this.sleep(interval);
                return waitCallback();
            }
        };
        return waitCallback();
    },

    parseDate(dateValue: string, format: string = 'MM/DD/YYYY HH:mm:ss') {
        return moment(dateValue, format, true);
    },

    getTimeItems(period: number) {
        const hours = moment.duration(period).hours();
        const minutes = moment.duration(period).minutes();
        const seconds = moment.duration(period).seconds();
        const fullHours = moment.duration(period).asHours();
        const fullMinutes = moment.duration(period).asMinutes();
        const fullSeconds = moment.duration(period).asSeconds();
        return {
            fullHours,
            fullMinutes,
            fullSeconds,
            time: {
                hours,
                minutes,
                seconds
            }
        };
    }
};

export default timeService;
