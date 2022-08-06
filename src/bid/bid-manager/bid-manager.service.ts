import { injectable } from 'inversify';
import { BIDS_LIMIT } from '../../config';

@injectable()
export class BidManagerService {

    private items: { [item: string]: { user: string, amount: number }[] };

    constructor() {
        this.items = { };
    }

    public addBid(item: string, user: string, amount: number) {
        if (!this.items[item]) {
            this.items[item] = [];
        }
        const userBid = this.items[item].find(it => it.user === user);
        if (userBid) {
            if (userBid.amount < amount) userBid.amount = amount;
        } else {
            this.items[item].push({
                user, amount,
            });
            this.items[item] = this.items[item].sort((it1, it2) => it2.amount - it1.amount).slice(0, BIDS_LIMIT);
        }
    }

    public getBids(item: string) {
        if (!this.items[item]) {
            this.items[item] = [];
        }
        return this.items[item];
    }

}
