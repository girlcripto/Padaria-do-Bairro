// ========================================
// MAIN.JS - Script Principal
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Padaria do Bairro - Sistema Inicializado');

    // ========================================
    // RENDERIZAÇÃO DE PRODUTOS
    // ========================================

    function renderProducts() {
        const products = db.getAllProducts();
        
        // Renderiza tabela
        renderProductsTable(products);
        
        // Renderiza cards
        renderProductsGrid(products);
    }

    function renderProductsTable(products) {
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;

        tbody.innerHTML = products.map(product => `
            <tr>
                <td><strong>${product.name}</strong></td>
                <td><span class="product-category">${product.category}</span></td>
                <td>${product.description}</td>
                <td><strong>R$ ${product.price.toFixed(2)}</strong></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="addToCartFromTable(${product.id})">
                        <i class="fas fa-cart-plus"></i> Adicionar
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function renderProductsGrid(products) {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        grid.innerHTML = products.map(product => {
            const icon = getCategoryIcon(product.category);
            return `
                <article class="product-card" data-category="${product.category}">
                    <div class="product-image">
                        <i class="${icon}"></i>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <span class="product-category">${product.category}</span>
                        <p class="product-description">${product.description}</p>
                        <div class="product-footer">
                            <span class="product-price">R$ ${product.price.toFixed(2)}</span>
                            <span class="product-stock">Estoque: ${product.stock}</span>
                        </div>
                        <div class="quantity-selector">
                            <button onclick="decreaseQuantity(${product.id})">-</button>
                            <input type="number" id="qty-${product.id}" value="1" min="1" max="${product.stock}" readonly>
                            <button onclick="increaseQuantity(${product.id})">+</button>
                        </div>
                        <button class="btn btn-primary btn-block" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                        </button>
                    </div>
                </article>
            `;
        }).join('');
    }

    function getCategoryIcon(category) {
        const icons = {
            'Pães': 'fas fa-bread-slice',
            'Doces': 'fas fa-cookie-bite',
            'Salgados': 'fas fa-drumstick-bite',
            'Cafeteria': 'fas fa-coffee',
            'Souvenirs': 'fas fa-gift'
        };
        return icons[category] || 'fas fa-shopping-bag';
    }

    // ========================================
    // FUNÇÕES DE CARRINHO
    // ========================================

    window.addToCart = function(productId) {
        const qtyInput = document.getElementById(`qty-${productId}`);
        const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
        cart.addItem(productId, quantity);
        if (qtyInput) qtyInput.value = 1;
    };

    window.addToCartFromTable = function(productId) {
        cart.addItem(productId, 1);
    };

    window.increaseQuantity = function(productId) {
        const input = document.getElementById(`qty-${productId}`);
        if (input) {
            const max = parseInt(input.max);
            const current = parseInt(input.value);
            if (current < max) {
                input.value = current + 1;
            }
        }
    };

    window.decreaseQuantity = function(productId) {
        const input = document.getElementById(`qty-${productId}`);
        if (input && parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
        }
    };

    // ========================================
    // NAVEGAÇÃO E MENU MOBILE
    // ========================================

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Fecha menu ao clicar em link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // ========================================
    // MODAIS
    // ========================================

    // Modal de Cadastro
    const signupModal = document.getElementById('signup-modal');
    const openSignupBtn = document.getElementById('open-signup-modal');
    
    if (openSignupBtn) {
        openSignupBtn.addEventListener('click', () => {
            signupModal.style.display = 'block';
        });
    }

    // Modal do Carrinho
    const cartModal = document.getElementById('cart-modal');
    const cartBtn = document.getElementById('cart-btn');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cart.renderCartModal();
            cartModal.style.display = 'block';
        });
    }

    // Modal de Checkout
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.items.length === 0) {
                cart.showNotification('Seu carrinho está vazio', 'error');
                return;
            }
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'block';
            updateCheckoutTotal();
        });
    }

    // Fechar modais
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // ========================================
    // FORMULÁRIOS
    // ========================================

    // Formulário de Cadastro
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userData = {
                name: document.getElementById('signup-name').value,
                email: document.getElementById('signup-email').value,
                phone: document.getElementById('signup-phone').value,
                password: document.getElementById('signup-password').value
            };

            const user = db.addUser(userData);
            cart.applyDiscount(10); // 10% de desconto
            
            cart.showNotification('Cadastro realizado! Você ganhou 10% de desconto!', 'success');
            signupModal.style.display = 'none';
            signupForm.reset();
        });
    }

    // Formulário de Encomenda
    const encomendaForm = document.getElementById('encomenda-form');
    if (encomendaForm) {
        encomendaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const cakeData = {
                name: document.getElementById('nome-cliente').value,
                phone: document.getElementById('telefone-cliente').value,
                email: document.getElementById('email-cliente').value,
                deliveryDate: document.getElementById('data-entrega').value,
                type: document.getElementById('tipo-bolo').value,
                weight: document.getElementById('peso-bolo').value,
                message: document.getElementById('mensagem-bolo').value,
                details: document.getElementById('detalhes-bolo').value
            };

            db.addCustomCake(cakeData);
            cart.showNotification('Encomenda enviada com sucesso! Entraremos em contato.', 'success');
            encomendaForm.reset();
            
            // Scroll para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Formulário de Contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            cart.showNotification('Mensagem enviada com sucesso! Responderemos em breve.', 'success');
            contactForm.reset();
        });
    }

    // Formulário de Newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('newsletter-email').value;
            const name = document.getElementById('newsletter-name').value;
            
            const success = db.addNewsletter(email, name);
            
            if (success) {
                cart.showNotification('Inscrito na newsletter com sucesso!', 'success');
                newsletterForm.reset();
            } else {
                cart.showNotification('Este e-mail já está cadastrado.', 'error');
            }
        });
    }

    // Formulário de Feedback
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const feedbackData = {
                name: document.getElementById('feedback-name').value,
                rating: document.getElementById('feedback-rating').value,
                message: document.getElementById('feedback-message').value
            };

            db.addFeedback(feedbackData);
            cart.showNotification('Obrigado pelo seu feedback!', 'success');
            feedbackForm.reset();
        });
    }

    // ========================================
    // CHECKOUT
    // ========================================

    // Mostra/esconde campos de cartão
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('card-details');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'credit' || e.target.value === 'debit') {
                cardDetails.style.display = 'block';
                // Torna campos obrigatórios
                cardDetails.querySelectorAll('input').forEach(input => {
                    input.required = true;
                });
            } else {
                cardDetails.style.display = 'none';
                // Remove obrigatoriedade
                cardDetails.querySelectorAll('input').forEach(input => {
                    input.required = false;
                });
            }
        });
    });

    // Formata número do cartão
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Formata validade
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Formulário de Checkout
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            const deliveryInfo = {
                name: document.getElementById('checkout-name').value,
                address: document.getElementById('checkout-address').value,
                city: document.getElementById('checkout-city').value,
                zip: document.getElementById('checkout-zip').value
            };

            const order = processCheckout({
                paymentMethod,
                deliveryInfo
            });

            if (order) {
                checkoutModal.style.display = 'none';
                cart.showNotification('Pedido realizado com sucesso! Número: #' + order.id, 'success');
                checkoutForm.reset();
                
                // Atualiza produtos na página
                renderProducts();
            }
        });
    }

    function updateCheckoutTotal() {
        const checkoutTotal = document.getElementById('checkout-total');
        if (checkoutTotal) {
            checkoutTotal.textContent = `R$ ${cart.getTotal().toFixed(2)}`;
        }
    }

    // ========================================
    // ANIMAÇÕES E EFEITOS
    // ========================================

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Animação de scroll reveal (opcional)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observa seções para animação
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // ========================================
    // INICIALIZAÇÃO
    // ========================================

    renderProducts();

    // Mostra modal de cadastro após 5 segundos (primeira visita)
    if (!localStorage.getItem('visitedBefore')) {
        setTimeout(() => {
            if (!localStorage.getItem('userRegistered')) {
                signupModal.style.display = 'block';
            }
        }, 5000);
        localStorage.setItem('visitedBefore', 'true');
    }

    console.log('✅ Sistema totalmente carregado e funcional');
});

// ========================================
// UTILITÁRIOS GLOBAIS
// ========================================

// Função para formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para validar telefone
function validatePhone(phone) {
    const re = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Log de sistema
console.log('📱 Sistema Padaria do Bairro v1.0');
console.log('💾 Banco de dados:', db.getAllProducts().length, 'produtos');
console.log('🛒 Carrinho inicializado com', cart.items.length, 'itens');
