// ========================================
// DATABASE.JS - Gerenciamento de Dados
// ========================================

class Database {
    constructor() {
        this.storageKey = 'padariaDB';
        this.data = this.loadData();
    }

    // Carrega dados do localStorage ou inicializa com dados padrão
    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Dados iniciais
        const initialData = {
            products: [
                {
                    id: 1,
                    name: "Pão Francês",
                    category: "Pães",
                    description: "Pão francês tradicional, crocante por fora e macio por dentro",
                    price: 0.50,
                    stock: 100
                },
                {
                    id: 2,
                    name: "Croissant de Chocolate",
                    category: "Doces",
                    description: "Croissant folhado recheado com chocolate belga premium",
                    price: 8.50,
                    stock: 100
                },
                {
                    id: 3,
                    name: "Coxinha de Frango",
                    category: "Salgados",
                    description: "Coxinha artesanal com recheio cremoso de frango e catupiry",
                    price: 6.50,
                    stock: 100
                },
                {
                    id: 4,
                    name: "Baguete Artesanal",
                    category: "Pães",
                    description: "Baguete francesa tradicional feita com fermentação natural",
                    price: 9.90,
                    stock: 100
                },
                {
                    id: 5,
                    name: "Sonho Recheado",
                    category: "Doces",
                    description: "Sonho fofinho recheado com creme de baunilha e açúcar",
                    price: 7.00,
                    stock: 100
                },
                {
                    id: 6,
                    name: "Pastel de Carne",
                    category: "Salgados",
                    description: "Pastel crocante com recheio de carne moída temperada",
                    price: 5.50,
                    stock: 100
                },
                {
                    id: 7,
                    name: "Pão de Forma Integral",
                    category: "Pães",
                    description: "Pão de forma integral rico em fibras, perfeito para sanduíches",
                    price: 12.90,
                    stock: 100
                },
                {
                    id: 8,
                    name: "Torta de Morango",
                    category: "Doces",
                    description: "Torta cremosa com morangos frescos e chantilly",
                    price: 45.00,
                    stock: 100
                },
                {
                    id: 9,
                    name: "Empada de Palmito",
                    category: "Salgados",
                    description: "Empada delicada com recheio de palmito e requeijão",
                    price: 7.50,
                    stock: 100
                },
                {
                    id: 10,
                    name: "Café Espresso Premium",
                    category: "Cafeteria",
                    description: "Café espresso de grãos selecionados, encorpado e aromático",
                    price: 6.00,
                    stock: 100
                },
                {
                    id: 11,
                    name: "Caneca Padaria do Bairro",
                    category: "Souvenirs",
                    description: "Caneca de cerâmica personalizada com logo da padaria",
                    price: 35.00,
                    stock: 100
                },
                {
                    id: 12,
                    name: "Avental Artesanal",
                    category: "Souvenirs",
                    description: "Avental de tecido premium com bordado da Padaria do Bairro",
                    price: 89.90,
                    stock: 100
                }
            ],
            users: [],
            orders: [],
            customCakes: [],
            newsletter: [],
            feedback: []
        };
        
        this.saveData(initialData);
        return initialData;
    }

    // Salva dados no localStorage
    saveData(data = this.data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        this.data = data;
    }

    // ========== PRODUTOS ==========
    
    getAllProducts() {
        return this.data.products;
    }

    getProductById(id) {
        return this.data.products.find(p => p.id === id);
    }

    getProductsByCategory(category) {
        return this.data.products.filter(p => p.category === category);
    }

    updateProductStock(id, quantity) {
        const product = this.getProductById(id);
        if (product && product.stock >= quantity) {
            product.stock -= quantity;
            this.saveData();
            return true;
        }
        return false;
    }

    checkStock(id, quantity) {
        const product = this.getProductById(id);
        return product && product.stock >= quantity;
    }

    // ========== USUÁRIOS ==========
    
    addUser(userData) {
        const user = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password, // Em produção, use hash
            registeredAt: new Date().toISOString(),
            discount: true // Desconto de cadastro
        };
        this.data.users.push(user);
        this.saveData();
        return user;
    }

    getUserByEmail(email) {
        return this.data.users.find(u => u.email === email);
    }

    // ========== PEDIDOS ==========
    
    addOrder(orderData) {
        const order = {
            id: Date.now(),
            userId: orderData.userId || null,
            items: orderData.items,
            total: orderData.total,
            paymentMethod: orderData.paymentMethod,
            deliveryInfo: orderData.deliveryInfo,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        this.data.orders.push(order);
        this.saveData();
        return order;
    }

    getOrdersByUser(userId) {
        return this.data.orders.filter(o => o.userId === userId);
    }

    // ========== ENCOMENDAS DE BOLOS ==========
    
    addCustomCake(cakeData) {
        const cake = {
            id: Date.now(),
            name: cakeData.name,
            phone: cakeData.phone,
            email: cakeData.email,
            deliveryDate: cakeData.deliveryDate,
            type: cakeData.type,
            weight: cakeData.weight,
            message: cakeData.message || '',
            details: cakeData.details || '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        this.data.customCakes.push(cake);
        this.saveData();
        return cake;
    }

    // ========== NEWSLETTER ==========
    
    addNewsletter(email, name) {
        if (!this.data.newsletter.find(n => n.email === email)) {
            this.data.newsletter.push({
                id: Date.now(),
                email,
                name,
                subscribedAt: new Date().toISOString()
            });
            this.saveData();
            return true;
        }
        return false;
    }

    // ========== FEEDBACK ==========
    
    addFeedback(feedbackData) {
        const feedback = {
            id: Date.now(),
            name: feedbackData.name,
            rating: feedbackData.rating,
            message: feedbackData.message,
            createdAt: new Date().toISOString()
        };
        this.data.feedback.push(feedback);
        this.saveData();
        return feedback;
    }

    // ========== UTILIDADES ==========
    
    resetDatabase() {
        localStorage.removeItem(this.storageKey);
        this.data = this.loadData();
    }

    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.saveData(data);
            return true;
        } catch (e) {
            console.error('Erro ao importar dados:', e);
            return false;
        }
    }
}

// Instância global do banco de dados
const db = new Database();

// Log inicial
console.log('🗄️ Banco de dados inicializado');
console.log('📦 Produtos disponíveis:', db.getAllProducts().length);
