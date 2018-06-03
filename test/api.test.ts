import chai, { expect, assert } from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const { request } = chai;

import app from "../src/app";

describe("GET /ping", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/ping");
    expect(res).to.have.status(200);
    // expect(true).to.be.false;
  });
});
