import { Router } from 'express';
import { text } from 'body-parser';
import { AppContainer, LoginService, AddBidService, GetBidsService } from './app.container';
import { sessionMiddleware } from './session.middleware';

export const appController = Router();
appController.use(text());

appController.get('/:user/login', (req, res) => {
    try {
        const loginService = AppContainer.get<LoginService>(LoginService);
        res.status(200).send(loginService.login(req.params.user));
    } catch (err) {
        console.log('error login: ', err)
        let errorMessage = 'Login error'
        if (typeof err === 'string') {
            errorMessage = err
        }
        res.status(500).send(errorMessage);
    }
});

appController.post('/:item/bid', sessionMiddleware, async (req, res) => {
    try {
        const addBidService = AppContainer.get<AddBidService>(AddBidService);
        await addBidService.addBid(req.params.item, String(req.query.sessionKey), req.body);
        res.status(200).end();
    } catch (err) {
        console.log('error add bid: ', err)
        let errorMessage = 'Add bid error'
        if (typeof err === 'string') {
            errorMessage = err
        }
        res.status(500).send(errorMessage);
    }
});

appController.get('/:item/topBidList', sessionMiddleware, (req, res) => {
    try {
        const getBidsService = AppContainer.get<GetBidsService>(GetBidsService);
        const bids = getBidsService.getBids(req.params.item);
        res.status(200).send(bids);
    } catch (err) {
        console.log('error top bids: ', err)
        let errorMessage = 'Top bids error'
        if (typeof err === 'string') {
            errorMessage = err
        }
        res.status(500).send(errorMessage);
    }
});
