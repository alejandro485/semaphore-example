jest.mock('../src/config', () => ({ TTL_TOKENS: 5000, BIDS_LIMIT: 15, MAX_CONCURRENT_ADDS: 1 }));
import * as supertest from 'supertest';
import { app } from '../src/app';
import { TTL_TOKENS } from '../src/config';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('bid http', () => {
    let server: supertest.SuperTest<supertest.Test>;

    let sessionKey: string;
    let item: string;
    let amount: number;

    beforeEach(async () => {
        server = supertest(app);
        item = Math.random().toString(36).slice(2, 10);
        amount = Math.random() * 1000;

        const user = Math.random().toString(36).slice(2, 10);
        const loginResponse = await server.get(`/${user}/login`);
        sessionKey = loginResponse.text;
    });

    afterAll(() => { });

    it('(POST) /:item/bid -> bid without session', async () => {
        const response = await server.post(`/${item}/bid`)
            .set({ 'Content-Type': 'text/plain' })
            .send(String(amount));

        expect(response.status).toBe(400);
        expect(response.text).toBe('auth required');
    });

    it('(POST) /:item/bid -> bid with session', async () => {
        const bidResponse = await server.post(`/${item}/bid`)
            .query({ sessionKey })
            .set({ 'Content-Type': 'text/plain' })
            .send(String(amount));

        expect(bidResponse.status).toBe(200);
        expect(bidResponse.text).toBe('');
    });

    it('(POST) /:item/bid -> bad amount', async () => {
        const bidResponse = await server.post(`/${item}/bid`)
            .query({ sessionKey })
            .set({ 'Content-Type': 'text/plain' })
            .send('a' + Math.random().toString(36).slice(2));

        expect(bidResponse.status).toBe(500);
        expect(bidResponse.text).toBe('invalid amount');
    });

    it('(POST) /:item/bid -> expired session', async () => {
        await sleep(TTL_TOKENS);
        const response = await server.post(`/${item}/bid`)
            .query({ sessionKey })
            .set({ 'Content-Type': 'text/plain' })
            .send(String(amount));

        expect(response.status).toBe(400);
        expect(response.text).toBe('auth required');
    }, TTL_TOKENS * 2);

});