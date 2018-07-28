import * as express from "express";
import { projectSchema } from "../model/Project";
import * as mongoose  from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.DB_ADDRESS, {useNewUrlParser: true});

const Project = mongoose.model("Project", projectSchema);

export class IssueController {
    public static index(req: express.Request, res: express.Response) {
        return res.render("index");
    }

    public static create(req: express.Request, res: express.Response) {
        Project.findOne({project_name: req.params.projectname},
            (err: any, project: any) => {
            if (err) return console.error(err);
            if (!project) return res.json({
                message: "Unknown project!"
            });
            project.issues.push(req.body);
            project.save((error: any) => {
                if (error) {
                    let errors: any = [];
                    Object.keys(error.errors).forEach((key) => {
                        errors.push(error.errors[key].message);
                    });
                    return res.json({error: errors});
                }
                /*
                * Send back the last inserted issue
                */
                return res.json(project.issues[project.issues.length - 1]);
            });
        });
    }

    public static read(req: express.Request, res: express.Response) {
        res.json({
            message: "ok"
        });
    }

    public static update(req: express.Request, res: express.Response) {

    }

    public static destroy(req: express.Request, res: express.Response) {

    }
}