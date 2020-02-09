import * as Http from 'http';
const methods: Object = {};
export class Kiss {
    payloadErrors: Object = {
        METHOD_NOT_EXIST: '__method_not_exist__',
        INVALID_PAYLOAD : '__invalid_payload__',
        POST_REQUIRED   : '__post_method_required__',
    };

    constructor() {

    }

    handleRequest<T>(request: Http.IncomingMessage): Promise<T> {
        return new Promise((resolve, reject) => {

            const chunks = [];

            // We handle onle `POST` method
            if (request.method !== 'POST') {
                return reject(this.payloadErrors['POST_REQUIRED']);
            }

            request.on('data', (chunk) => {
                chunks.push(chunk);
            });

            request.on('end', () => {
                const concatedChunks = Buffer.concat(chunks).toString();

                if (!this.jsonIsValid(concatedChunks)) {
                    return reject(this.payloadErrors['INVALID_PAYLOAD']);
                }

                const jsonFromChunks = this.string2json(concatedChunks);

                if (!this.validateRpcProperties(jsonFromChunks)) {
                    return reject(this.payloadErrors['METHOD_NOT_EXIST']);
                }

                const { method, params } = jsonFromChunks;

                return resolve(methods[method](params))
            });
        })
    }

    start({ port }) {
        Http.createServer(async (request: Http.IncomingMessage, response: Http.ServerResponse) => {
            try {
                const result = await this.handleRequest(request);
                response.statusCode = 200;
                response.end(this.toSuccessResult(result));
            } catch (e) {
                response.statusCode = 200;
                response.end(this.toErrorResult(e));
            }
        }).listen(port)
    }

    registerMethod(route: any, fn: Function) {
        Object.assign(methods, { [route]: fn });
    }

    json2string(payload: Object) {
        return JSON.stringify(payload)
    };

    string2json(payload: string) {
        return JSON.parse(payload)
    };

    jsonIsValid(payload: string) {
        try {
            this.string2json(payload);
        } catch (e) {
            return false;
        }
        return true;
    }

    toSuccessResult(payload: any) {
        return this.json2string({ result: payload, success: true });
    }

    toErrorResult(payload) {
        return this.json2string({ result: payload, success: false });
    }

    validateRpcProperties(payload: Object) {
        return payload.hasOwnProperty('method') && methods.hasOwnProperty(payload['method'])
    }
}

export const setKissMethod = (route) => {
    return function (target: Object, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
        const method = propertyDesciptor.value;
        if (typeof route === 'boolean' && route) {
            Object.assign(methods, { [propertyName]: method });
        } else {
            Object.assign(methods, { [route]: method });
        }
        return propertyDesciptor;
    }
}