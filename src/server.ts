import * as bodyParser from "body-parser";
import * as express from "express";
import * as helmet from "helmet";
import * as moment from "moment";
import { Router } from "./router/router";

interface ServerInterface {
    PORT: string | number;
    app: express.Application;
}

export class Server implements ServerInterface {
    public app: express.Application;
    public PORT: string | number;

    public constructor(port: string | number) {
        this.PORT = port;
        this.app = express();
    }

    public init() {
        this.app.set("views", "./views");
        this.app.set("view engine", "pug");
        this.app.use(express.static("./public"));
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true}));
        this.app.use(helmet());
        this.app.use(helmet.hidePoweredBy({setTo: "PHP 5.4"}));
        this.app.locals.moment = moment;

        Router.initializePaths(this.app);

        this.app.listen(this.PORT, () => {
            //tslint:disable-next-line
            console.log(`Server is up and running on port ${this.PORT}.`);
        })
    }
}