import {UiOptions as Options} from './uiOptionsInterface';

export interface Selector {
    name?: string;
    css: string;
    container?: Selector;
    multi?: boolean;
    text?: string;
    position?: number;
    options?: Options;
}
