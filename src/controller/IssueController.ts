import * as express from "express";
import { projectSchema } from "../model/Project";
import { Shield } from "../lib/Shield";
import * as mongoose  from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();


let DB_ADDRESS: string;
switch (process.env.NODE_ENV) {
    case 'test':
        DB_ADDRESS = process.env.DB_ADDRESS_TEST;
        break;
    case 'production':
        DB_ADDRESS = process.env.DB_ADDRESS_PROD;
        break;
    case 'development':
        DB_ADDRESS = process.env.DB_ADDRESS_DEV;
        break;
    default:
        DB_ADDRESS = process.env.DB_ADDRESS_DEV;
}

mongoose.connect(DB_ADDRESS, {useNewUrlParser: true});

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
            const shield = new Shield();
            const input = shield.sanitizeInput(req.body);

            project.issues.push(input);
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
        Project.findOne({
            project_name: req.params.projectname,
        })
            .then((project: any) => {
                if (!project) return res.json({message: "unknown project"});
                /**
                 * Filter the result issues based on queries
                 */
                const issues = project.issues.filter((issue: any) => {
                    return (req.query.created_by ? issue.created_by === req.query.created_by : true) &&
                        (req.query.issue_title ? issue.issue_title === req.query.issue_title : true) &&
                        (req.query.issue_text ? issue.issue_text === req.query.issue_text : true) &&
                        (req.query.assigned_to ? issue.assigned_to === req.query.assigned_to : true) &&
                        (req.query.status_text ? issue.status_text === req.query.status_text : true) &&
                        (req.query.open ? String(issue.open) == req.query.open.toLowerCase() : true) &&
                        (req.query.created_on ? new Date(issue.created_on).valueOf() == new Date(req.query.created_on).valueOf() : true) &&
                        (req.query.updated_on ? new Date(issue.updated_on).valueOf() == new Date(req.query.updated_on).valueOf() : true);
                });
                return res.json({issues});
        })
    }

    public static update(req: express.Request, res: express.Response) {
        /*
        * Handle missing _id
        * */
        if (!req.body._id) return res.json({message: "could not update"});

        /*
        * Handle invalid _id
        * */
        try {
            const _id = new mongoose.Types.ObjectId(req.body._id);

            /*
            * Find the given project
            * */
            Project.findOne({
                    project_name: req.params.projectname,
                    "issues._id": _id
                }, (err, project: any) => {
                    if (err) return res.json({message: `could not update ${req.body._id}`});
                    if (!project) return res.json({message: `could not update ${req.body._id}`});

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
                            message: "no updated field sent"
                        })
                    }

                    const issue = project.issues.id(_id);
                    const {issue_title,
                        issue_text,
                        created_by,
                        assigned_to,
                        status_text,
                        open} = req.body;
                    const shield = new Shield();

                    if (issue_title) issue.issue_title = shield.sanitizer(issue_title);
                    if (issue_text) issue.issue_text = shield.sanitizer(issue_text);
                    if (created_by) issue.created_by = shield.sanitizer(created_by);
                    if (assigned_to) issue.assigned_to = shield.sanitizer(assigned_to);
                    if (status_text) issue.status_text = shield.sanitizer(status_text);
                    if (open) issue.open = shield.sanitizer(open);
                    issue.updated_on = new Date().toJSON();


                    project.save((err: any) => {
                        if (err) return res.json({message: `could not update ${req.body._id}`});
                        return res.json({
                            message: "successfully updated",
                            issue
                        });
                    });
            });
        } catch (error) {
            return res.json({message: "could not update"});
        }
    }

    public static destroy(req: express.Request, res: express.Response) {
        /*
        * Handle missing _id
        * */
        if (!req.body._id) return res.json({message: "_id error"});

        /*
        * Handle invalid _id*/
        try {
            const _id = new mongoose.Types.ObjectId(req.body._id);

            Project.findOne({
                project_name: req.params.projectname,
                "issues._id": _id
            }, (err, project: any) => {
                /*
                * Handle unexisting issue._id
                * */
                if (err || !project) return res.json({message: `could not delete ${req.body._id}`});

                /*
                * Delete issue
                * Filter every issue which's _id is not the given _id
                * */
                project.issues = project.issues.filter((issue: any) => issue._id !== _id );

                project.save((err: any) => {
                   if (err) return res.json({message: `could not update ${_id}`});
                   res.json({message: `deleted ${_id}`});
                });
            });
        } catch (err) {
            res.json({message: `could not delete ${req.body._id}`});
        }
    }
}