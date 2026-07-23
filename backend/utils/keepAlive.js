import https from "https";
import http from "http";

/**
 * Self-pinging keep-alive utility to prevent Render free-tier web services from sleeping.
 * Render spins down free web services after 15 minutes of inactivity.
 * This interval sends a HTTP request every 14 minutes (840,000 ms).
 */
export const startKeepAlive = () => {
    const backendUrl = process.env.BACKEND_URL || "https://sai-backend-3upn.onrender.com";
    const healthUrl = `${backendUrl.replace(/\/$/, "")}/health`;
    const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

    console.log(`[Keep-Alive] Configured service keep-alive targeting: ${healthUrl}`);

    const pingServer = () => {
        const client = healthUrl.startsWith("https") ? https : http;

        client.get(healthUrl, (res) => {
            if (res.statusCode === 200) {
                console.log(`[Keep-Alive] Server ping successful at ${new Date().toISOString()}`);
            } else {
                console.warn(`[Keep-Alive] Ping received status code: ${res.statusCode}`);
            }
        }).on("error", (err) => {
            console.error(`[Keep-Alive] Error pinging server:`, err.message);
        });
    };

    // Initial ping after 30 seconds to ensure server is fully ready
    setTimeout(pingServer, 30 * 1000);

    // Schedule regular pings every 14 minutes
    const timer = setInterval(pingServer, INTERVAL_MS);

    // Prevent keep-alive timer from blocking node process exit if terminated
    if (timer.unref) {
        timer.unref();
    }
};
