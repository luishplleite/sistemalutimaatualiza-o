// TimePulse AI - Configurações Centralizadas
// Este arquivo centraliza todas as configurações do projeto

// Configurações principais
window.CONFIG = {
    // Credenciais do Supabase - CORRIGIDAS
    SUPABASE_URL: 'https://jutordddhlzpjjwqrzmw.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1dG9yZGRkaGx6cGpqd3Fyem13Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTkyNjA0OCwiZXhwIjoyMDY1NTAyMDQ4fQ.gxOPRDsWQRL_vQUg1veMcxcnSzyiHuDo3yDC9PSOcbQ',
    
    // Configurações da aplicação
    APP_NAME: 'TimePulse AI',
    APP_VERSION: '1.0.0',
    APP_DESCRIPTION: 'Plataforma completa para gestão de delivery',
    
    // URLs de redirecionamento e navegação
    URLS: {
        // Páginas principais
        home: 'index.html',
        login: 'login.html',
        dashboard: 'dashboard.html',
        cadastroRestaurante: 'cadastro_restaurante.html',
        
        // Gestão
        pedidos: 'gestao_pedidos.html',
        cozinha: 'cozinha.html',
        cardapio: 'cardapio.html',
        entregadores: 'gestao_entregadores.html',
        clientes: 'clientes.html',
        
        // Relatórios
        relatorios: 'relatorios.html',
        vendas: 'vendas.html',
        financeiro: 'financeiro.html',
        
        // Sistema
        configuracoes: 'configuracoes.html',
        ajuda: 'ajuda.html',
        
        // Processo de autenticação
        emailConfirmation: 'email-confirmation.html',
        resetPassword: 'reset-password.html',
        authSuccess: 'auth-success.html',
        
        // Admin
        adminDashboard: 'admin/dashboard.html'
    },
    
    // URLs completas para redirecionamento do Supabase
    REDIRECT_URLS: {
        emailConfirmation: window.location.origin + '/email-confirmation.html',
        passwordReset: window.location.origin + '/reset-password.html',
        authSuccess: window.location.origin + '/auth-success.html',
        login: window.location.origin + '/login.html',
        dashboard: window.location.origin + '/dashboard.html'
    },
    
    // Configurações de desenvolvimento
    DEBUG_MODE: true,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
    REALTIME_ENABLED: true,
    
    // Configurações de UI
    SIDEBAR_COLLAPSED_BREAKPOINT: 768,
    AUTO_REFRESH_INTERVAL: 30000, // 30 segundos
    
    // Configurações de notificações
    NOTIFICATION_TIMEOUT: 5000,
    SOUND_ENABLED: true,
    
    // Configurações de dados
    ORDERS_PER_PAGE: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    
    // Status de pedidos
    ORDER_STATUS: {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        PREPARING: 'preparing',
        READY: 'ready',
        OUT_FOR_DELIVERY: 'out_for_delivery',
        DELIVERED: 'delivered',
        CANCELLED: 'cancelled'
    },
    
    // Status de entregadores
    DELIVERY_STATUS: {
        AVAILABLE: 'available',
        BUSY: 'busy',
        OFFLINE: 'offline'
    },
    
    // Tipos de pagamento
    PAYMENT_METHODS: {
        MONEY: 'money',
        CARD: 'card',
        PIX: 'pix',
        ONLINE: 'online'
    }
};

// Log de inicialização
console.log('✅ Configurações do TimePulse AI carregadas');
console.log('📱 Versão:', window.CONFIG.APP_VERSION);
console.log('🔧 Modo Debug:', window.CONFIG.DEBUG_MODE ? 'Ativado' : 'Desativado');