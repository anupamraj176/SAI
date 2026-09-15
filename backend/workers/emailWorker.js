import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailer/mail.js";

// Create an ioredis connection specifically for BullMQ
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null // BullMQ requires this setting to be null
});

// 1. Create the Queue (The waiting room for tasks)
export const emailQueue = new Queue('email-queue', { connection });

// 2. Create the Worker (The background processor)
const worker = new Worker('email-queue', async (job) => {
    console.log(`[Worker] Processing Job ID: ${job.id} | Type: ${job.name}`);
    const { type, email, token, name } = job.data;

    try {
        if (type === 'verification') {
            await sendVerificationEmail(email, token);
        } else if (type === 'welcome') {
            await sendWelcomeEmail(email, name);
        } else if (type === 'passwordReset') {
            await sendPasswordResetEmail(email, token);
        } else if (type === 'resetSuccess') {
            await sendResetSuccessEmail(email);
        }
        console.log(`[Worker] Successfully sent ${type} email to ${email}`);
    } catch (error) {
        console.error(`[Worker] Failed to send email to ${email}`, error);
        throw error; 
    }
}, { connection });

worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job.id} failed after retries:`, err.message);
});
