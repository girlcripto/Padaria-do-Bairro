# 🥖 Padaria do Bairro - Site Completo

## 📋 Descrição do Projeto

Site profissional e completo para a **Padaria do Bairro**, desenvolvido com HTML5 semântico, CSS3 e JavaScript ES6 puro. O site oferece uma experiência completa de e-commerce com carrinho de compras, checkout, sistema de encomendas e um bot sommelier inteligente.

## ✨ Funcionalidades Principais

### 🛒 E-commerce Completo
- **Carrinho de Compras**: Sistema completo com adição, remoção e atualização de quantidades
- **Checkout**: Processo de finalização com múltiplas formas de pagamento
- **Gestão de Estoque**: Banco de dados com 100 unidades iniciais para cada produto
- **Pagamento**: Suporte para cartão de crédito, débito, PIX e dinheiro

### 🤖 Sommelier Virtual
- Bot inteligente que sugere combinações de produtos
- Recomendações personalizadas baseadas em preferências
- Receitas criativas usando produtos da padaria
- Interface de chat interativa

### 📝 Formulários
1. **Contato Geral**: Para dúvidas e sugestões
2. **Newsletter**: Cadastro para receber ofertas exclusivas
3. **Feedback**: Avaliações e comentários dos clientes
4. **Encomendas Especiais**: Sistema completo para bolos de aniversário personalizados

### 🎨 Design Artesanal
- Paleta de cores: Creme (#F5F5DC), Café (#6F4E37) e Biscoito (#D2B48C)
- Design responsivo para todos os dispositivos
- Animações suaves e interface intuitiva
- Tipografia elegante e legível

### 📱 Recursos Adicionais
- **Botão WhatsApp Flutuante**: Contato direto com a padaria
- **Modal de Cadastro**: 10% de desconto para novos clientes
- **Tags Semânticas**: HTML5 totalmente semântico
- **Acessibilidade**: ARIA labels e navegação por teclado

## 🏗️ Estrutura do Projeto

```
webapp/
├── index.html              # Página principal (HTML5 semântico)
├── css/
│   └── style.css          # Estilos externos (tema artesanal)
├── js/
│   ├── database.js        # Gerenciamento de dados e estoque
│   ├── cart.js            # Sistema de carrinho e checkout
│   ├── sommelier.js       # Bot sommelier inteligente
│   └── main.js            # Script principal e integração
├── data/
│   └── database.json      # Dados iniciais (backup)
└── images/                # Diretório para imagens
```

## 📦 Produtos Disponíveis

### Pães (3 produtos)
- Pão Francês - R$ 0,50
- Baguete Artesanal - R$ 9,90
- Pão de Forma Integral - R$ 12,90

### Doces (3 produtos)
- Croissant de Chocolate - R$ 8,50
- Sonho Recheado - R$ 7,00
- Torta de Morango - R$ 45,00

### Salgados (3 produtos)
- Coxinha de Frango - R$ 6,50
- Pastel de Carne - R$ 5,50
- Empada de Palmito - R$ 7,50

### Cafeteria (1 produto)
- Café Espresso Premium - R$ 6,00

### Souvenirs (2 produtos)
- Caneca Padaria do Bairro - R$ 35,00
- Avental Artesanal - R$ 89,90

**Total: 12 produtos com estoque inicial de 100 unidades cada**

## 📊 Seções do Site

1. **Hero Section**: Destaque principal com call-to-actions
2. **Sobre Nós**: 4 parágrafos bem elaborados sobre a história da padaria
3. **Diferenciais (Aside)**: 
   - Acolhimento
   - Pão francês fresquinho a toda hora
   - Ambiente agradável com preview da fachada
4. **Cardápio**:
   - 2 listas ordenadas (Pães e Salgados)
   - 2 listas não ordenadas (Doces e Cafeteria)
   - Tabela com 10+ produtos
   - Cards interativos de produtos
5. **Sommelier Virtual**: Chat bot para combinações e receitas
6. **Encomendas**: Formulário para bolos personalizados
7. **Avaliações**: Comentários positivos de clientes
8. **Contato**: 3 formulários (Contato, Newsletter, Feedback)

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Tags semânticas (header, nav, main, section, article, aside, footer)
- **CSS3**: 
  - Flexbox e Grid Layout
  - Variáveis CSS
  - Animações e transições
  - Media queries para responsividade
- **JavaScript ES6**:
  - Classes
  - Arrow functions
  - Template literals
  - LocalStorage API
  - Fetch API (preparado para integração)
  - Async/await

## 💾 Sistema de Banco de Dados

O sistema utiliza **LocalStorage** como banco de dados, com as seguintes coleções:

- `products`: Produtos com estoque
- `users`: Usuários cadastrados
- `orders`: Pedidos realizados
- `customCakes`: Encomendas de bolos
- `newsletter`: Inscritos na newsletter
- `feedback`: Avaliações de clientes

## 🚀 Como Usar

### Instalação
1. Clone ou faça download do projeto
2. Abra o arquivo `index.html` em um navegador moderno
3. Não requer servidor - funciona localmente

### Navegação
- **Menu principal**: Acesso a todas as seções
- **Carrinho**: Clique no ícone do carrinho para ver itens
- **Produtos**: Adicione produtos com seletor de quantidade
- **Sommelier**: Digite suas preferências para receber sugestões

### Compras
1. Navegue pelo cardápio
2. Selecione quantidade desejada
3. Adicione ao carrinho
4. Clique no carrinho e finalize a compra
5. Preencha dados de entrega e pagamento
6. Confirme o pedido

### Encomendas Especiais
1. Acesse a seção "Encomendas"
2. Preencha o formulário de bolo personalizado
3. Envie a solicitação
4. Aguarde contato da padaria

## 🎯 Diferenciais Técnicos

### Responsividade
- Mobile First approach
- Breakpoints: 480px, 768px, 1024px
- Menu hambúrguer para dispositivos móveis
- Imagens e layouts adaptáveis

### Performance
- CSS e JS externos (não inline)
- Lazy loading de conteúdo
- LocalStorage para cache de dados
- Animações otimizadas com CSS

### Acessibilidade
- Estrutura semântica HTML5
- Alt text em ícones
- Contraste adequado de cores
- Navegação por teclado

### UX/UI
- Feedback visual em todas as ações
- Notificações toast para confirmações
- Validação de formulários em tempo real
- Animações suaves e não intrusivas

## 🔐 Segurança

**Nota**: Este é um projeto de demonstração. Em produção:
- Implemente autenticação JWT
- Use hash para senhas (bcrypt)
- Integre gateway de pagamento real
- Implemente HTTPS
- Adicione validação server-side

## 📞 Contato

- **Telefone**: (11) 98765-4321
- **Endereço**: Rua das Flores, 123 - Centro, São Paulo
- **Horário**: Segunda a Sábado: 6h às 20h | Domingo: 6h às 13h
- **WhatsApp**: Botão flutuante no canto inferior direito

## 👥 Créditos

Desenvolvido para a **Padaria do Bairro**  
Tradição artesanal desde 1985  

---

## 📝 Licença

Este projeto é propriedade da Padaria do Bairro. Todos os direitos reservados © 2024

---

**Desenvolvido com ❤️ e muito ☕**
