import {Queue,Worker,Worker} from 'bullmq';
import { sendVerificationEmail,sendWelcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail } from '../mailer/mail.js';
import Mail from 'nodemailer/lib/mailer';

const connection = {
    url : process.env.REDSI_URL || 'redis://localhost:6379'
};

// Crete the queue (the waiting room for tasks)
export const emailQueue = new Queue('email-queue',{connection});

//create the worker(the background processor)
const worker = new Worker('email-queue',async(job) => {
    console.log(`[Worker] Processing job ID : ${job.id} | Type: ${job.name}`);
    const {type,email,token,name} = job.data;

    try{
        if(type == 'verification'){
            await sendVerificationEmail(email,token);
        }
        else if(type == 'welcome'){
            await sendWelcomeEmail(email,name);
        }
        else if(type == 'passowrdReset'){
            await sendPasswordResetEmail(email,token); // token here is the URL
        }
        else if(type == 'resetSuccess'){
            await sendResetSuccessEmail(email);
        }
        console.log(`[Worker] Successfulky sent ${type} email to ${email}`);
    }catch(error){
        console.error(`[Worker] Failed to send ${type} to ${email}`,error);
        throw error; // This will mark the job as failed in BullMQ
    }
},{connection});

worker.on('failed',(job , err) => {
      console.error(`[Worker] Job ${job.id} failed after retries:`, err.message);
});