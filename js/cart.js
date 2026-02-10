// ========================================
// CART.JS - Gerenciamento do Carrinho
// ========================================

class ShoppingCart {
    constructor() {
        this.items = [];
        this.discount = 0; // Desconto em percentual
        this.loadCart();
    }

    // Carrega carrinho do localStorage
    loadCart() {
        const stored = localStorage.getItem('cart');
        if (stored) {
            this.items = JSON.parse(stored);
        }
        this.updateCartUI();
    }

    // Salva carrinho no localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartUI();
    }

    // Adiciona produto ao carrinho
    addItem(productId, quantity = 1) {
        const product = db.getProductById(productId);
        
        if (!product) {
            this.showNotification('Produto não encontrado', 'error');
            return false;
        }

        if (!db.checkStock(productId, quantity)) {
            this.showNotification('Estoque insuficiente', 'error');
            return false;
        }

        const existingItem = this.items.find(item => item.productId === productId);

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (!db.checkStock(productId, newQuantity)) {
                this.showNotification('Estoque insuficiente', 'error');
                return false;
            }
            existingItem.quantity = newQuantity;
        } else {
            this.items.push({
                productId,
                quantity,
                name: product.name,
                price: product.price
            });
        }

        this.saveCart();
        this.showNotification(`${product.name} adicionado ao carrinho`, 'success');
        return true;
    }

    // Remove produto do carrinho
    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.saveCart();
        this.showNotification('Item removido do carrinho', 'success');
        this.renderCartModal();
    }

    // Atualiza quantidade de um item
    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.productId === productId);
        if (item) {
            if (!db.checkStock(productId, quantity)) {
                this.showNotification('Estoque insuficiente', 'error');
                return false;
            }
            item.quantity = quantity;
            this.saveCart();
            this.renderCartModal();
        }
    }

    // Calcula subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Calcula total com desconto
    getTotal() {
        const subtotal = this.getSubtotal();
        const discountAmount = subtotal * (this.discount / 100);
        return subtotal - discountAmount;
    }

    // Aplica desconto
    applyDiscount(percentage) {
        this.discount = percentage;
        this.updateCartUI();
        this.renderCartModal();
    }

    // Limpa carrinho
    clearCart() {
        this.items = [];
        this.discount = 0;
        this.saveCart();
    }

    // Atualiza UI do carrinho
    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    // Renderiza modal do carrinho
    renderCartModal() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');

        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Seu carrinho está vazio</p>';
            cartTotalElement.textContent = 'R$ 0,00';
            return;
        }

        let html = '';
        this.items.forEach(item => {
            const subtotal = item.price * item.quantity;
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                        <p><strong>Subtotal: R$ ${subtotal.toFixed(2)}</strong></p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button onclick="cart.updateQuantity(${item.productId}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="cart.updateQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item" onclick="cart.removeItem(${item.productId})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html;

        const total = this.getTotal();
        let totalText = `R$ ${total.toFixed(2)}`;
        
        if (this.discount > 0) {
            const subtotal = this.getSubtotal();
            totalText = `
                <div style="font-size: 0.9rem; color: var(--cor-texto);">
                    Subtotal: R$ ${subtotal.toFixed(2)}<br>
                    Desconto (${this.discount}%): -R$ ${(subtotal - total).toFixed(2)}
                </div>
                R$ ${total.toFixed(2)}
            `;
        }
        
        cartTotalElement.innerHTML = totalText;
    }

    // Mostra notificação
    showNotification(message, type = 'success') {
        // Cria elemento de notificação
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: ${type === 'success' ? '#4CAF50' : '#F44336'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// CSS para animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Instância global do carrinho
const cart = new ShoppingCart();

// ========================================
// FUNÇÕES DE CHECKOUT
// ========================================

function processCheckout(checkoutData) {
    if (cart.items.length === 0) {
        cart.showNotification('Carrinho vazio', 'error');
        return false;
    }

    // Verifica estoque de todos os itens
    for (const item of cart.items) {
        if (!db.checkStock(item.productId, item.quantity)) {
            cart.showNotification(`Estoque insuficiente para ${item.name}`, 'error');
            return false;
        }
    }

    // Atualiza estoque
    for (const item of cart.items) {
        db.updateProductStock(item.productId, item.quantity);
    }

    // Cria pedido
    const order = db.addOrder({
        items: cart.items,
        total: cart.getTotal(),
        paymentMethod: checkoutData.paymentMethod,
        deliveryInfo: checkoutData.deliveryInfo
    });

    // Limpa carrinho
    cart.clearCart();

    return order;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Log inicial
console.log('🛒 Sistema de carrinho inicializado');
