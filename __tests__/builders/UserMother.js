import { User } from '../../src/domain/User.js';

/**
 * Object Mother Pattern - Cria instâncias fixas de User
 * Útil para entidades simples que raramente mudam entre testes
 */
export class UserMother {
    static umUsuarioPadrao() {
        return new User(1, 'João Silva', 'joao@email.com', 'PADRAO');
    }

    static umUsuarioPremium() {
        return new User(2, 'Maria Santos', 'premium@email.com', 'PREMIUM');
    }
}
