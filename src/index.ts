import * as dotenv from "dotenv";
import {Server} from "./server";

dotenv.config();

const server = new Server(process.env.PORT || 3000);

try {
    server.init();
} catch (e) {
    console.log("Server fault: " + e.message);
}
