import * as dotenv from "dotenv";
import {Server} from "./server";
dotenv.config();

const server = new Server(process.env.PORT || 3000);

server.init();