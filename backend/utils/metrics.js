import client from "prom-client";

export const metricsRegistry = new client.Registry();

client.collectDefaultMetrics({
  register: metricsRegistry,
  prefix: "farmerhub_",
});

export const httpRequestsTotal = new client.Counter({
  name: "farmerhub_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [metricsRegistry],
});

export const httpRequestDurationSeconds = new client.Histogram({
  name: "farmerhub_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [metricsRegistry],
});

export const metricsMiddleware = (req, res, next) => {
  if (req.path === "/metrics") return next();

  const endTimer = httpRequestDurationSeconds.startTimer();
  res.on("finish", () => {
    const route = req.route?.path
      ? `${req.baseUrl || ""}${req.route.path}`
      : req.baseUrl || req.path || "unknown";
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };
    httpRequestsTotal.inc(labels);
    endTimer(labels);
  });
  next();
};

export const metricsHandler = async (_req, res) => {
  try {
    res.set("Content-Type", metricsRegistry.contentType);
    res.end(await metricsRegistry.metrics());
  } catch (error) {
    res.status(500).end(error.message);
  }
};

