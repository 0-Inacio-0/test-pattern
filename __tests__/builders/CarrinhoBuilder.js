import { Carrinho } from '../../src/domain/Carrinho.js';
import { Item } from '../../src/domain/Item.js';
import { UserMother } from './UserMother.js';

/**
 * Data Builder Pattern - API fluente para criar Carrinhos customizáveis
 * Útil para objetos complexos com múltiplas variações entre testes
 *
 * Exemplo: new CarrinhoBuilder().comUser(user).comItens([...]).build()
 */
export class CarrinhoBuilder {
    constructor() {
        this.user = UserMother.umUsuarioPadrao();
        this.itens = [new Item('Produto Padrão', 100)];
    }

    comUser(user) {
        this.user = user;
        return this;
    }

    comItens(itens) {
        this.itens = itens;
        return this;
    }

    vazio() {
        this.itens = [];
        return this;
    }

    build() {
        return new Carrinho(this.user, this.itens);
    }
}
