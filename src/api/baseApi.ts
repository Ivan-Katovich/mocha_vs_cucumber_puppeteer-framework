import Axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import printer from '../support/utils/log';
import {ApiOptions as Options} from './apiOptionsInterface';

// declare const globalConfig: any;

export default class BaseAPI {
    protected axios = Axios;

    protected objectsArray = [];
    protected currentObject = null;

    //#region protected

    protected createGetter<T>(Constructor: new(...args: any[]) => T, ...param: any[]): T {
        let obj;
        if (this.currentObject && this.currentObject.constructor === Constructor) {
            obj = this.currentObject;
        } else {
            obj = this.objectsArray.find((obj) => obj.constructor === Constructor);
            this.currentObject = obj;
        }
        if (!obj) {
            obj = new Constructor(...param);
            this.objectsArray.push(obj);
            this.currentObject = obj;
        }
        return obj;
    }

    protected async get(url: string, params: {any} = null, options: Options = {}): Promise<AxiosResponse> {
        const req: AxiosRequestConfig = {
            method: 'GET',
            url,
            params
        };
        try {
            const resp = await this.axios(req);
            printer.print('method', `GET ${url} request is completed with status code ${resp.status}`);
            return resp;
        } catch (error) {
            printer.print('WARN', `GET ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
            return null;
        }
    }

    protected async post(url: string, body: {any}, options: Options = {}): Promise<AxiosResponse> {
        const req: AxiosRequestConfig = {
            method: 'POST',
            url,
            data: body
        };
        try {
            const resp = await this.axios(req);
            printer.print('method', `POST ${url} request is completed with status code ${resp.status}`);
            return resp;
        } catch (error) {
            printer.print('WARN', `POST ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
            return null;
        }
    }

    protected async put(url: string, body: {any}, options: Options = {}): Promise<AxiosResponse> {
        const req: AxiosRequestConfig = {
            method: 'PUT',
            url,
            data: body
        };
        try {
            const resp = await this.axios(req);
            printer.print('method', `PUT ${url} request is completed with status code ${resp.status}`);
            return resp;
        } catch (error) {
            printer.print('WARN', `PUT ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
            return null;
        }
    }

    protected async delete(url: string, options: Options = {}): Promise<AxiosResponse> {
        const req: AxiosRequestConfig = {
            method: 'DELETE',
            url
        };
        try {
            const resp = await this.axios(req);
            printer.print('method', `DELETE ${url} request is completed with status code ${resp.status}`);
            return resp;
        } catch (error) {
            printer.print('WARN', `DELETE ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
            return null;
        }
    }
}
