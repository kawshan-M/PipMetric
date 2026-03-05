const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();

const FINNHUB_KEY = 'd6juehhr01qkvh5re4kgd6juehhr01qkvh5re4l0';

async function updateNewsData() {
    // 1. News Fetch
    const response = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`);
    const newsData = response.data.slice(0, 25);

    await db.collection('news').doc('latest').set({
        articles: newsData,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    return "News Updated Successfully!";
}

exports.fetchTradingNews = functions.https.onRequest(async (req, res) => {
    try {
        const result = await updateNewsData();
        res.status(200).send(result);
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).send("Error updating news: " + error.message);
    }
});