jest.mock('../src/config', () => ({ TTL_TOKENS: 5000, BIDS_LIMIT: 15, MAX_CONCURRENT_ADDS: 1 }));
import * as supertest from 'supertest';
import { app } from '../src/app';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('login http', () => {
    let server: supertest.SuperTest<supertest.Test>;

    let user: string;
    let item: string;
    let amount: number;

    beforeEach(() => {
        server = supertest(app);
        item = Math.random().toString(36).slice(2, 10);
        user = Math.random().toString(36).slice(2, 10);
        amount = Math.random() * 1000;
    });

    afterAll(() => { });

    it('(GET) /:user/login -> login', async () => {
        const response = await server.get(`/${user}/login`);
        expect(response.status).toBe(200);
        expect(response.text).toMatch(/^[0-9a-z]*/g);
    });

});
