import request from "supertest";
import app from "../src/app";

describe("GET /ping", () => {
  it("should return 200 OK", () => {
    return request(app).get("/ping")
      .expect(200);
  });
});
