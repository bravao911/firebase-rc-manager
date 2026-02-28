const { db } = require('../config/firebase');

/**
 * @description Get all documents from a collection OR a specific document by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const getGenericData = async (req, res, next) => {
    try {
        const { collectionName, docId } = req.params;

        if (!collectionName) {
            return res.status(400).json({ message: 'Collection name is required.' });
        }

        // If a document ID is provided, fetch that specific document
        if (docId) {
            const docRef = db.collection(collectionName).doc(docId);
            const doc = await docRef.get();

            if (!doc.exists) {
                return res.status(404).json({ message: 'Document not found' });
            }

            // Return the document data along with its ID
            return res.status(200).json({ id: doc.id, ...doc.data() });
        }

        // If no document ID is provided, fetch all documents in the collection
        const snapshot = await db.collection(collectionName).get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });

        if (data.length === 0) {
            return res.status(404).json({ message: `No documents found in collection '${collectionName}'` });
        }

        // Return the array of documents
        res.status(200).json(data);

    } catch (error) {
        // Pass any errors to your error handling middleware
        next(error);
    }
};

module.exports = {
    getGenericData,
};
