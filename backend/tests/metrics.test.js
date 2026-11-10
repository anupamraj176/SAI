import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import {
  metricsRegistry,
  metricsMiddleware,
  metricsHandler,
} from "../utils/metrics.js";

test("metricsMiddleware records HTTP requests and metricsHandler exports Prometheus text", async () => {
  const req = {
    method: "GET",
    path: "/api/products",
    baseUrl: "/api/products",
    route: { path: "/" },
  };
  const res = new EventEmitter();
  res.statusCode = 200;

  let nextCalled = false;
  metricsMiddleware(req, res, () => {
    nextCalled = true;
  });
  assert.equal(nextCalled, true);

  res.emit("finish");

  const headers = {};
  let body = "";
  const handlerRes = {
    set(key, val) {
      headers[key] = val;
    },
    end(payload) {
      body = payload;
    },
  };

  await metricsHandler({}, handlerRes);

  assert.match(headers["Content-Type"], /^text\/plain/);
  assert.match(body, /farmerhub_http_requests_total/);
  assert.match(body, /farmerhub_http_request_duration_seconds/);
  assert.ok((await metricsRegistry.metrics()).includes('status_code="200"'));
});

