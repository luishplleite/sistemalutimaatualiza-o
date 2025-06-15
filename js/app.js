/**
 * TimePulse AI - Sistema de Gestão para Restaurantes
 * Arquivo: js/app.js
 * Descrição: JavaScript principal com integração Supabase e todas as funcionalidades
 */

// ===== VARIÁVEIS GLOBAIS =====
let supabaseClient = null;
let currentUser = null;
let currentRestaurant = null;
let realtimeSubscriptions = [];

// ===== INICIALIZAÇÃO DO SISTEMA =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Inicializando TimePulse AI...');
    
    try {
        // Verificar se config.js foi carregado
        if (!window.CONFIG) {
            throw new Error('Arquivo de configuração (config.js) não foi carregado');
        }
        
        // Inicializar Supabase
        await initializeSupabase();
        
        // Verificar autenticação
        await checkAuthentication();
        
        // Configurar página específica
        setupCurrentPage();
        
        console.log('✅ TimePulse AI carregado e pronto para uso!');
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showGlobalError('Erro de inicialização do sistema');
    }
});

// ===== CONFIGURAÇÃO DO SUPABASE =====
async function initializeSupabase() {
    try {
        console.log('🔧 Inicializando Supabase...');
        
        if (typeof window.supabase === 'undefined') {
            throw new Error('Biblioteca Supabase não carregada');
        }
        
        if (!window.CONFIG.SUPABASE_URL || !window.CONFIG.SUPABASE_ANON_KEY) {
            throw new Error('Credenciais do Supabase não encontradas no config.js');
        }
        
        if (window.CONFIG.SUPABASE_URL.includes('YOUR_SUPABASE_URL') || 
            window.CONFIG.SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')) {
            throw new Error('Configure as credenciais reais no arquivo config.js');
        }
        
        supabaseClient = window.supabase.createClient(
            window.CONFIG.SUPABASE_URL,
            window.CONFIG.SUPABASE_ANON_KEY
        );
        
        if (!supabaseClient) {
            throw new Error('Falha ao criar cliente Supabase');
        }
        
        // Configurar listener de mudanças de autenticação
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            console.log('🔄 Estado de autenticação mudou:', event);
            await handleAuthStateChange(event, session);
        });
        
        console.log('✅ Supabase inicializado com sucesso');
        console.log('📍 URL:', window.CONFIG.SUPABASE_URL);
        
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
        throw error;
    }
}

// ===== GERENCIAMENTO DE AUTENTICAÇÃO =====
async function checkAuthentication() {
    try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        
        if (error) {
            console.warn('⚠️ Erro ao verificar usuário:', error);
            return false;
        }
        
        if (user) {
            currentUser = user;
            
            // Verificar se o email foi confirmado
            if (!user.email_confirmed_at) {
                console.log('📧 Email não confirmado');
                
                // Redirecionar apenas se não estiver nas páginas de confirmação
                const currentPage = getCurrentPageName();
                if (!['email-confirmation', 'auth-success', 'login', 'cadastro_restaurante', 'index'].includes(currentPage)) {
                    window.location.href = 'email-confirmation.html';
                }
                return false;
            }
            
            // Carregar dados do restaurante
            await loadRestaurantData();
            
            // Configurar atualizações em tempo real
            setupRealtimeSubscriptions();
            
            console.log('✅ Usuário autenticado:', user.email);
            return true;
        } else {
            console.log('👤 Usuário não autenticado');
            
            // Redirecionar para login se não estiver em páginas públicas
            const currentPage = getCurrentPageName();
            if (!['login', 'cadastro_restaurante', 'index', 'email-confirmation', 'reset-password', 'auth-success'].includes(currentPage)) {
                window.location.href = 'login.html';
            }
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro na verificação de autenticação:', error);
        return false;
    }
}

// ===== CARREGAMENTO DE DADOS DO RESTAURANTE =====
async function loadRestaurantData() {
    try {
        if (!currentUser) return;
        
        const { data: restaurants, error } = await supabaseClient
            .from('restaurants')
            .select('*')
            .eq('owner_id', currentUser.id)
            .single();
        
        if (error) {
            console.warn('⚠️ Restaurante não encontrado:', error);
            
            // Se estiver no dashboard, redirecionar para cadastro
            const currentPage = getCurrentPageName();
            if (currentPage === 'dashboard') {
                window.location.href = 'cadastro_restaurante.html';
            }
            return;
        }
        
        currentRestaurant = restaurants;
        console.log('🏪 Restaurante carregado:', restaurants.name);
        
        // Atualizar UI com dados do restaurante
        updateRestaurantUI();
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados do restaurante:', error);
    }
}

// ===== CONFIGURAÇÃO DA PÁGINA ATUAL =====
function setupCurrentPage() {
    const currentPage = getCurrentPageName();
    console.log('📄 Configurando página:', currentPage);
    
    switch (currentPage) {
        case 'dashboard':
            setupDashboard();
            break;
        case 'gestao_pedidos':
            setupPedidos();
            break;
        case 'gestao_entregadores':
            setupEntregadores();
            break;
        case 'configuracoes':
            setupConfiguracoes();
            break;
        case 'relatorios':
            setupRelatorios();
            break;
        default:
            console.log('Página padrão, sem configuração específica');
    }
}

// ===== CONFIGURAÇÃO DO DASHBOARD =====
function setupDashboard() {
    if (typeof window.DashboardManager !== 'undefined') {
        window.dashboardManager = new DashboardManager();
    }
}

// ===== CONFIGURAÇÃO DE PEDIDOS =====
function setupPedidos() {
    if (typeof window.PedidosManager !== 'undefined') {
        window.pedidosManager = new PedidosManager();
    }
}

// ===== CONFIGURAÇÃO DE ENTREGADORES =====
function setupEntregadores() {
    if (typeof window.EntregadoresManager !== 'undefined') {
        window.entregadoresManager = new EntregadoresManager();
    }
}

// ===== CONFIGURAÇÃO DE CONFIGURAÇÕES =====
function setupConfiguracoes() {
    if (typeof window.ConfiguracoesManager !== 'undefined') {
        window.configuracoesManager = new ConfiguracoesManager();
    }
}

// ===== CONFIGURAÇÃO DE RELATÓRIOS =====
function setupRelatorios() {
    if (typeof window.RelatoriosManager !== 'undefined') {
        window.relatoriosManager = new RelatoriosManager();
    }
}

// ===== ATUALIZAÇÕES EM TEMPO REAL =====
function setupRealtimeSubscriptions() {
    if (!supabaseClient || !currentRestaurant) return;
    
    try {
        // Subscription para pedidos
        const pedidosSubscription = supabaseClient
            .channel('pedidos_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'orders',
                filter: `restaurant_id=eq.${currentRestaurant.id}`
            }, (payload) => {
                console.log('🔔 Novo evento de pedido:', payload);
                handleOrderUpdate(payload);
            })
            .subscribe();
        
        realtimeSubscriptions.push(pedidosSubscription);
        
        console.log('✅ Atualizações em tempo real configuradas');
        
    } catch (error) {
        console.error('❌ Erro ao configurar tempo real:', error);
    }
}

// ===== MANIPULADOR DE ATUALIZAÇÕES DE PEDIDOS =====
function handleOrderUpdate(payload) {
    // Disparar evento customizado para outros módulos
    const event = new CustomEvent('orderUpdate', { detail: payload });
    document.dispatchEvent(event);
    
    // Atualizar notificações
    updateNotifications();
}

// ===== MANIPULADOR DE MUDANÇAS DE AUTENTICAÇÃO =====
async function handleAuthStateChange(event, session) {
    switch (event) {
        case 'SIGNED_IN':
            console.log('✅ Usuário logado');
            currentUser = session.user;
            await loadRestaurantData();
            break;
            
        case 'SIGNED_OUT':
            console.log('👋 Usuário deslogado');
            currentUser = null;
            currentRestaurant = null;
            
            // Limpar subscriptions
            realtimeSubscriptions.forEach(sub => sub.unsubscribe());
            realtimeSubscriptions = [];
            
            // Redirecionar para login
            if (getCurrentPageName() !== 'login') {
                window.location.href = 'login.html';
            }
            break;
    }
}

// ===== ATUALIZAÇÃO DA UI DO RESTAURANTE =====
function updateRestaurantUI() {
    if (!currentRestaurant) return;
    
    // Atualizar nome do restaurante na sidebar
    const restaurantNameElements = document.querySelectorAll('[id*="restaurantName"], .restaurant-name');
    restaurantNameElements.forEach(element => {
        if (element) element.textContent = currentRestaurant.name;
    });
    
    // Atualizar cor primária se configurada
    if (currentRestaurant.primary_color) {
        document.documentElement.style.setProperty('--primary-color', currentRestaurant.primary_color);
    }
}

// ===== ATUALIZAÇÃO DE NOTIFICAÇÕES =====
function updateNotifications() {
    // Implementar sistema de notificações
    console.log('🔔 Atualizando notificações...');
}

// ===== UTILITÁRIOS =====
function getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    return page.replace('.html', '') || 'index';
}

// ===== MANIPULAÇÃO DE ERROS GLOBAIS =====
function showGlobalError(message) {
    console.error('❌ Erro:', message);
    
    // Criar ou atualizar elemento de erro
    let errorElement = document.getElementById('global-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'global-error';
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    }, 5000);
}

// ===== LOGOUT =====
async function logout() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('❌ Erro no logout:', error);
            return;
        }
        
        console.log('👋 Logout realizado com sucesso');
        window.location.href = 'login.html';
        
    } catch (error) {
        console.error('❌ Erro no logout:', error);
    }
}

// ===== CONFIGURAR EVENTOS GLOBAIS =====
document.addEventListener('click', function(e) {
    // Logout buttons
    if (e.target.matches('#logoutBtn, .logout-btn, [data-action="logout"]')) {
        e.preventDefault();
        logout();
    }
    
    // Sidebar toggle
    if (e.target.matches('[data-action="toggle-sidebar"]')) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-collapsed');
    }
});

// ===== DISPONIBILIZAR GLOBALMENTE =====
window.TimePulseAI = {
    supabase: () => supabaseClient,
    currentUser: () => currentUser,
    currentRestaurant: () => currentRestaurant,
    logout: logout,
    showGlobalError: showGlobalError
};