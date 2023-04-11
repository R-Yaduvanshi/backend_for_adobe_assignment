const chai = require("chai");
const chaiHTTP = require("chai-http");
const expect = chai.expect;

chai.use(chaiHTTP);

// Assertion

describe("users API", () => {
  const baseURL = "http://localhost:7000";

  // <========================== Test for POST request to create a new user <========================>

  describe("POST /users", () => {
    it("It Should create a new user", (done) => {
      chai
        .request(baseURL)
        .post("/users")
        .send({
          name: "King kong 420",
          email: "kingkong@gmail.com",
          bio: "Big Bull",
        })
        .end((err, response) => {
          expect(response).to.have.status(201);
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.property("name", "King kong 420");
          expect(response.body).to.have.property("email", "kingkong@gmail.com");
          expect(response.body).to.have.property("bio", "Big Bull");
          done();
        });
    });

    //<=======================> If user given wrong end point <===============================>

    it("It should not create a new user", (done) => {
      chai
        .request(baseURL)
        .post("/user")
        .send({
          name: "Arnav Yadav",
          email: "arnav@gmail.com",
          bio: "I want to become an footballer",
        })
        .end((err, response) => {
          expect(response).to.have.status(404);
          done();
        });
    });

    //<=======================> If user already exit <====================================>

    it("It should not create a new user, because user already exit", (done) => {
      chai
        .request(baseURL)
        .post("/users")
        .send({
          name: "Arnav Yadav",
          email: "arnav@gmail.com",
          bio: "I want to become an footballer",
        })
        .end((err, response) => {
          expect(response).to.have.status(400);
          done();
        });
    });
  });

  // <============================> Test Retrieve a user by id. <================================>

  describe("GET /users/:id", () => {
    it("It should return an user", (done) => {
      chai
        .request(baseURL)
        .get("/users/6432816b13e4f6250cf64172")
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an("object");
          done();
        });
    });
  });

  // <======================> Test Retrieve a total count of users in DB. <==========================>

  describe("GET /analytics/users", () => {
    it("It should return Total Number of users available in DB", (done) => {
      chai
        .request(baseURL)
        .get("/analytics/users")
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.property("total");
          done();
        });
    });
  });

  // <============================> Test Retrieve a top 5 Users. <==================================>

  describe("GET /analytics/users/top-active", () => {
    it("It should return top 5 active user", (done) => {
      chai
        .request(baseURL)
        .get("/analytics/users/top-active")
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an("array");
          expect(response.body).to.have.lengthOf(5);
          done();
        });
    });
  });

  // <============================> Test Delete a user by ID. <==================================>
  describe("DELETE /users/:id", () => {
    it("it should delete user", (done) => {
      chai
        .request(baseURL)
        .delete("/users/64316373ea26973dc9264cda")
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an("object");
          done();
        });
    });
  });

  // <============================> Test Edit a user by ID. <==================================>

  describe("PUT /users/:id", () => {
    it("it should update user", (done) => {
      chai
        .request(baseURL)
        .put("/users/6431aefd4375b95faf463d3d")
        .send({
          name: "Amar Singh",
          bio: "I am  amar",
        })
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an("object");
          done();
        });
    });
  });

  // <======================= post api check <============================================>

  describe("POST /posts", () => {
    it("It Should create a new post", (done) => {
      chai
        .request(baseURL)
        .post("/posts")
        .send({
          name: "Albert",
          user_id: "6431af834375b95faf463d4b",
          content:
            "I scorched the earth with my talent and I let my light shine.",
          likes: 0,
        })
        .end((err, response) => {
          expect(response).to.have.status(201);
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.property("name", "Albert");
          expect(response.body).to.have.property(
            "user_id",
            "6431af834375b95faf463d4b"
          );
          expect(response.body).to.have.property(
            "content",
            "I scorched the earth with my talent and I let my light shine."
          );
          expect(response.body).to.have.property("likes", 0);
          expect(response.body).to.have.property("createdAt");
          expect(response.body).to.have.property("updatedAt");
          done();
        });
    });
  });

  // <========================== Test Retrieve a post by id <==================================>

  describe("GET /post/:id", () => {
    it("It should return a post", (done) => {
      chai
        .request(baseURL)
        .get("/posts/6433e878c33057f4a0925a58")
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an("object");
          done();
        });
    });
  });

  // <========================== Test Delete a post by id <==================================>

  describe("DELETE /posts/:id", () => {
    it("it should delete a post", (done) => {
      chai
        .request(baseURL)
        .delete("/users/6433e878c33057f4a0925a58")
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an("object");
          done();
        });
    });
  });

  // <========================== Test Update a post by id <==================================>

  describe("PUT /posts/:id", () => {
    it("it should update a post", (done) => {
      chai
        .request(baseURL)
        .put("/posts/6433e878c33057f4a0925a58")
        .send({
          content:
            "You’re braver than you believe, stronger than you seem, and smarter than you think.",
        })
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an("object");
          done();
        });
    });
  });
});
