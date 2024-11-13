const request = require('supertest');
const app = require('../app');

describe('post /crawl', () => {
    const amazonUrls = [
        'https://www.amazon.com/dp/B01H6GUCCQ',
        'https://www.amazon.com/dp/B0BWH7FBZC',
        'https://www.amazon.com/dp/B0D9NL4DSQ',
        'https://www.amazon.com/dp/B0C2Z532H1',
        'https://www.amazon.com/dp/B0B7RSV894',
        'https://www.amazon.com/dp/B0D6GMM3JC',
        'https://www.amazon.com/dp/B08ZY8HT1G',
        'https://www.amazon.com/dp/B0CMDM65JH',
    ];

    const ebayUrls = [
        'https://www.ebay.com/itm/335623760116',
        'https://www.ebay.com/itm/356102653526',
        'https://www.ebay.com/itm/285043541525',
        'https://www.ebay.com/itm/196798453488',
        'https://www.ebay.com/itm/186775485469',
        'https://www.ebay.com/itm/305312672648',
        'https://www.ebay.com/itm/305891388860',
        'https://www.ebay.com/itm/305493660705',
    ];

    amazonUrls.forEach(url => {
        it(`should return product data from Amazon for URL: ${url}`, async () => {
            const response = await request(app).post('/crawl').send({ url });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('productName');
            expect(response.body).toHaveProperty('price');
            expect(response.body).toHaveProperty('dataCollected');
            console.log(response.body)
        });
    });

    ebayUrls.forEach(url => {
        it(`should return product data from eBay for URL: ${url}`, async () => {
            const response = await request(app).post('/crawl').send({ url });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('productName');
            expect(response.body).toHaveProperty('price');
            expect(response.body).toHaveProperty('dataCollected');
            console.log(response.body)

        });
    });

    it('should return error if URL is not provided', async () => {
        const response = await request(app).post('/crawl').send({ url: '' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('URL is required');
    });
});
