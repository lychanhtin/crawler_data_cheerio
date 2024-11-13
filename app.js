const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect('mongodb://0.0.0.0:27017/productPrices', { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({
    productName: String,
    price: String,
    source: String,
    dataCollected: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

app.post('/crawl', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let productName, price;

        if (url.includes('amazon')) {
            productName = $('#productTitle').text().trim();
            // priceToPay
            // price = $('#corePrice_desktop .a-price-range .a-price .a-offscreen, #corePrice_desktop .a-price-range .a-price-dash, #apex_desktop:not([style*="display:none;"]) .priceToPay, #apex_desktop_usedAccordionRow:not([style*="display:none;"]) .priceToPay').text().trim();
            price = $('.priceToPay').text().trim();
        } else if (url.includes('ebay')) {
            productName = $('.x-item-title').text().trim();
            price = $('.x-price-section .x-price-primary').text().trim();
            // approxPrice = $('.x-price-approx').text().trim();
        } else {
            return res.status(400).json({ error: 'Unsupported website' });
        }
        if (!productName || !price) {
            return res.status(500).json({ error: 'Failed to extract product data' });
        }

        const product = new Product({ productName, price, source: url });
        await product.save();

        res.json({ productName, price, source: url, dataCollected: product.dataCollected.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to crawl product data' });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;