import { Schema } from "mongoose";

export const issueSchema: Schema = new Schema({
    issue_title: {type: String, required: "Enter an issue title!"},
    issue_text: {type: String, required: "Enter an issue text!"},
    created_by: {type: String, required: "Please add the issue creator!"},
    assigned_to: {type: String, default: ""},
    status_text: {type: String, default: ""},
    created_on: {type: Date, default: Date.now},
    updated_on: {type: Date, default: Date.now},
    open: {type: Boolean, default: true}
});