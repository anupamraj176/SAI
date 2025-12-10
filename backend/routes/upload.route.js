import express from "express";
import { 
    imageUpload, 
    videoUpload, 
    imageReducerUpload, 
    audioUpload 
} from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/image", imageUpload);
router.post("/video", videoUpload);
router.post("/audio", audioUpload);
router.post("/image-reduce", imageReducerUpload);

export default router;