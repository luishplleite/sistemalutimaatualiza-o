// TimePulse AI - Configurações Centralizadas
// Este arquivo centraliza todas as configurações do projeto

// Configurações principais
window.CONFIG = {
    // Credenciais do Supabase - SUBSTITUA PELAS SUAS CREDENCIAIS REAIS
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
    
    // Configurações de autenticação e e-mail
    AUTH_CONFIG: {
        // Confirmação de e-mail
        emailConfirmation: {
            enabled: true,
            resendCooldown: 60, // segundos
            maxResendAttempts: 5,
            tokenExpiry: 86400 // 24 horas em segundos
        },
        
        // Recuperação de senha
        passwordReset: {
            enabled: true,
            tokenExpiry: 3600, // 1 hora em segundos
            resendCooldown: 120 // 2 minutos
        },
        
        // Sessão
        session: {
            jwtExpiry: 3600, // 1 hora
            refreshTokenExpiry: 604800, // 7 dias
            rememberMeDuration: 2592000 // 30 dias
        }
    },
    
    // Configurações de validação
    VALIDATION: {
        password: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false
        },
        phone: {
            pattern: /^\(\d{2}\) \d{5}-\d{4}$/,
            placeholder: '(00) 00000-0000'
        },
        cpf: {
            pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            placeholder: '000.000.000-00'
        },
        cnpj: {
            pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
            placeholder: '00.000.000/0000-00'
        }
    },
    
    // Configurações de paginação
    PAGINATION: {
        defaultPageSize: 20,
        maxPageSize: 100,
        pageSizes: [10, 20, 50, 100]
    },
    
    // Configurações de upload
    UPLOAD: {
        maxFileSize: 2 * 1024 * 1024, // 2MB
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
        allowedDocumentTypes: ['application/pdf', 'text/csv', 'application/vnd.ms-excel'],
        imageCompression: {
            quality: 0.8,
            maxWidth: 1200,
            maxHeight: 1200
        }
    },
    
    // Configurações de notificação
    NOTIFICATIONS: {
        defaultTimeout: 5000,
        errorTimeout: 10000,
        successTimeout: 3000,
        warningTimeout: 7000,
        position: 'top-right'
    },
    
    // Configurações de UI
    UI: {
        theme: {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            successColor: '#28a745',
            warningColor: '#ffc107',
            errorColor: '#dc3545',
            infoColor: '#17a2b8'
        },
        animations: {
            duration: 300,
            easing: 'ease-in-out'
        },
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        }
    },
    
    // Configurações de formatação
    FORMATTING: {
        currency: {
            locale: 'pt-BR',
            currency: 'BRL',
            minimumFractionDigits: 2
        },
        date: {
            locale: 'pt-BR',
            dateStyle: 'short',
            timeStyle: 'short'
        },
        phone: {
            mask: '(00) 00000-0000',
            placeholder: '(00) 00000-0000'
        }
    },
    
    // Mensagens padrão do sistema
    MESSAGES: {
        errors: {
            network: 'Erro de conexão. Verifique sua internet e tente novamente.',
            unauthorized: 'Sessão expirada. Faça login novamente.',
            forbidden: 'Você não tem permissão para realizar esta ação.',
            notFound: 'Recurso não encontrado.',
            serverError: 'Erro interno do servidor. Tente novamente mais tarde.',
            validation: 'Por favor, verifique os dados inseridos.',
            emailNotConfirmed: 'E-mail não confirmado. Verifique sua caixa de entrada.',
            invalidCredentials: 'E-mail ou senha incorretos.',
            rateLimitExceeded: 'Muitas tentativas. Aguarde alguns minutos.'
        },
        success: {
            login: 'Login realizado com sucesso!',
            logout: 'Logout realizado com sucesso!',
            registration: 'Cadastro realizado com sucesso!',
            emailSent: 'E-mail enviado com sucesso!',
            passwordReset: 'Senha redefinida com sucesso!',
            emailConfirmed: 'E-mail confirmado com sucesso!',
            profileUpdated: 'Perfil atualizado com sucesso!'
        },
        info: {
            loading: 'Carregando...',
            processing: 'Processando...',
            saving: 'Salvando...',
            sending: 'Enviando...',
            confirming: 'Confirmando...'
        }
    },
    
    // Configurações específicas do TimePulse AI
    BUSINESS: {
        // Tipos de estabelecimento
        businessTypes: [
            'Restaurante',
            'Lanchonete',
            'Pizzaria',
            'Hamburgueria',
            'Açaíteria',
            'Sorveteria',
            'Padaria',
            'Confeitaria',
            'Bar',
            'Café',
            'Food Truck',
            'Delivery',
            'Outro'
        ],
        
        // Estados brasileiros
        states: [
            { code: 'AC', name: 'Acre' },
            { code: 'AL', name: 'Alagoas' },
            { code: 'AP', name: 'Amapá' },
            { code: 'AM', name: 'Amazonas' },
            { code: 'BA', name: 'Bahia' },
            { code: 'CE', name: 'Ceará' },
            { code: 'DF', name: 'Distrito Federal' },
            { code: 'ES', name: 'Espírito Santo' },
            { code: 'GO', name: 'Goiás' },
            { code: 'MA', name: 'Maranhão' },
            { code: 'MT', name: 'Mato Grosso' },
            { code: 'MS', name: 'Mato Grosso do Sul' },
            { code: 'MG', name: 'Minas Gerais' },
            { code: 'PA', name: 'Pará' },
            { code: 'PB', name: 'Paraíba' },
            { code: 'PR', name: 'Paraná' },
            { code: 'PE', name: 'Pernambuco' },
            { code: 'PI', name: 'Piauí' },
            { code: 'RJ', name: 'Rio de Janeiro' },
            { code: 'RN', name: 'Rio Grande do Norte' },
            { code: 'RS', name: 'Rio Grande do Sul' },
            { code: 'RO', name: 'Rondônia' },
            { code: 'RR', name: 'Roraima' },
            { code: 'SC', name: 'Santa Catarina' },
            { code: 'SP', name: 'São Paulo' },
            { code: 'SE', name: 'Sergipe' },
            { code: 'TO', name: 'Tocantins' }
        ],
        
        // Configurações padrão para novos restaurantes
        defaults: {
            primaryColor: '#28a745',
            deliveryFee: 5.00,
            preparationTime: 30,
            deliveryRadius: 5.0,
            minimumOrder: 0.00,
            businessHours: {
                monday: { open: '11:00', close: '23:00', enabled: true },
                tuesday: { open: '11:00', close: '23:00', enabled: true },
                wednesday: { open: '11:00', close: '23:00', enabled: true },
                thursday: { open: '11:00', close: '23:00', enabled: true },
                friday: { open: '11:00', close: '23:00', enabled: true },
                saturday: { open: '11:00', close: '23:00', enabled: true },
                sunday: { open: '11:00', close: '23:00', enabled: false }
            }
        }
    },
    
    // Configurações de desenvolvimento
    DEBUG: {
        enabled: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        logLevel: 'info', // 'error', 'warn', 'info', 'debug'
        showApiCalls: false,
        mockData: false
    }
};

// Funções utilitárias de configuração
window.CONFIG.utils = {
    // Obter URL completa
    getFullUrl: function(path) {
        return window.location.origin + '/' + path.replace(/^\//, '');
    },
    
    // Obter configuração de tema
    getThemeColors: function() {
        return window.CONFIG.UI.theme;
    },
    
    // Verificar se está em modo debug
    isDebugMode: function() {
        return window.CONFIG.DEBUG.enabled;
    },
    
    // Formatar moeda brasileira
    formatCurrency: function(value) {
        return new Intl.NumberFormat(window.CONFIG.FORMATTING.currency.locale, {
            style: 'currency',
            currency: window.CONFIG.FORMATTING.currency.currency,
            minimumFractionDigits: window.CONFIG.FORMATTING.currency.minimumFractionDigits
        }).format(value);
    },
    
    // Formatar data
    formatDate: function(date) {
        return new Intl.DateTimeFormat(window.CONFIG.FORMATTING.date.locale, {
            dateStyle: window.CONFIG.FORMATTING.date.dateStyle,
            timeStyle: window.CONFIG.FORMATTING.date.timeStyle
        }).format(new Date(date));
    },
    
    // Validar e-mail
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validar senha
    isValidPassword: function(password) {
        const config = window.CONFIG.VALIDATION.password;
        
        if (password.length < config.minLength) return false;
        if (config.requireUppercase && !/[A-Z]/.test(password)) return false;
        if (config.requireLowercase && !/[a-z]/.test(password)) return false;
        if (config.requireNumbers && !/\d/.test(password)) return false;
        if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
        
        return true;
    },
    
    // Log condicional
    log: function(level, message, data = null) {
        if (!window.CONFIG.DEBUG.enabled) return;
        
        const levels = ['error', 'warn', 'info', 'debug'];
        const configLevel = levels.indexOf(window.CONFIG.DEBUG.logLevel);
        const messageLevel = levels.indexOf(level);
        
        if (messageLevel <= configLevel) {
            const timestamp = new Date().toISOString();
            const prefix = `[${timestamp}] [${level.toUpperCase()}] TimePulse AI:`;
            
            if (data) {
                console[level](prefix, message, data);
            } else {
                console[level](prefix, message);
            }
        }
    }
};

// Inicialização automática de configurações
document.addEventListener('DOMContentLoaded', function() {
    if (window.CONFIG.DEBUG.enabled) {
        console.log('🔧 TimePulse AI - Configurações carregadas:', window.CONFIG);
    }
    
    // Aplicar tema se necessário
    if (window.CONFIG.UI.theme) {
        document.documentElement.style.setProperty('--primary-color', window.CONFIG.UI.theme.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', window.CONFIG.UI.theme.secondaryColor);
    }
});

// Para compatibilidade com código legado, criar alias
window.SUPABASE_CONFIG = {
    url: window.CONFIG.SUPABASE_URL,
    anonKey: window.CONFIG.SUPABASE_ANON_KEY
};

console.log('✅ TimePulse AI - Configurações carregadas e prontas para uso!');