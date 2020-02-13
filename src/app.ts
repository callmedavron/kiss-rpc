import { Api } from './api';
import { Kiss } from './kiss';
const app = new Api(new Kiss());
app.start({port: 9090})