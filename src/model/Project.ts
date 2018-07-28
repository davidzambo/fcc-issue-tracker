import { Schema } from "mongoose";
import { issueSchema } from "./Issue";

export const projectSchema: Schema = new Schema({
    project_name: {type: String, required: "Please enter a project name"},
    issues: [issueSchema]
});