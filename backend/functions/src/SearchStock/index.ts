import { onRequest } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { App } from 'firebase-admin/app';
 
export const searchStock = (app: App) => onRequest(async (request, response): Promise<any> => {
    // Check if the query parameter exists and has at least 2 characters
    const db = getFirestore(app);
    const query = (request.query.query as string || '').trim().toLowerCase();
    if (!query || query.length < 2) {
        return response.status(400).json({ error: "Query must have at least 2 characters." });
    }

    try {
        const symbolSnapshot = await db.collection('stocks')
            .where('symbol_lower', '>=', query)
            .where('symbol_lower', '<=', query + '\uf8ff')
            .limit(10)
            .get();

        // If no results from symbol, query by name
        if (!symbolSnapshot.empty) {
            const results = symbolSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            return response.status(200).json(results);
        }


         // Fallback: Query by name if no symbol matches
        const nameSnapshot = await db.collection('stocks')
            .where('name_lower', '>=', query)
            .where('name_lower', '<=', query + '\uf8ff')
            .limit(10)
            .get();

        const results = nameSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return response.status(200).json(results);
    } catch (error) {
        console.error('Error searching stocks:', error);
        return response.status(500).json({ error: 'Internal server error' });
    }
});
