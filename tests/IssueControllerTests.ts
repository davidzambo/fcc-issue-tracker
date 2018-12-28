process.env.NODE_ENV = "test";

import * as chai from "chai";
import "mocha";
import * as mongoose from "mongoose";
import { Server } from "../src/server";
import { projectSchema } from "../src/model/Project";

chai.use(require("chai-http"));
const expect = chai.expect;
const assert = chai.assert;

mongoose.connect(process.env.DB_ADDRESS_TEST, {useNewUrlParser: true}, err => {
    if (err) {
        console.log(`DB CONNECTION ERROR: ${err}`);
    }
    console.log(`Connected to ${process.env.DB_ADDRESS_TEST}`);
});

const Project = mongoose.model("Project", projectSchema);

describe("IssueController test", () => {
    beforeEach((done) => {
        /*
        * Initialize test issues
        * */
        Project.findOne({project_name: "apitest"}, (err: any, project: any) => {
            project.issues = [];
            const issue1 = {
                created_by: "INIT test 1",
                issue_title: "INIT test 1",
                issue_text: "INIT test 1",
                assigned_to: "anybody",
                created_on: new Date("2018-08-01T11:31:20").toISOString(),
                updated_on: new Date("2018-08-01T11:31:20").toISOString(),
                status_text: "in progress",
                open: false,
            };
            const issue2 = {
                created_by: "INIT test 2",
                issue_title: "INIT test 2",
                issue_text: "INIT test 2",
                assigned_to: "anybody",
                created_on: new Date("2018-03-01T11:31:20").toISOString(),
                updated_on: new Date("2018-03-01T11:31:20").toISOString(),
                status_text: "done",
                open: false,
            };
            const issue3 = {
                created_by: "INIT test 3",
                issue_title: "INIT test 3",
                issue_text: "INIT test 3",
            };
            project.issues.push(issue1, issue2, issue3);
            project.save((err: any) => {
                if (err) console.log(err);
                done();
            });
        });
    });

    const server = new Server(4000);
    server.init();


    describe("POST /api/issues/", () => {
        describe(":projectname = willFindNoProject", () => {
            it("should not found any projects", (done: any) => {
                chai.request(server.app)
                    .post("/api/issues/willFindNoProject")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "Unknown project!");
                        done();
                    });
            });
        });

        describe(":projectname = apitest", () => {
            it("fails to save on empty input data", (done: any) => {
                chai.request(server.app)
                    .post("/api/issues/apitest")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("error");
                        expect(res.body.error).to.be.an("array");
                        expect(res.body.error).to.have.length(3);
                        done();
                    });
            });

            it("fails to save on only issue_title data", (done: any) => {
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
                        done();
                    });
            });

            it("fails to save on only issue_text data", (done: any) => {
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
                        done();
                    });
            });

            it("fails to save on only created_by data", (done: any) => {
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
                        done();
                    });
            });

            it("store new issue and return it", (done: any) => {
                chai.request(server.app)
                    .post("/api/issues/apitest")
                    .send({
                        created_by: "POST test",
                        issue_title: "POST test",
                        issue_text: "POST test"
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
                        done();
                    });
            });
        });
    });

    describe("GET /api/issues/", () => {
        describe(":projectname = willFindNoProject", () => {
            it("should not found any projects", (done: any) => {
                chai.request(server.app)
                    .get("/api/issues/willFindNoProject")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "unknown project");
                        done();
                    });
            });
        });

        describe(":projectname = apitest", () => {
            it("will list all issues related to 'apitest' project", (done: any) => {
                chai.request(server.app)
                    .get("/api/issues/apitest")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("issues");
                        expect(res.body.issues).to.be.an("array");
                        expect(res.body.issues).to.have.length(3);
                        done();
                    });
            });

            it("will returns a json", (done: any) => {
                chai.request(server.app)
                    .get("/api/issues/apitest?")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("issues");
                        expect(res.body.issues).to.be.an("array");
                        expect(res.body.issues).to.have.length(3);
                        done();
                    });
            });

            it("will returns a json", (done: any) => {
                chai.request(server.app)
                    .get("/api/issues/apitest?response_type=render")
                    .end((err: any, res: any) => {
                        expect(res).to.be.html;
                        console.log(res);
                        done();
                    });
            });

            it("will list 2 issues with open=false", (done: any) => {
                chai.request(server.app)
                    .get("/api/issues/apitest?open=false")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("issues");
                        expect(res.body.issues).to.be.an("array");
                        expect(res.body.issues).to.have.length(2);
                        done();
                    });
            });

            it("will list 2 issues with assigned_to=anybody", (done: any) => {
                chai.request(server.app)
                    .get("/api/issues/apitest?assigned_to=anybody")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("issues");
                        expect(res.body.issues).to.be.an("array");
                        expect(res.body.issues).to.have.length(2);
                        done();
                    });
            });

            it("will list 1 issue with issue_title=INIT test 1", (done: any) => {
                chai.request(server.app)
                    .get("/api/issues/apitest?created_by=INIT test 1")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("issues");
                        expect(res.body.issues).to.be.an("array");
                        expect(res.body.issues).to.have.length(1);
                        done();
                    });
            });

            it("will list 1 issue with issue_text=INIT test 1", (done: any) => {
                chai.request(server.app)
                    .get("/api/issues/apitest?issue_text=INIT test 1")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("issues");
                        expect(res.body.issues).to.be.an("array");
                        expect(res.body.issues).to.have.length(1);
                        done();
                    });
            });

            it("will list 1 issue with status_text=done", (done: any) => {
                chai.request(server.app)
                    .get("/api/issues/apitest?status_text=done")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("issues");
                        expect(res.body.issues).to.be.an("array");
                        expect(res.body.issues).to.have.length(1);
                        done();
                    });
            });

            it("will list 1 issue with ?status_text=in progress&created_by=INIT test 1&issue_title=INIT test 1&issue_text=INIT test 1&assigned_to=anybody&open=false&created_on=2018-08-01T11:31:20&updated_at=2018-08-01T11:31:20", (done: any) => {
                chai.request(server.app)
                    .get("/api/issues/apitest?status_text=in progress&created_by=INIT test 1&issue_title=INIT test 1&issue_text=INIT test 1&assigned_to=anybody&open=false&created_on=2018-08-01T11:31:20&updated_at=2018-08-01T11:31:20")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("issues");
                        expect(res.body.issues).to.be.an("array");
                        expect(res.body.issues).to.have.length(1);
                        done();
                    });
            });

        });
    });

    describe("PUT /api/issues", () => {
        describe(":projectname = willFindNoProject", () => {
            it("should return could not update", (done: any) => {
                chai.request(server.app)
                    .put("/api/issues/willFindNoProject")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "could not update");
                        done();
                    });
            });
        });

        describe(":projectname = apitest", () => {
            it("fails to save on empty _id", (done: any) => {
                chai.request(server.app)
                    .put("/api/issues/apitest")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "could not update");
                        done();
                    });
            });

            it("fails to save on invalid _id", (done: any) => {
                chai.request(server.app)
                    .put("/api/issues/apitest")
                    .send({
                        _id: "1234"
                    })
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "could not update");
                        done();
                    });
            });

            it("finds issue with given _id, but do not update because of missing new datas", (done: any) => {
                Project.findOne({project_name: "apitest"}, (err: any, project: any) => {
                    const _id = project.issues[0]._id;
                    chai.request(server.app)
                        .put("/api/issues/apitest")
                        .send({_id})
                        .end((err: any, res: any) => {
                            expect(res).to.be.json;
                            expect(res.body).to.have.property("message");
                            assert.equal(res.body.message, "no updated field sent");
                            done();
                        });

                })
            });

            it("store new issue and return it", (done: any) => {
                Project.findOne({project_name: "apitest"}, (err: any, project: any) => {
                    const _id = project.issues[0]._id;
                    chai.request(server.app)
                        .put("/api/issues/apitest")
                        .send({
                            _id,
                            created_by: "PUT test",
                            issue_title: "PUT test",
                            issue_text: "PUT test"
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
                            assert.equal(res.body.message, "successfully updated");
                            done();
                        });
                });
            });
        });
    });


    describe("DELETE /api/issues", () => {
        describe(":projectname = willFindNoProject", () => {
            it("should return could not delete", (done: any) => {
                chai.request(server.app)
                    .del("/api/issues/willFindNoProject")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "_id error");
                        done();
                    });
            });
        });

        describe(":projectname = apitest", () => {
            it("fails to delete on empty _id", (done: any) => {
                chai.request(server.app)
                    .del("/api/issues/apitest")
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, "_id error");
                        done();
                    });
            });

            it("fails to delete on invalid _id", (done: any) => {
                const _id = "1234";
                chai.request(server.app)
                    .del("/api/issues/apitest")
                    .send({_id})
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, `could not delete ${_id}`);
                        done();
                    });
            });

            it("fails to delete on unexisting _id", (done: any) => {
                const _id = "5b5d885b735b40504b17ae51";
                chai.request(server.app)
                    .del("/api/issues/apitest")
                    .send({_id})
                    .end((err: any, res: any) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property("message");
                        assert.equal(res.body.message, `could not delete ${_id}`);
                        done();
                    });
            });

            it("delete issue with given _id", (done: any) => {
                Project.findOne({project_name: "apitest"}, (err: any, project: any) => {
                    const newIssue = {
                        created_by: "DELETE test",
                        issue_title: "DELETE test",
                        issue_text: "DELETE test"
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
                                done();
                            });
                    });
                })
            });
        });
    });
});