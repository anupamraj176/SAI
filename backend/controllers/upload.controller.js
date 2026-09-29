import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the AWS S3 Client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// Helper: validate file type
function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

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
    
    // Return the public URL
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

export const imageUpload = async (req, res) => {
    try {
        if (!req.files || !req.files.imageFile) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const file = req.files.imageFile;
        const supportedTypes = ["jpg", "jpeg", "png", "webp"];
        const fileType = file.name.split(".").pop().toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({ success: false, message: "File format not supported" });
        }

        // Upload to S3 instead of Cloudinary!
        const imageUrl = await uploadToS3(file, "SAI/Images");

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: imageUrl, // S3 URL returned here
            publicId: imageUrl  // Keep publicId as the URL just in case frontend relies on it
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Image upload failed", error: error.message });
    }
};

export const videoUpload = async (req, res) => {
    try {
        if (!req.files || !req.files.videoFile) {
            return res.status(400).json({ success: false, message: "No video uploaded" });
        }

        const file = req.files.videoFile;
        const supportedTypes = ["mp4", "mov", "avi", "mkv"];
        const fileType = file.name.split(".").pop().toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({ success: false, message: "Video format not supported" });
        }

        // Upload to S3 instead of Cloudinary!
        const videoUrl = await uploadToS3(file, "SAI/Videos");

        res.status(200).json({
            success: true,
            message: "Video uploaded successfully",
            videoUrl: videoUrl,
            publicId: videoUrl
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Video upload failed", error: error.message });
    }
};

export const audioUpload = async (req, res) => {
    try {
        if (!req.files || !req.files.audioFile) {
            return res.status(400).json({ success: false, message: "No audio uploaded" });
        }

        const file = req.files.audioFile;
        const supportedTypes = ["mp3", "wav", "ogg", "m4a"];
        const fileType = file.name.split(".").pop().toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({ success: false, message: "Audio format not supported" });
        }

        // Upload to S3 instead of Cloudinary!
        const audioUrl = await uploadToS3(file, "SAI/Audio");

        res.status(200).json({
            success: true,
            message: "Audio uploaded successfully",
            audioUrl: audioUrl,
            publicId: audioUrl
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Audio upload failed", error: error.message });
    }
};
