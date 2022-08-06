import { injectable } from 'inversify';
import { TTL_TOKENS } from '../../config';

@injectable()
export class TokenManagerService {

    private tokens: { [name: string]: string };

    constructor() {
        this.tokens = { };
    }

    public addToken(token: string, user: string) {
        this.tokens[token] = user;
        const timeOut = setTimeout(() => {
            delete this.tokens[token];
        }, TTL_TOKENS);
        timeOut.unref();
    }

    public getToken(token: string) {
        return this.tokens[token];
    }

}
