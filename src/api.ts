import { Kiss, setKissMethod } from "./kiss";
export class Api {

    constructor(public kissServer: Kiss) { }

    @setKissMethod('test-api-method')
    myname(params) {
        return params + params;
    }

    start() {
        this.kissServer.start({ port: 9090 });
    }
}
