import {ElementHandle, Page} from 'puppeteer';
import {Selector} from './selectorInterface';
import {UiOptions as Options} from './uiOptionsInterface';
import printer from '../support/utils/log';
import timeService from '../services/entries/timeService';


export default class BaseObject {
    public name: string;
    protected page: Page;
    protected container: Selector;

    protected objectsArray: Array<BaseObject> = [];
    protected currentObject = null;
    protected elementStorage = {};

    protected createGetter<T>(Constructor: new(...args: any[]) => T, ...params: any[]): T {
        let obj;
        if (this.currentObject && this.currentObject.constructor === Constructor) {
            obj = this.currentObject;
        } else {
            obj = this.objectsArray.find((obj) => obj.constructor === Constructor);
            this.currentObject = obj;
        }
        if (!obj) {
            obj = new Constructor(...params);
            this.objectsArray.push(obj);
            this.currentObject = obj;
        }
        return obj;
    }

    // Internal methods
    private getSelector(element: string | Selector = this.container, textOrPosition?: string | number, options: Options = {}): Selector {
        let selector: Selector;
        if (typeof element === 'string') {
            selector = this[element];
            if (!selector) {
                throw new Error(`Wrong selector name: '${element}' in '${this.name}'`);
            }
            selector.name = element;
        } else {
            selector = element;
        }
        if (typeof textOrPosition === 'string') {
            selector.text = textOrPosition;
        } else if (typeof textOrPosition === 'number') {
            selector.position = textOrPosition;
        }
        selector.options = {...selector.options, ...options};
        if (!selector.container && selector.css !== this.container.css) selector.container = this.container;
        if (!selector.name) selector.name = 'incognitoElement';
        return selector;
    }

    private createSelectorsQueue(selector: Selector): Array<Selector> {
        const queue: Array<Selector> = [selector];
        let parent: Selector = selector.container;
        while (parent) {
            queue.push(parent);
            parent = parent.container;
        }
        return queue.reverse();
    }

    private async getElement(element?: string | Selector, textOrPosition?: string | number, options: Options = {}): Promise<{eh: ElementHandle, selector: Selector}> {
        const selector = this.getSelector(element, textOrPosition, options);
        const selectorSignature = selector.name + selector.css + selector.text + selector.position;
        let elementHandle: ElementHandle;
        if (!this.elementStorage[selectorSignature]) {
            const queue = this.createSelectorsQueue(selector);
            elementHandle = (await this.page.$$('body'))[0];
            for (const selector of queue) {
                if (!selector.position && !selector.text) {
                    elementHandle = await elementHandle.$(selector.css);
                } else if (selector.position && !selector.text) {
                    elementHandle = (await elementHandle.$$(selector.css))[selector.position];
                } else if (selector.text && !selector.position) {
                    const elementHandles = await elementHandle.$$(selector.css);
                    for (const element of elementHandles) {
                        const text = await element.evaluate((node) => node.innerText);
                        if (selector.options.exactText) {
                            if (text === selector.text) {
                                elementHandle = element;
                                break;
                            }
                        } else {
                            if (text.includes(selector.text)) {
                                elementHandle = element;
                                break;
                            }
                        }
                    }
                } else {
                    printer.print('WARN', 'Selector contains both Text and Position');
                    throw new Error('Selector contains both Text and Position');
                }
                if (!elementHandle) {
                    throw new Error(`Something wrong with selector: ${selector}`);
                }
            }
            this.elementStorage[selectorSignature] = elementHandle;
        } else {
            elementHandle = this.elementStorage[selectorSignature];
        }
        return {eh: elementHandle, selector};
    }

    // Public methods
    public cleanElementStorage(): Array<BaseObject> {
        this.elementStorage = {};
        return this.objectsArray;
    }

    // Element interactions
    public async click(element?: string | Selector, textOrPosition?: string | number, options: Options = {}): Promise<void> {
        const target = await this.getElement(element, textOrPosition, options);
        const s = target.selector;
        printer.print('method',
            `Click on '${s.name}'${s.text ? ` with text: '${s.text}'` : ''}${s.position ? ` position: '${s.position}'` : ''}`
        );
        await target.eh.click();
    }

    public async hover(element?: string | Selector, textOrPosition?: string | number, options: Options = {}): Promise<void> {
        const target = await this.getElement(element, textOrPosition, options);
        const s = target.selector;
        printer.print('method',
            `Click on '${s.name}'${s.text ? ` with text: '${s.text}'` : ''}${s.position ? ` position: '${s.position}'` : ''}`
        );
        await target.eh.hover();
    }

    public async type(element: string | Selector, value: string, options: Options = {}): Promise<void> {
        options.replace = options.replace === undefined ? true : options.replace;
        const target = await this.getElement(element, null, options);
        if (target.selector.options.replace) {
            await target.eh.evaluate((el) => el.value = '');
        }
        printer.print('method', `Type '${value}' into '${target.selector.name}'`);
        await target.eh.type(value);
    }

    public async isVisible(element?: string | Selector, textOrPosition?: string | number, options: Options = {}): Promise<boolean> {
        const target = await this.getElement(element, textOrPosition, options);
        const box = await target.eh.boundingBox();
        const s = target.selector;
        printer.print('method',
            `'${s.name}'${s.text ? ` with text: '${s.text}'` : ''}${s.position ? ` position: '${s.position}'` : ''} is ${!!box ? 'visible' : 'invisible'}`
        );
        return !!box;
    }

    public async waitTillElementVisible(element?: string | Selector, textOrPosition?: string | number, options: Options = {}): Promise<boolean> {
        const target = await this.getElement(element, textOrPosition, options);
        const visibility = await timeService.wait(async () => {
            return await target.eh.boundingBox();
        }, target.selector.options);
        const s = target.selector;
        printer.print('method',
            `'${s.name}'${s.text ? ` with text: '${s.text}'` : ''}${s.position ? ` position: '${s.position}'` : ''} ${visibility ? 'become visible' : 'is still invisible'}`
        );
        return visibility;
    }

}
