process.env.NODE_ENV = "test";

import * as chai from "chai";
import "mocha";
import * as mongoose from "mongoose";
import { Server } from "../src/server";
import { projectSchema } from "../src/model/Project";

chai.use(require("chai-http"));
const expect = chai.expect;
const assert = chai.assert;

mongoose.connect(process.env.DB_ADDRESS, {useNewUrlParser: true});

const Project = mongoose.model("Project", projectSchema);

describe("IssueController test", () => {
    before((done) => {
        /*
        * Empty issues
        * */
        Project.findOne({project_name: "apitest"}, (err: any, project: any) => {
            project.issues = [];
            project.save((err: any) => {
                done();
            });
        });

    });

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
                            "open"
                        ]);
                    });
            });
        });
    });

    describe("Read test", () => {

    });

    describe("PUT /api/issues", () => {
        describe(":projectname = willFindNoProject", () => {
            it("should return could not update", () => {
                chai.request(server.app)
                    .put("/api/issues/willFindNoProject")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "could not update");
                    });
            });
        });

        describe(":projectname = apitest", () => {
            it("fails to save on empty _id", () => {
                chai.request(server.app)
                    .put("/api/issues/apitest")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "could not update");
                    });
            });

            it("fails to save on invalid _id", () => {
                chai.request(server.app)
                    .put("/api/issues/apitest")
                    .send({
                        _id: "1234"
                    })
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "could not update");
                    });
            });

            it("finds issue with given _id, but do not update because of missing new datas", () => {
               chai.request(server.app)
                   .put("/api/issues/apitest")
                   .send({_id: "5b5d885b735b40504b17ae5c"})
                   .end((err: any, res: any) => {
                      expect(res).to.be.json;
                      expect(res.body).to.have.property("message");
                      assert.equal(res.body.message, "no updated field sent");
                   });
            });

            it("store new issue and return it", () => {
                chai.request(server.app)
                    .put("/api/issues/apitest")
                    .send({
                        _id: "5b5d885b735b40504b17ae5c",
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
                            "open"
                        ]);
                        assert.equal(res.body.message, "sucessfully updated");
                    });
            });
        });
    });


    describe("DELETE /api/issues", () => {
        describe(":projectname = willFindNoProject", () => {
            it("should return could not delete", () => {
                chai.request(server.app)
                    .del("/api/issues/willFindNoProject")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "_id error");
                    });
            });
        });

        describe(":projectname = apitest", () => {
            it("fails to delete on empty _id", () => {
                chai.request(server.app)
                    .del("/api/issues/apitest")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "_id error");
                    });
            });

            it("fails to delete on invalid _id", () => {
                const _id = "1234";
                chai.request(server.app)
                    .del("/api/issues/apitest")
                    .send({_id})
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, `could not delete ${_id}`);
                    });
            });

            it("fails to delete on unexisting _id", () => {
                const _id = "5b5d885b735b40504b17ae51";
                chai.request(server.app)
                    .del("/api/issues/apitest")
                    .send({_id})
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, `could not delete ${_id}`);
                    });
            });

            it("delete issue with given _id", () => {
                Project.findOne({project_name: "apitest"}, (err: any, project: any) => {
                    const newIssue = {
                        created_by: "test",
                        issue_title: "test",
                        issue_text: "test"
                    };
                    project.issues.push(newIssue);
                    project.save((err: any, project: any) => {
                        const _id = project.issues[project.issues.length-1]._id;
                        chai.request(server.app)
                            .del("/api/issues/apitest")
                            .send({_id})
                            .end((err: any, res: any) => {
                                expect(res).to.be.json;
                                expect(res.body).to.have.property("message");
                                assert.equal(res.body.message, `deleted ${_id}`);
                            });
                    });
                })
            });
        });
    });
});