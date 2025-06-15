# TimePulse AI - Plataforma de Gestão de Delivery

## 📖 Sobre o Projeto

TimePulse AI é uma plataforma SaaS completa para gestão de delivery, desenvolvida especificamente para restaurantes, lanchonetes e mercados. A solução oferece um painel centralizado para gerenciar todo o ciclo de pedidos, desde o recebimento até a entrega e pagamento.

## ✨ Funcionalidades Principais

### 🏪 Gestão de Restaurante
- Dashboard com estatísticas em tempo real
- Cadastro e configuração do estabelecimento
- Personalização visual (cores, logo)
- Configuração de horários de funcionamento
- Gestão de taxa de entrega e tempo de preparo

### 📦 Gestão de Pedidos
- Recebimento de pedidos em tempo real
- Controle de status (Novo → Aceito → Preparo → Pronto → Entrega → Entregue)
- Tela da cozinha simplificada
- Histórico completo de pedidos
- Notificações sonoras e visuais

### 🏍️ Gestão de Entregadores
- Cadastro de entregadores próprios e terceirizados
- Sistema de créditos para motoboys terceiros
- Controle de saldo e solicitações de saque
- Atribuição automática de entregas
- Monitoramento de status (Ativo, Ocupado, Inativo)

### 🍔 Gestão de Cardápio
- Organização por categorias
- Controle de preços e disponibilidade
- Upload de imagens dos produtos
- Descrições detalhadas

### 📊 Relatórios e Análises
- Vendas por período
- Performance dos entregadores
- Produtos mais vendidos
- Faturamento e estatísticas

### 🔧 Configurações Avançadas
- Integração com Asaas (pagamentos)
- Notificações por WhatsApp e e-mail
- Configurações de segurança
- Backup automático

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e responsividade
- **JavaScript** - Interatividade e lógica do cliente
- **Font Awesome** - Ícones
- **Chart.js** - Gráficos e estatísticas

### Backend/Banco de Dados
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança de dados
- **Real-time subscriptions** - Atualizações em tempo real

### Integrações
- **Asaas API** - Processamento de pagamentos
- **WhatsApp API** - Notificações
- **SMTP** - Envio de e-mails

## 📁 Estrutura do Projeto

```
timepulse-ai/
├── css/
│   ├── styles.css          # Estilos globais
│   └── dashboard.css       # Estilos específicos do dashboard
├── js/
│   └── app.js             # JavaScript principal com integração Supabase
├── assets/
│   └── icons/             # Ícones e imagens
├── pages/                 # Páginas adicionais (se necessário)
├── login.html             # Página de login
├── cadastro_restaurante.html  # Cadastro de novos restaurantes
├── dashboard.html         # Dashboard principal
├── gestao_pedidos.html    # Gestão de pedidos
├── gestao_entregadores.html   # Gestão de entregadores
├── configuracoes.html     # Configurações do sistema
├── SUPABASE_SETUP.md      # Instruções de configuração do Supabase
├── INSTALACAO.md          # Instruções de instalação na VPS
└── README.md              # Este arquivo
```

## 🚀 Instalação Rápida

### 1. Configurar Supabase
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute o script SQL do arquivo `SUPABASE_SETUP.md`
4. Copie as credenciais (URL e chave anônima)

### 2. Configurar na VPS
1. Faça upload dos arquivos para `/var/www/html/timepulse-ai/`
2. Configure o Apache/Nginx
3. Substitua as credenciais do Supabase nos arquivos
4. Configure SSL (recomendado)

### 3. Primeiro Acesso
1. Acesse a URL do seu site
2. Clique em "Cadastrar Restaurante"
3. Preencha os dados do seu estabelecimento
4. Faça login e comece a usar!

## 📋 Pré-requisitos

- VPS com Ubuntu 18.04+ ou CentOS 7+
- Apache ou Nginx
- Domínio configurado (opcional)
- Conta no Supabase (gratuita)

## 🔐 Segurança

- **Autenticação** via Supabase Auth
- **Row Level Security (RLS)** no banco de dados
- **HTTPS** obrigatório em produção
- **Isolamento multi-tenant** por restaurante
- **Validação** de dados no frontend e backend

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🎨 Personalização

Cada restaurante pode personalizar:
- **Cor primária** do painel
- **Logo** do estabelecimento
- **Configurações** de funcionamento
- **Taxa de entrega** e tempo de preparo

## 🔄 Atualizações em Tempo Real

- Novos pedidos aparecem instantaneamente
- Status de pedidos atualiza automaticamente
- Notificações em tempo real
- Sincronização entre múltiplos dispositivos

## 📊 Dashboard Inteligente

- **Estatísticas** do dia atual
- **Gráficos** de vendas
- **Status** dos entregadores
- **Pedidos** pendentes em destaque

## 🏍️ Sistema de Entregadores

### Entregadores Próprios
- Cadastro completo
- Controle de salário
- Gestão de status

### Entregadores Terceirizados
- Sistema de créditos
- Comissão por entrega
- Solicitações de saque
- Aprovação de pagamentos

## 🔌 Integrações Disponíveis

### Asaas (Pagamentos)
- Processamento de pagamentos
- Sistema de créditos
- Transferências automáticas

### WhatsApp API
- Notificações de novos pedidos
- Atualizações de status
- Comunicação com clientes

### E-mail SMTP
- Confirmações de pedidos
- Relatórios automáticos
- Notificações administrativas

## 📈 Escalabilidade

O sistema foi projetado para crescer com seu negócio:
- **Multi-tenant** - Suporta múltiplos restaurantes
- **Cloud-native** - Hospedado na nuvem
- **API-first** - Fácil integração com outros sistemas
- **Modular** - Funcionalidades podem ser ativadas conforme necessário

## 🆘 Suporte

### Documentação
- `INSTALACAO.md` - Guia completo de instalação
- `SUPABASE_SETUP.md` - Configuração do banco de dados
- Comentários no código para desenvolvedores

### Solução de Problemas
- Logs detalhados
- Mensagens de erro claras
- Validações em tempo real

## 🔮 Roadmap Futuro

### Fase 2 - App Mobile
- Aplicativo para entregadores
- Notificações push
- GPS tracking

### Fase 3 - Funcionalidades Avançadas
- Relatórios avançados
- Integração com iFood/Uber Eats
- Sistema de fidelidade
- Cupons de desconto

### Fase 4 - IA e Automação
- Previsão de demanda
- Otimização de rotas
- Chatbot para atendimento
- Análise preditiva

## 📄 Licença

Este projeto é proprietário e desenvolvido para uso comercial. Todos os direitos reservados.

## 👥 Equipe

Desenvolvido com ❤️ para revolucionar o setor de delivery no Brasil.

---

**TimePulse AI** - Transformando a gestão de delivery com tecnologia de ponta! 🚀

