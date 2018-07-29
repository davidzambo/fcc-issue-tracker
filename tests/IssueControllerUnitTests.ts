import * as chai from "chai";
import "mocha";
import { Server } from "../src/server";

chai.use(require("chai-http"));
const expect = chai.expect;
const assert = chai.assert;

describe("IssueController test", () => {
    const server = new Server(4000);
    server.init();

    describe("POST /api/issues/", () => {
        describe(":projectname = willFindNoProject", () => {
            it("should not found any projects", () => {
                chai.request(server.app)
                    .post("/api/issues/willFindNoProject")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "Unknown project!");
                    });
            });
        });

        describe(":projectname = apitest", () => {
            it("fails to save on empty input data", () => {
                chai.request(server.app)
                    .post("/api/issues/apitest")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("error");
                        expect(res.body.error).to.be.an("array");
                        expect(res.body.error).to.have.length(3);
                    });
            });

            it("fails to save on only issue_title data", () => {
                chai.request(server.app)
                    .post("/api/issues/apitest")
                    .send({
                        issue_title: "test"
                    })
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("error");
                        expect(res.body.error).to.be.an("array");
                        expect(res.body.error).to.have.length(2);
                    });
            });

            it("fails to save on only issue_text data", () => {
                chai.request(server.app)
                    .post("/api/issues/apitest")
                    .send({
                        issue_text: "test"
                    })
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("error");
                        expect(res.body.error).to.be.an("array");
                        expect(res.body.error).to.have.length(2);
                    });
            });

            it("fails to save on only created_by data", () => {
                chai.request(server.app)
                    .post("/api/issues/apitest")
                    .send({
                        created_by: "test"
                    })
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("error");
                        expect(res.body.error).to.be.an("array");
                        expect(res.body.error).to.have.length(2);
                    });
            });

            it("store new issue and return it", () => {
                chai.request(server.app)
                    .post("/api/issues/apitest")
                    .send({
                        created_by: "test",
                        issue_title: "test",
                        issue_text: "test"
                    })
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("issue");
                        expect(res.body.issue).to.be.an("object");
                        expect(res.body.issue).to.have.all.keys([
                            "_id",
                            "issue_title",
                            "issue_text",
                            "created_by",
                            "assigned_to",
                            "status_text",
                            "created_on",
                            "updated_on",
                            "opn"
                        ]);
                    });
            });
        });


    });

    describe("Read test", () => {

    });

    describe("Update test", () => {

    });

    describe("Destroy test", () => {

    });
});