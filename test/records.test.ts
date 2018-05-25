import request from "supertest";
import app from "../src/app";
const chai = require("chai");
const expect = chai.expect;

const token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFAYS5wbCJ9.ZMq6oOXCFuPcA6Duf7ILa4Aj8qSNIkDH92ixGMi72Ac";

describe("GET /auth/records", () => {
  it("should return 200", async () => {
    await request(app)
      .get("/auth/records")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });
});