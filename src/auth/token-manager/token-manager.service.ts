import { injectable } from 'inversify';
import { TTL_TOKENS } from '../../config';

@injectable()
export class TokenManagerService {

    private tokens: { [name: string]: string };

    constructor() {
        this.tokens = { }
    }

    public addToken(token: string, user: string) {
        this.tokens[token] = user;
        setTimeout(() => {
            delete this.tokens[token];
            console.log(`token ${token} deleted`);
        }, TTL_TOKENS);
    }

    public getToken(token: string) {
        return this.tokens[token];
    }

}
