/**
 * This controller uses Server-Sent Events (SSE) to stream a specific Firestore
 * document's updates. It establishes a long-lived HTTP connection with the client
 * and pushes data in real-time whenever that specific document in the 'reservations'
 * collection is modified or removed.
 */

// Assuming your firebase config file exports the initialized Firestore db instance
const { db } = require('../config/firebase');

/**
 * @description Listens for real-time updates on a single document in the
 * 'reservations' collection and streams them to the client using SSE.
 * @param {object} req - Express request object, with document ID in params.
 * @param {object} res - Express response object.
 */
const streamReservationById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ message: 'Document ID is required.' });
    }

    // 1. Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    console.log(`Client connected for reservation stream on doc ID: ${id}`);

    // 2. Set up the Firestore listener on a specific document
    const reservationDoc = db.collection('reservations').doc(id);

    const unsubscribe = reservationDoc.onSnapshot(
        (doc) => {
            let eventPayload;

            // 3. Check if the document exists
            if (doc.exists) {
                // Document exists and was likely created or modified
                eventPayload = {
                    type: 'modified', // Treat initial fetch and subsequent updates as 'modified'
                    id: doc.id,
                    data: doc.data(),
                };
            } else {
                // Document has been deleted
                eventPayload = {
                    type: 'removed',
                    id: id,
                    data: null, // No data to send
                };
            }

            // 4. Format and send the data to the client
            res.write(`data: ${JSON.stringify(eventPayload)}\n\n`);
        },
        (error) => {
            console.error(`Error in Firestore snapshot listener for doc ${id}:`, error);
            res.write(`event: error\ndata: {"message": "Error listening to the document."}\n\n`);
            res.end();
        }
    );

    // 5. Handle client disconnect
    req.on('close', () => {
        console.log(`Client disconnected from doc ${id}. Unsubscribing.`);
        unsubscribe();
        res.end();
    });
};

module.exports = {
    streamReservationById,
};
