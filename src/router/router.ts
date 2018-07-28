import {Application, Request, Response} from "express";
import { IssueController } from "../controller/IssueController";

export class Router {
    public static initializePaths(app: Application) {
        app.all("/", IssueController.index);
        app.get("/api/issues/:projectname", IssueController.read);
        app.post("/api/issues/:projectname", IssueController.create);
        app.put("/api/issues/:projectname", IssueController.update);
        app.delete("/api/issues/:projectname", IssueController.destroy);
        // app.all("*", (req: express.Request, res: express.Response) => {
        //    res.redirect("/");
        // });
    }
}