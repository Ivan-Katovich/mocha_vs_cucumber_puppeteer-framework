import winston from 'winston';
import moment from 'moment';
const now = moment().format('YYYY-MM-DD_HH-mm-ss');
const { combine, timestamp, label, printf, colorize } = winston.format;
declare const globalConfig: any;

class Printer {

    private _logger;

    private logLevels = {
        levels: {
            ERROR: 0,
            WARN: 1,
            DESCRIBE: 2,
            IT: 3,
            step: 4,
            method: 5
        },
        colors: {
            ERROR: 'red',
            WARN: 'magenta',
            DESCRIBE: 'cyan',
            IT: 'blue',
            step: 'yellow',
            method: 'gray'
        }
    };

    private myFormat = printf((info) => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    });

    private colorized = combine(
        colorize({all: true}),
        label({ label: 'right meow!' }),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        this.myFormat
    );

    private monochrome = combine(
        label({ label: 'right meow!' }),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        this.myFormat
    );

    private setTransports() {
        const transports = {
            file: new winston.transports.File({
                filename: `reports/logs/winston-basic_${now}.log`,
                level: 'method',
                format: this.monochrome
            }),
            console: new winston.transports.Console({
                level: 'method',
                format: process.env.npm_config_monochrome === 'true' ? this.monochrome : this.colorized
            })
        };
        const _transports = [];
        if (globalConfig.log === 'all') {
            _transports.push(transports.file);
            _transports.push(transports.console);
        } else if (globalConfig.log === 'console') {
            _transports.push(transports.console);
        } else if (globalConfig.log === 'file') {
            _transports.push(transports.file);
        }
        return _transports;
    }

    get logger() {
        if (!this._logger) {
            winston.addColors(this.logLevels.colors);
            this._logger = winston.createLogger({
                levels: this.logLevels.levels,
                transports: this.setTransports()
            });
        }
        return this._logger;
    }

    public print(...args) {
        this.logger.log(...args);
    }

}

export default new Printer();
