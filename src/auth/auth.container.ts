import { ContainerModule } from 'inversify';
import { LoginService } from './login/login.service';
import { TokenManagerService } from './token-manager/token-manager.service';
import { ValidateTokenService } from './validate-token/validate-token.service';

export const AuthContainer = new ContainerModule((bind) => {
    bind<LoginService>(LoginService).to(LoginService).inSingletonScope();
    bind<TokenManagerService>(TokenManagerService).to(TokenManagerService).inSingletonScope();
    bind<ValidateTokenService>(ValidateTokenService).to(ValidateTokenService).inSingletonScope();
});
