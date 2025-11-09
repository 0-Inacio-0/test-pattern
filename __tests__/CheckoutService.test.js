import { CheckoutService } from '../src/services/CheckoutService.js';
import { Item } from '../src/domain/Item.js';
import { Pedido } from '../src/domain/Pedido.js';
import { UserMother } from './builders/UserMother.js';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';

/**
 * Testes do CheckoutService demonstrando Test Patterns:
 * - Object Mother e Data Builder para criação de dados
 * - Stubs (State Verification) e Mocks (Behavior Verification)
 */
describe('CheckoutService', () => {
    // Padrão Stub - Verificação de Estado
    describe('quando o pagamento falha', () => {
        it('deve retornar null', async () => {
            // Arrange
            const carrinho = new CarrinhoBuilder().build();

            // Stub: retorna resposta pré-definida
            const gatewayStub = {
                cobrar: jest.fn().mockResolvedValue({ success: false })
            };

            // Dummies: não serão chamados neste cenário
            const repositoryDummy = {
                salvar: jest.fn()
            };
            const emailDummy = {
                enviarEmail: jest.fn()
            };

            const checkoutService = new CheckoutService(
                gatewayStub,
                repositoryDummy,
                emailDummy
            );

            // Act
            const pedido = await checkoutService.processarPedido(
                carrinho,
                '1234-5678-9012-3456'
            );

            // Assert - Verificação de Estado
            expect(pedido).toBeNull();
            expect(repositoryDummy.salvar).not.toHaveBeenCalled();
            expect(emailDummy.enviarEmail).not.toHaveBeenCalled();
        });
    });

    // Padrão Mock - Verificação de Comportamento
    describe('quando um cliente Premium finaliza a compra', () => {
        it('deve aplicar desconto de 10% e enviar email de confirmação', async () => {
            // Arrange
            const usuarioPremium = UserMother.umUsuarioPremium();
            const itens = [
                new Item('Notebook', 150),
                new Item('Mouse', 50)
            ];
            const carrinho = new CarrinhoBuilder()
                .comUser(usuarioPremium)
                .comItens(itens)
                .build();

            const gatewayStub = {
                cobrar: jest.fn().mockResolvedValue({ success: true })
            };
            const repositoryStub = {
                salvar: jest.fn().mockResolvedValue(
                    new Pedido(123, carrinho, 180, 'PROCESSADO')
                )
            };

            // Mock: verificaremos chamadas e argumentos
            const emailMock = {
                enviarEmail: jest.fn().mockResolvedValue(true)
            };

            const checkoutService = new CheckoutService(
                gatewayStub,
                repositoryStub,
                emailMock
            );

            // Act
            const pedido = await checkoutService.processarPedido(
                carrinho,
                '1234-5678-9012-3456'
            );

            // Assert - Verificação de Comportamento
            expect(pedido).not.toBeNull();
            expect(pedido.status).toBe('PROCESSADO');

            // Verifica desconto de 10%: R$ 200,00 * 0.90 = R$ 180,00
            expect(gatewayStub.cobrar).toHaveBeenCalledWith(
                180,
                '1234-5678-9012-3456'
            );

            expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
            expect(emailMock.enviarEmail).toHaveBeenCalledWith(
                'premium@email.com',
                'Seu Pedido foi Aprovado!',
                'Pedido 123 no valor de R$180'
            );
        });
    });
});
