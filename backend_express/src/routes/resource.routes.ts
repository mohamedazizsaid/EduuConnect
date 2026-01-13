import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { initUpload, completeUpload, getAllResources, getResourceById, deleteResource, uploadFile } from '../controllers/resource.controller';

const router = Router();

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), uploadFile);
// Keeping old routes for compatibility if needed, but primary upload is now handled above
router.post('/upload-init', initUpload);
router.post('/upload-complete', completeUpload);
router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.delete('/:id', deleteResource);

export default router;
