// ========================================
// SOMMELIER.JS - Bot Inteligente
// ========================================

class SommelierBot {
    constructor() {
        this.chatContainer = document.getElementById('sommelier-chat');
        this.conversationHistory = [];
        this.systemPrompt = `Você é o Sommelier Virtual da Padaria do Bairro, um especialista amigável e experiente em combinações culinárias.

Produtos disponíveis na padaria:
- Pães: Pão Francês, Baguete Artesanal, Pão de Forma Integral
- Doces: Croissant de Chocolate, Sonho Recheado, Torta de Morango
- Salgados: Coxinha de Frango, Pastel de Carne, Empada de Palmito
- Cafeteria: Café Espresso Premium, Cappuccino, Chocolate Quente, Chás
- Souvenirs: Caneca Padaria do Bairro, Avental Artesanal

Sua missão:
1. Sugerir combinações deliciosas de produtos da padaria
2. Criar receitas criativas usando os produtos disponíveis
3. Recomendar o melhor para cada momento do dia
4. Dar dicas de harmonização com cafés e bebidas
5. Ser sempre amigável, criativo e útil

Responda de forma natural, calorosa e sempre mencione produtos da Padaria do Bairro. Use emojis quando apropriado para deixar a conversa mais amigável.`;
    }

    async sendMessage(userMessage) {
        // Adiciona mensagem do usuário ao chat
        this.addMessageToChat(userMessage, 'user');

        // Adiciona ao histórico
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        // Mostra indicador de digitação
        this.showTypingIndicator();

        try {
            // Chama API OpenAI
            const response = await this.callOpenAI(userMessage);
            
            // Remove indicador de digitação
            this.removeTypingIndicator();

            // Adiciona resposta do bot
            this.addMessageToChat(response, 'bot');

            // Adiciona ao histórico
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });

        } catch (error) {
            console.error('Erro ao chamar API:', error);
            this.removeTypingIndicator();
            
            // Fallback: resposta offline
            const fallbackResponse = this.getFallbackResponse(userMessage);
            this.addMessageToChat(fallbackResponse, 'bot');
        }
    }

    async callOpenAI(message) {
        // Prepara mensagens para a API
        const messages = [
            { role: 'system', content: this.systemPrompt },
            ...this.conversationHistory.slice(-6) // Últimas 6 mensagens para contexto
        ];

        try {
            // Tenta usar a API OpenAI configurada
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    temperature: 0.8,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error('API call failed');
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            // Se falhar, usa fallback
            throw error;
        }
    }

    getFallbackResponse(userMessage) {
        const messageLower = userMessage.toLowerCase();

        // Respostas baseadas em palavras-chave
        if (messageLower.includes('café da manhã') || messageLower.includes('manhã')) {
            return `☕ Para um café da manhã perfeito, recomendo:

🥐 Croissant de Chocolate + Café Espresso Premium
🥖 Pão Francês quentinho com manteiga + Suco Natural
🍞 Pão de Forma Integral com geleia + Cappuccino

Essa combinação vai te dar energia para começar o dia com o pé direito! Que tal adicionar uma Torta de Morango para adoçar ainda mais? 😊`;
        }

        if (messageLower.includes('lanche da tarde') || messageLower.includes('tarde')) {
            return `🍰 Para um lanche da tarde delicioso:

✨ Sonho Recheado + Café Espresso
🥐 Croissant de Chocolate + Cappuccino Cremoso
🍓 Fatia de Torta de Morango + Chá Artesanal

Perfeito para aquela pausa relaxante! Nossos doces são irresistíveis! 😋`;
        }

        if (messageLower.includes('croissant')) {
            return `🥐 Ah, o Croissant de Chocolate! Uma das nossas estrelas!

Sugestões de combinação:
☕ Croissant + Café Espresso = Clássico francês
🥛 Croissant + Chocolate Quente = Conforto total
🍓 Croissant + Cappuccino = Sofisticação

Receita especial: Corte o croissant ao meio, adicione creme de avelã e morangos frescos. Sirva com café gelado! 🌟`;
        }

        if (messageLower.includes('pão francês') || messageLower.includes('pao frances')) {
            return `🥖 Nosso Pão Francês é quentinho a toda hora!

Combinações tradicionais:
• Pão Francês + manteiga + café = Clássico brasileiro
• Pão Francês + requeijão cremoso = Irresistível
• Pão Francês + geleia de morango + cappuccino = Doce tentação

Dica do chef: Faça um sanduíche com nosso Pão Francês, queijo derretido e um toque de orégano. Acompanhe com Café Espresso! 🔥`;
        }

        if (messageLower.includes('receita')) {
            return `👨‍🍳 Que tal esta receita especial usando nossos produtos?

🌟 **Bruschetta da Padaria do Bairro**

Ingredientes:
- Baguete Artesanal fatiada
- Tomates frescos
- Queijo mussarela
- Manjericão

Modo de preparo:
1. Corte a Baguete em fatias
2. Torre levemente
3. Adicione tomates picados, queijo e manjericão
4. Leve ao forno por 5 minutos

Sirva com Café Espresso para uma combinação perfeita! 😍`;
        }

        // Resposta padrão
        return `😊 Olá! Estou aqui para ajudar você a descobrir as melhores combinações da nossa padaria!

Posso sugerir:
🥐 Combinações para café da manhã
☕ Harmonizações com cafés especiais
🍰 Receitas criativas com nossos produtos
🥖 As melhores escolhas para cada momento

O que você gostaria de saber hoje?`;
    }

    addMessageToChat(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;

        const icon = document.createElement('i');
        icon.className = type === 'bot' ? 'fas fa-robot' : 'fas fa-user';

        const textP = document.createElement('p');
        textP.innerHTML = message.replace(/\n/g, '<br>');

        messageDiv.appendChild(icon);
        messageDiv.appendChild(textP);

        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-message bot-message typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <i class="fas fa-robot"></i>
            <p>
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </p>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .typing-indicator p span {
                animation: typing 1.4s infinite;
                opacity: 0;
            }
            .typing-indicator p span:nth-child(2) {
                animation-delay: 0.2s;
            }
            .typing-indicator p span:nth-child(3) {
                animation-delay: 0.4s;
            }
            @keyframes typing {
                0%, 60%, 100% { opacity: 0; }
                30% { opacity: 1; }
            }
        `;
        if (!document.getElementById('typing-animation-style')) {
            style.id = 'typing-animation-style';
            document.head.appendChild(style);
        }

        this.chatContainer.appendChild(indicator);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}

// Instância global do sommelier
const sommelier = new SommelierBot();

// Event listeners para o sommelier
document.addEventListener('DOMContentLoaded', () => {
    const sommelierInput = document.getElementById('sommelier-input');
    const sommelierSendBtn = document.getElementById('sommelier-send');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Enviar mensagem
    const sendMessage = () => {
        const message = sommelierInput.value.trim();
        if (message) {
            sommelier.sendMessage(message);
            sommelierInput.value = '';
        }
    };

    if (sommelierSendBtn) {
        sommelierSendBtn.addEventListener('click', sendMessage);
    }

    if (sommelierInput) {
        sommelierInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Sugestões rápidas
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            sommelier.sendMessage(query);
        });
    });
});

console.log('🤖 Sommelier Bot inicializado');
