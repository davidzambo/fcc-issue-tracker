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
        /*
        * Find the given project
        * */
        Project.findOne({project_name: req.params.projectname},
            (err: any, project: any) => {
            if (err) return console.error(err);

            /*
            * Handle "no project" case
            * */
            if (!project) return res.json({
                message: "Unknown project!"
            });


            project.issues.push(req.body);
            project.save((error: any) => {
                if (error) {
                    let errors: any = [];
                    /*
                    * Fetch all error messages and return it to the user
                    */
                    Object.keys(error.errors).forEach((key) => {
                        errors.push(error.errors[key].message);
                    });
                    return res.json({error: errors});
                }
                /*
                * Send back the last inserted issue
                */
                return res.json({issue: project.issues[project.issues.length - 1]});
            });
        });
    }

    public static read(req: express.Request, res: express.Response) {
        res.json({
            message: "ok"
        });
    }

    public static update(req: express.Request, res: express.Response) {
        try {
            /*
            * Check validation of given _id
            * */
            const _id = new mongoose.Types.ObjectId(req.body._id);
            /*
            * Check new data if they have any values
            * */
            let hasSomethingToUpdate = false;
            for (let key in req.body) {
                if (key !== "_id" && req.body[key] !== "") {
                    hasSomethingToUpdate = true;
                    break;
                }
            }

            if (!hasSomethingToUpdate) {
                return res.json({
                    message: "No updated field sent!"
                })
            }
            /*
            * Find the given project
            * */
            Project.findOneAndUpdate({
                    project_name: req.params.projectname,
                    "issues._id": _id
                },
                {"$set": {
                        "issues.$": req.body
                    }}, (err: any, project: any) => {
                    if (err) return res.json({
                        message: "Something went wrong!",
                        error: err
                    });

                    /*
                    * Handle "no project" case
                    * */
                    if (!project) return res.json({
                        message: "Unknown project!"
                    });

                });
        } catch (error) {
            return res.json({
                message: "Whoops! Something went wrong!",
                error: error.message
            })
        }

    }

    public static destroy(req: express.Request, res: express.Response) {

    }
}