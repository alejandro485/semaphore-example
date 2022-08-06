jest.mock('../src/config', () => ({ TTL_TOKENS: 5000, BIDS_LIMIT: 15, MAX_CONCURRENT_ADDS: 1 }));
import * as supertest from 'supertest';
import { app } from '../src/app';
import { BIDS_LIMIT, TTL_TOKENS } from '../src/config';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('topBidList http', () => {
    let server: supertest.SuperTest<supertest.Test>;

    let sessionKey: string;
    let item: string;

    beforeEach(async () => {
        server = supertest(app);
        item = Math.random().toString(36).slice(2, 10);

        const user = Math.random().toString(36).slice(2, 10);
        const loginResponse = await server.get(`/${user}/login`);
        sessionKey = loginResponse.text;
    });

    afterAll(() => { });

    it('(GET) /:item/topBidList -> top bids without session', async () => {
        const response = await server.get(`/${item}/topBidList`);
        expect(response.status).toBe(400);
        expect(response.text).toBe('auth required');
    });

    it('(GET) /:item/topBidList -> top bids with session', async () => {
        const response = await server.get(`/${item}/topBidList`)
            .query({ sessionKey });

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });

    it('(GET) /:item/topBidList -> expired session', async () => {
        await sleep(TTL_TOKENS);
        const response = await server.get(`/${item}/topBidList`)
            .query({ sessionKey });

        expect(response.status).toBe(400);
        expect(response.text).toBe('auth required');
    }, TTL_TOKENS * 2);

    it('(GET) /:item/topBidList -> multiple items', async () => {
        const totalIter = (Math.random() * 10) + BIDS_LIMIT;
        const inserts: { item: string, user: string, amount: number }[] = [];

        for (let i = 0; i < totalIter; i++) {
            const user = Math.random().toString(36).slice(2, 10);
            const amount = Math.random() * 1000;
            item = Math.random().toString(36).slice(2, 10);

            const loginResponse = await server.get(`/${user}/login`);
            sessionKey = loginResponse.text;

            await server.post(`/${item}/bid`)
                .query({ sessionKey })
                .set({ 'Content-Type': 'text/plain' })
                .send(String(amount));

            inserts.push({ user, item, amount });
        }

        for (const insert of inserts) {
            const topResponse = await server.get(`/${insert.item}/topBidList`)
                .query({ sessionKey });

            expect(topResponse.status).toBe(200);
            const body: any[] = topResponse.body;
            const topBid = body[0];

            const obj = { };
            obj[insert.user] = insert.amount;

            expect(body.length).toBe(1);
            expect(topBid).toEqual(obj);
        }
    }, TTL_TOKENS * 2);

    it('(GET) /:item/topBidList -> multiple bids one user', async () => {
        const totalIter = (Math.random() * 10) + BIDS_LIMIT;
        const inserts: number[] = [];

        const user = Math.random().toString(36).slice(2, 10);
        const loginResponse = await server.get(`/${user}/login`);
        sessionKey = loginResponse.text;

        for (let i = 0; i < totalIter; i++) {
            const amount = Math.random() * 1000;
            await server.post(`/${item}/bid`)
                .query({ sessionKey })
                .set({ 'Content-Type': 'text/plain' })
                .send(String(amount));
            inserts.push(amount);
        }

        const topResponse = await server.get(`/${item}/topBidList`)
            .query({ sessionKey });

        expect(topResponse.status).toBe(200);
        const body: any[] = topResponse.body;
        const topBid = body[0];

        const obj = {};
        obj[user] = Math.max(...inserts);

        expect(body.length).toBe(1);
        expect(topBid).toEqual(obj);
    }, TTL_TOKENS * 2);

    it('(GET) /:item/topBidList -> multiple bids on item', async () => {
        const inserts: any[] = [];

        for (let i = 0; i < BIDS_LIMIT; i++) {
            const user = Math.random().toString(36).slice(2, 10);
            const loginResponse = await server.get(`/${user}/login`);

            sessionKey = loginResponse.text;
            const amount = Math.random() * 1000;

            await server.post(`/${item}/bid`)
                .query({ sessionKey })
                .set({ 'Content-Type': 'text/plain' })
                .send(String(amount));

            const obj = { };
            obj[user] = amount;
            inserts.push(obj);
        }

        const topResponse = await server.get(`/${item}/topBidList`)
            .query({ sessionKey });

        expect(topResponse.status).toBe(200);
        const body: any[] = topResponse.body;

        expect(body.length).toBe(BIDS_LIMIT);
        expect(body).toEqual(expect.arrayContaining(inserts));
    }, TTL_TOKENS * 2);

});