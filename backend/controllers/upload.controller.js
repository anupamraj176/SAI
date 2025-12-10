import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: validate file type
function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

// Helper: upload to Cloudinary
async function uploadToCloudinary(file, folder, resourceType = "auto") {
    const options = { folder, resource_type: resourceType };
    return await cloudinary.uploader.upload(file.tempFilePath, options);
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

        const response = await uploadToCloudinary(file, "SAI/Images");

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: response.secure_url,
            publicId: response.public_id
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

        const response = await uploadToCloudinary(file, "SAI/Videos", "video");

        res.status(200).json({
            success: true,
            message: "Video uploaded successfully",
            videoUrl: response.secure_url,
            publicId: response.public_id
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

        const response = await uploadToCloudinary(file, "SAI/Audio", "video");

        res.status(200).json({
            success: true,
            message: "Audio uploaded successfully",
            audioUrl: response.secure_url,
            publicId: response.public_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Audio upload failed", error: error.message });
    }
};

export const imageReducerUpload = async (req, res) => {
    try {
        if (!req.files || !req.files.imageFile) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const file = req.files.imageFile;
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".").pop().toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({ success: false, message: "File format not supported" });
        }

        const tempDir = path.join(__dirname, "../tmp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);

        await sharp(file.tempFilePath)
            .resize({ width: 800 })
            .jpeg({ quality: 80 })
            .toFile(tempFilePath);

        const response = await cloudinary.uploader.upload(tempFilePath, {
            folder: "SAI/Images_Reduced",
        });

        fs.unlinkSync(tempFilePath);

        res.status(200).json({
            success: true,
            message: "Reduced image uploaded successfully",
            imageUrl: response.secure_url,
            publicId: response.public_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Reduced upload failed", error: error.message });
    }
};