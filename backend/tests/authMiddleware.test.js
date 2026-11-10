import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    cookies: [],
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    cookie(name, value, options) {
      this.cookies.push({ name, value, options });
      return this;
    },
  };
}

test("verifyAuth rejects requests without token cookie", () => {
  const req = { cookies: {} };
  const res = createMockRes();
  let nextCalled = false;

  verifyAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.success, false);
});

test("verifyAuth attaches user payload and calls next for valid JWT", () => {
  process.env.JWT_SECRET = "test-jwt-secret";
  const token = jwt.sign({ userId: "user-123", role: "seller" }, process.env.JWT_SECRET);
  const req = { cookies: { token } };
  const res = createMockRes();
  let nextCalled = false;

  verifyAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.userId, "user-123");
  assert.deepEqual(req.user, { userId: "user-123", role: "seller" });
});

test("verifyAdmin allows admin role and rejects non-admin role", () => {
  const resDenied = createMockRes();
  let deniedNext = false;
  verifyAdmin({ user: { userId: "u1", role: "user" } }, resDenied, () => {
    deniedNext = true;
  });
  assert.equal(deniedNext, false);
  assert.equal(resDenied.statusCode, 403);

  const resAllowed = createMockRes();
  let allowedNext = false;
  verifyAdmin({ user: { userId: "a1", role: "admin" } }, resAllowed, () => {
    allowedNext = true;
  });
  assert.equal(allowedNext, true);
});

test("generateTokenAndSetCookie signs JWT and sets httpOnly cookie", () => {
  process.env.JWT_SECRET = "test-jwt-secret";
  const res = createMockRes();

  const token = generateTokenAndSetCookie(res, "user-456", "user");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  assert.equal(decoded.userId, "user-456");
  assert.equal(decoded.role, "user");
  assert.equal(res.cookies.length, 1);
  assert.equal(res.cookies[0].name, "token");
  assert.equal(res.cookies[0].options.httpOnly, true);
});

