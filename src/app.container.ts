import { Container } from 'inversify';
import { AuthContainer } from './auth';
import { BidContainer } from './bid';

export { LoginService, ValidateTokenService } from './auth';
export { AddBidService, GetBidsService } from './bid';

export const AppContainer = new Container();
AppContainer.load(AuthContainer, BidContainer);
