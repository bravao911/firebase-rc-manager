// routes/uploads.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin'); // Firebase Admin SDK
const multer = require('multer'); // For handling multipart/form-data
const { handleError } = require('../controllers/errorHandler');

// Initialize Multer for in-memory storage (files are processed before uploading to Firebase Storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB file size limit (adjust as needed)
    },
});

/**
 * POST /uploads/image
 * Uploads an image file to Firebase Storage.
 * The image will be stored in 'vehicles/{vehicleId}/{filename}'.
 * Requires 'image' field in multipart/form-data.
 *
 * Request Body:
 * - image: The image file (multipart/form-data)
 * - vehicleId: (Optional, but highly recommended) The ID of the vehicle this image belongs to.
 * If not provided, a random ID will be used for the folder.
 */
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided.'
            });
        }

        const bucket = admin.storage().bucket();
        const file = req.file;
        const contentType = file.mimetype;
        const originalName = file.originalname;

        const vehicleId = req.body.vehicleId || `temp_vehicle_${Date.now()}`;

        // Create a unique filename to prevent conflicts
        const filename = `vehicles/${vehicleId}/${Date.now()}_${originalName}`;
        const fileUpload = bucket.file(filename);

        await fileUpload.save(file.buffer, {
            contentType: contentType,
            metadata: {
                originalName: originalName,
                vehicleId: vehicleId
            }
        });

        await fileUpload.makePublic();

        const publicUrl = fileUpload.publicUrl();

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully to Firebase Storage.',
            url: publicUrl,
            filename: filename // Return filename for potential future deletion/reference
        });

    } catch (error) {
        handleError(res, 'upload image to Firebase Storage', error);
    }
});


/**
 * DELETE /uploads/image/:vehicleId/:filename
 * Deletes an image file from Firebase Storage.
 *
 * Parameters:
 * - vehicleId: The ID of the vehicle (folder name).
 * - filename: The full filename (including timestamp and original name) of the image.
 *
 * Example URL: /uploads/image/vehicle_abc123/1678901234567_myimage.jpg
 */
router.delete('/image/:vehicleId/:filename', async (req, res) => {
    try {
        const { vehicleId, filename } = req.params;
        if (!vehicleId || !filename) {
            return res.status(400).json({
                success: false,
                message: 'Both vehicleId and filename are required to delete an image.'
            });
        }

        const bucket = admin.storage().bucket();
        // Construct the full path to the file in storage
        const filePath = `vehicles/${vehicleId}/${filename}`;
        const fileRef = bucket.file(filePath);

        // Check if the file exists before attempting to delete
        const [exists] = await fileRef.exists();
        if (!exists) {
            return res.status(404).json({
                success: false,
                message: 'Image not found in Firebase Storage.'
            });
        }

        await fileRef.delete();

        res.status(200).json({
            success: true,
            message: `Image '${filePath}' deleted successfully from Firebase Storage.`
        });

    } catch (error) {
        // If the error is that the file wasn't found (e.g., already deleted), still return success.
        // Firebase Storage delete can throw if file doesn't exist.
        if (error.code === 404 || error.message.includes('No such object')) {
             return res.status(200).json({ // Return 200 even if already deleted
                success: true,
                message: `Image not found or already deleted from Firebase Storage. Path: ${req.params.vehicleId}/${req.params.filename}`
            });
        }
        handleError(res, 'delete image from Firebase Storage', error);
    }
});

module.exports = router;