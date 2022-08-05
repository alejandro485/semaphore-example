import { injectable } from 'inversify';
import { TTL_TOKENS } from '../../config';

@injectable()
export class TokenManagerService {

    private tokens: { [name: string]: string };
    private timeOuts: { [name: string]: NodeJS.Timeout };

    constructor() {
        this.tokens = { };
        this.timeOuts = { };
    }

    public addToken(token: string, user: string) {
        this.tokens[token] = user;
        const timeOut = setTimeout(() => {
            delete this.tokens[token];
            delete this.timeOuts[token];
            // console.log(`token ${token} deleted`);
        }, TTL_TOKENS);
        this.timeOuts[token] = timeOut;
    }

    public getToken(token: string) {
        return this.tokens[token];
    }

    public unsetAll() {
        Object.keys(this.timeOuts).forEach(to => {
            clearTimeout(this.timeOuts[to])
        });
        this.tokens = { };
        this.timeOuts = { };
    }

}
