import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

// Initialize the AWS S3 Client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// Helper: upload to AWS S3
async function uploadToS3(file, folder) {
    const fileStream = fs.createReadStream(file.tempFilePath);
    const fileName = `${folder}/${Date.now()}-${file.name}`;
    
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: fileStream,
        ContentType: file.mimetype,
    });

    await s3.send(command);
    
    // Return the public URL so the frontend can display it!
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}
