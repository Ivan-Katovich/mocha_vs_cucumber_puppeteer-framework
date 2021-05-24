import { setWorldConstructor, World } from '@cucumber/cucumber';
import app, {App} from '../../app';

class CustomWorld extends World{
    constructor(options) {
        super(options);
    }
    private _app: App = app;

    public currentObject = null;

    get app(): App {
        return this._app;
    }

    public setCurrentObjectByPath(path: string) {
        let obj = this.app.ui;
        const query = path.split('.');
        for (const ent of query) {
            obj = obj[ent];
        }
        this.currentObject = obj;
    }
}

setWorldConstructor(CustomWorld);
