import { Kiss, setKissMethod } from "./kiss";
export class Api {

    constructor(public kissServer: Kiss) { }

    @setKissMethod('some-method')
    handler(params) {
        return params + params;
    }

    @setKissMethod(true)
    defaultNameForRegister(params) {
        return params * params;
    }

    start({ port }) {
        this.kissServer.start({ port });
    }
}
