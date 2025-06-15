/**
 * TimePulse AI - Sistema de Gestão para Restaurantes
 * Arquivo: js/app.js
 * Descrição: JavaScript principal com integração Supabase e todas as funcionalidades
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    SUPABASE_URL: 'YOUR_SUPABASE_URL', // Substituir pela URL real do Supabase
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY', // Substituir pela chave real do Supabase
    DEBUG_MODE: true,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
    REALTIME_ENABLED: true
};

// ===== VARIÁVEIS GLOBAIS =====
let supabase = null;
let currentUser = null;
let currentRestaurant = null;
let realtimeSubscriptions = [];

// ===== INICIALIZAÇÃO DO SISTEMA =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Inicializando TimePulse AI...');
    
    try {
        // Inicializar Supabase
        await initializeSupabase();
        
        // Verificar autenticação
        await checkAuthentication();
        
        // Configurar página específica
        setupCurrentPage();
        
        console.log('✅ Sistema inicializado com sucesso');
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showGlobalError('Erro de inicialização do sistema');
    }
});

// ===== CONFIGURAÇÃO DO SUPABASE =====
async function initializeSupabase() {
    try {
        if (typeof window.supabase === 'undefined') {
            console.error('❌ Biblioteca Supabase não carregada');
            throw new Error('Supabase não está disponível');
        }
        
        supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        
        if (!supabase) {
            throw new Error('Falha ao inicializar cliente Supabase');
        }
        
        // Configurar listener de mudanças de autenticação
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔄 Estado de autenticação mudou:', event);
            await handleAuthStateChange(event, session);
        });
        
        console.log('✅ Supabase inicializado');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
        throw error;
    }
}

// ===== GERENCIAMENTO DE AUTENTICAÇÃO =====
async function checkAuthentication() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
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
                if (!['email-confirmation', 'auth-success'].includes(currentPage)) {
                    redirectToEmailConfirmation();
                }
                return false;
            }
            
            // Carregar dados do restaurante
            await loadRestaurantData();
            
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('❌ Erro na verificação de autenticação:', error);
        return false;
    }
}

async function handleAuthStateChange(event, session) {
    console.log('🔄 Processando mudança de autenticação:', event);
    
    switch (event) {
        case 'SIGNED_IN':
            currentUser = session?.user || null;
            await loadRestaurantData();
            break;
            
        case 'SIGNED_OUT':
            currentUser = null;
            currentRestaurant = null;
            clearRealtimeSubscriptions();
            
            // Redirecionar para login se não estiver em páginas públicas
            const currentPage = getCurrentPageName();
            const publicPages = ['login', 'cadastro_restaurante', 'index', 'email-confirmation', 'reset-password', 'auth-success'];
            
            if (!publicPages.includes(currentPage)) {
                window.location.href = 'login.html';
            }
            break;
            
        case 'TOKEN_REFRESHED':
            console.log('🔄 Token atualizado');
            break;
    }
}

// ===== DADOS DO RESTAURANTE =====
async function loadRestaurantData() {
    if (!currentUser) return null;
    
    try {
        const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
        
        if (error) {
            console.error('❌ Erro ao carregar dados do restaurante:', error);
            return null;
        }
        
        currentRestaurant = data;
        console.log('✅ Dados do restaurante carregados');
        
        // Aplicar personalização visual se disponível
        if (data.primary_color) {
            applyThemeColor(data.primary_color);
        }
        
        return data;
        
    } catch (error) {
        console.error('❌ Erro inesperado ao carregar restaurante:', error);
        return null;
    }
}

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

// Cadastro de novo usuário
async function signUp(email, password, userData) {
    try {
        console.log('📝 Iniciando cadastro para:', email);
        
        // Validar dados
        if (!validateSignUpData(email, password, userData)) {
            throw new Error('Dados de cadastro inválidos');
        }
        
        // Criar conta no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    restaurant_name: userData.name
                }
            }
        });
        
        if (authError) {
            throw authError;
        }
        
        if (!authData.user) {
            throw new Error('Falha ao criar usuário');
        }
        
        // Inserir dados do restaurante
        const { error: restaurantError } = await supabase
            .from('restaurants')
            .insert([{
                user_id: authData.user.id,
                name: userData.name,
                email: email,
                phone: userData.phone,
                address: userData.address,
                delivery_fee: parseFloat(userData.deliveryFee) || 0,
                preparation_time: parseInt(userData.preparationTime) || 30,
                primary_color: '#3b82f6',
                active: true
            }]);
        
        if (restaurantError) {
            console.error('❌ Erro ao inserir dados do restaurante:', restaurantError);
            throw new Error('Erro ao salvar dados do restaurante');
        }
        
        console.log('✅ Cadastro realizado com sucesso');
        
        return {
            success: true,
            user: authData.user,
            message: 'Cadastro realizado! Verifique seu email para confirmar a conta.'
        };
        
    } catch (error) {
        console.error('❌ Erro no cadastro:', error);
        return {
            success: false,
            error: error.message || 'Erro no cadastro'
        };
    }
}

// Login de usuário
async function signIn(email, password, rememberMe = false) {
    try {
        console.log('🔑 Tentando fazer login:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            throw error;
        }
        
        // Verificar confirmação de email
        if (!data.user.email_confirmed_at) {
            throw new Error('Email não confirmado. Verifique sua caixa de entrada.');
        }
        
        // Salvar email se solicitado
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        console.log('✅ Login realizado com sucesso');
        
        return {
            success: true,
            user: data.user,
            session: data.session
        };
        
    } catch (error) {
        console.error('❌ Erro no login:', error);
        return {
            success: false,
            error: error.message || 'Erro no login'
        };
    }
}

// Logout de usuário
async function signOut() {
    try {
        console.log('👋 Fazendo logout...');
        
        // Limpar subscriptions
        clearRealtimeSubscriptions();
        
        // Logout no Supabase
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            throw error;
        }
        
        // Limpar dados locais
        currentUser = null;
        currentRestaurant = null;
        
        console.log('✅ Logout realizado com sucesso');
        
        // Redirecionar para login
        window.location.href = 'login.html';
        
    } catch (error) {
        console.error('❌ Erro no logout:', error);
        showGlobalError('Erro ao fazer logout');
    }
}

// Reset de senha
async function resetPassword(email) {
    try {
        console.log('🔄 Enviando reset de senha para:', email);
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`
        });
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Email de reset enviado');
        
        return {
            success: true,
            message: 'Email de recuperação enviado! Verifique sua caixa de entrada.'
        };
        
    } catch (error) {
        console.error('❌ Erro no reset de senha:', error);
        return {
            success: false,
            error: error.message || 'Erro ao enviar email de recuperação'
        };
    }
}

// Atualizar senha
async function updatePassword(newPassword) {
    try {
        console.log('🔄 Atualizando senha...');
        
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Senha atualizada com sucesso');
        
        return {
            success: true,
            message: 'Senha atualizada com sucesso!'
        };
        
    } catch (error) {
        console.error('❌ Erro ao atualizar senha:', error);
        return {
            success: false,
            error: error.message || 'Erro ao atualizar senha'
        };
    }
}

// ===== GESTÃO DE PEDIDOS =====

// Carregar pedidos
async function loadOrders(filters = {}) {
    if (!currentRestaurant) return [];
    
    try {
        let query = supabase
            .from('orders')
            .select(`
                *,
                delivery_persons (
                    id,
                    name,
                    phone,
                    status
                )
            `)
            .eq('restaurant_id', currentRestaurant.id)
            .order('created_at', { ascending: false });
        
        // Aplicar filtros
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        
        if (filters.dateFrom) {
            query = query.gte('created_at', filters.dateFrom);
        }
        
        if (filters.dateTo) {
            query = query.lte('created_at', filters.dateTo);
        }
        
        const { data, error } = await query;
        
        if (error) {
            throw error;
        }
        
        console.log(`✅ Carregados ${data.length} pedidos`);
        return data;
        
    } catch (error) {
        console.error('❌ Erro ao carregar pedidos:', error);
        return [];
    }
}

// Criar novo pedido
async function createOrder(orderData) {
    if (!currentRestaurant) {
        throw new Error('Restaurante não carregado');
    }
    
    try {
        console.log('📦 Criando novo pedido...');
        
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                restaurant_id: currentRestaurant.id,
                customer_name: orderData.customerName,
                customer_phone: orderData.customerPhone,
                customer_address: orderData.customerAddress,
                items: orderData.items,
                total_amount: orderData.totalAmount,
                delivery_fee: orderData.deliveryFee || currentRestaurant.delivery_fee,
                status: 'novo',
                notes: orderData.notes || ''
            }])
            .select()
            .single();
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Pedido criado:', data.id);
        
        // Emitir evento para atualizações em tempo real
        emitOrderUpdate('created', data);
        
        return {
            success: true,
            order: data
        };
        
    } catch (error) {
        console.error('❌ Erro ao criar pedido:', error);
        return {
            success: false,
            error: error.message || 'Erro ao criar pedido'
        };
    }
}

// Atualizar status do pedido
async function updateOrderStatus(orderId, newStatus, deliveryPersonId = null) {
    try {
        console.log(`🔄 Atualizando pedido ${orderId} para ${newStatus}`);
        
        const updateData = {
            status: newStatus,
            updated_at: new Date().toISOString()
        };
        
        if (deliveryPersonId) {
            updateData.delivery_person_id = deliveryPersonId;
        }
        
        const { data, error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', orderId)
            .eq('restaurant_id', currentRestaurant.id)
            .select()
            .single();
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Status do pedido atualizado');
        
        // Emitir evento para atualizações em tempo real
        emitOrderUpdate('updated', data);
        
        return {
            success: true,
            order: data
        };
        
    } catch (error) {
        console.error('❌ Erro ao atualizar pedido:', error);
        return {
            success: false,
            error: error.message || 'Erro ao atualizar pedido'
        };
    }
}

// ===== GESTÃO DE ENTREGADORES =====

// Carregar entregadores
async function loadDeliveryPersons() {
    if (!currentRestaurant) return [];
    
    try {
        const { data, error } = await supabase
            .from('delivery_persons')
            .select('*')
            .eq('restaurant_id', currentRestaurant.id)
            .order('name');
        
        if (error) {
            throw error;
        }
        
        console.log(`✅ Carregados ${data.length} entregadores`);
        return data;
        
    } catch (error) {
        console.error('❌ Erro ao carregar entregadores:', error);
        return [];
    }
}

// Criar entregador
async function createDeliveryPerson(personData) {
    if (!currentRestaurant) {
        throw new Error('Restaurante não carregado');
    }
    
    try {
        console.log('🏍️ Criando entregador...');
        
        const { data, error } = await supabase
            .from('delivery_persons')
            .insert([{
                restaurant_id: currentRestaurant.id,
                name: personData.name,
                phone: personData.phone,
                email: personData.email,
                type: personData.type || 'own',
                status: 'active',
                vehicle_type: personData.vehicleType,
                commission_rate: personData.commissionRate || 0,
                balance: 0
            }])
            .select()
            .single();
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Entregador criado:', data.id);
        
        return {
            success: true,
            deliveryPerson: data
        };
        
    } catch (error) {
        console.error('❌ Erro ao criar entregador:', error);
        return {
            success: false,
            error: error.message || 'Erro ao criar entregador'
        };
    }
}

// ===== ESTATÍSTICAS E DASHBOARD =====

// Carregar estatísticas do dashboard
async function loadDashboardStats() {
    if (!currentRestaurant) return null;
    
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Estatísticas de hoje
        const { data: todayOrders, error: ordersError } = await supabase
            .from('orders')
            .select('total_amount, status')
            .eq('restaurant_id', currentRestaurant.id)
            .gte('created_at', today);
        
        if (ordersError) throw ordersError;
        
        // Entregadores ativos
        const { data: activeDelivery, error: deliveryError } = await supabase
            .from('delivery_persons')
            .select('id')
            .eq('restaurant_id', currentRestaurant.id)
            .eq('status', 'active');
        
        if (deliveryError) throw deliveryError;
        
        // Calcular estatísticas
        const stats = {
            todayOrders: todayOrders.length,
            todayRevenue: todayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
            activeDeliveryPersons: activeDelivery.length,
            pendingOrders: todayOrders.filter(order => ['novo', 'aceito', 'preparo'].includes(order.status)).length
        };
        
        console.log('✅ Estatísticas carregadas:', stats);
        return stats;
        
    } catch (error) {
        console.error('❌ Erro ao carregar estatísticas:', error);
        return null;
    }
}

// ===== TEMPO REAL =====

// Configurar atualizações em tempo real
function setupRealtimeUpdates() {
    if (!CONFIG.REALTIME_ENABLED || !currentRestaurant) return;
    
    try {
        // Subscription para pedidos
        const ordersChannel = supabase
            .channel('orders-changes')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'orders',
                    filter: `restaurant_id=eq.${currentRestaurant.id}`
                },
                (payload) => {
                    console.log('🔄 Mudança em pedidos:', payload);
                    handleOrderRealTimeUpdate(payload);
                }
            )
            .subscribe();
        
        realtimeSubscriptions.push(ordersChannel);
        
        console.log('✅ Atualizações em tempo real configuradas');
        
    } catch (error) {
        console.error('❌ Erro ao configurar tempo real:', error);
    }
}

// Limpar subscriptions
function clearRealtimeSubscriptions() {
    realtimeSubscriptions.forEach(subscription => {
        try {
            supabase.removeChannel(subscription);
        } catch (error) {
            console.warn('⚠️ Erro ao remover subscription:', error);
        }
    });
    
    realtimeSubscriptions = [];
    console.log('🧹 Subscriptions removidas');
}

// ===== UTILITÁRIOS =====

// Obter nome da página atual
function getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    return page.replace('.html', '') || 'index';
}

// Configurar página específica
function setupCurrentPage() {
    const currentPage = getCurrentPageName();
    console.log('📄 Página atual:', currentPage);
    
    switch (currentPage) {
        case 'dashboard':
            setupDashboard();
            break;
        case 'gestao_pedidos':
            setupOrdersPage();
            break;
        case 'gestao_entregadores':
            setupDeliveryPage();
            break;
        case 'login':
            setupLoginPage();
            break;
        case 'cadastro_restaurante':
            setupSignupPage();
            break;
    }
    
    // Configurar atualizações em tempo real se autenticado
    if (currentUser && currentRestaurant) {
        setupRealtimeUpdates();
    }
}

// Aplicar cor do tema
function applyThemeColor(color) {
    try {
        document.documentElement.style.setProperty('--primary-color', color);
        console.log('🎨 Cor do tema aplicada:', color);
    } catch (error) {
        console.warn('⚠️ Erro ao aplicar cor do tema:', error);
    }
}

// Validar dados de cadastro
function validateSignUpData(email, password, userData) {
    if (!email || !email.includes('@')) {
        showGlobalError('Email inválido');
        return false;
    }
    
    if (!password || password.length < 6) {
        showGlobalError('Senha deve ter pelo menos 6 caracteres');
        return false;
    }
    
    if (!userData.name || userData.name.trim().length < 2) {
        showGlobalError('Nome do restaurante deve ter pelo menos 2 caracteres');
        return false;
    }
    
    if (!userData.phone || userData.phone.length < 10) {
        showGlobalError('Telefone inválido');
        return false;
    }
    
    return true;
}

// Mostrar erro global
function showGlobalError(message) {
    console.error('❌ Erro:', message);
    
    // Criar ou atualizar elemento de erro
    let errorContainer = document.getElementById('globalErrorContainer');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'globalErrorContainer';
        errorContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee;
            border: 1px solid #fcc;
            color: #c33;
            padding: 15px;
            border-radius: 5px;
            z-index: 9999;
            max-width: 300px;
        `;
        document.body.appendChild(errorContainer);
    }
    
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }, 5000);
}

// Redirecionar para confirmação de email
function redirectToEmailConfirmation() {
    const email = currentUser?.email || '';
    window.location.href = `email-confirmation.html?email=${encodeURIComponent(email)}`;
}

// ===== CONFIGURAÇÕES ESPECÍFICAS DE PÁGINAS =====

// Setup do Dashboard
function setupDashboard() {
    console.log('🏠 Configurando dashboard...');
    
    // Verificar se usuário está autenticado
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Carregar dados iniciais
    loadDashboardData();
}

// Setup da página de pedidos
function setupOrdersPage() {
    console.log('📦 Configurando página de pedidos...');
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Carregar pedidos
    loadOrdersData();
}

// Setup da página de entregadores
function setupDeliveryPage() {
    console.log('🏍️ Configurando página de entregadores...');
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Carregar entregadores
    loadDeliveryData();
}

// Setup da página de login
function setupLoginPage() {
    console.log('🔑 Configurando página de login...');
    
    // Se já estiver autenticado, redirecionar
    if (currentUser && currentUser.email_confirmed_at) {
        window.location.href = 'dashboard.html';
    }
}

// Setup da página de cadastro
function setupSignupPage() {
    console.log('📝 Configurando página de cadastro...');
    
    // Se já estiver autenticado, redirecionar
    if (currentUser && currentUser.email_confirmed_at) {
        window.location.href = 'dashboard.html';
    }
}

// ===== EVENTOS PERSONALIZADOS =====

// Emitir atualização de pedido
function emitOrderUpdate(action, order) {
    const event = new CustomEvent('orderUpdate', {
        detail: { action, order }
    });
    
    document.dispatchEvent(event);
}

// Handler para atualizações em tempo real
function handleOrderRealTimeUpdate(payload) {
    const event = new CustomEvent('realtimeOrderUpdate', {
        detail: payload
    });
    
    document.dispatchEvent(event);
}

// ===== FUNÇÕES AUXILIARES PARA AS PÁGINAS =====

// Carregar dados do dashboard
async function loadDashboardData() {
    try {
        const stats = await loadDashboardStats();
        
        if (stats && typeof updateDashboardUI === 'function') {
            updateDashboardUI(stats);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados do dashboard:', error);
    }
}

// Carregar dados de pedidos
async function loadOrdersData() {
    try {
        const orders = await loadOrders();
        
        if (typeof updateOrdersUI === 'function') {
            updateOrdersUI(orders);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados de pedidos:', error);
    }
}

// Carregar dados de entregadores
async function loadDeliveryData() {
    try {
        const deliveryPersons = await loadDeliveryPersons();
        
        if (typeof updateDeliveryUI === 'function') {
            updateDeliveryUI(deliveryPersons);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados de entregadores:', error);
    }
}

// ===== EXPORTAR FUNÇÕES GLOBAIS =====
window.TimePulseAI = {
    // Autenticação
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    
    // Pedidos
    loadOrders,
    createOrder,
    updateOrderStatus,
    
    // Entregadores
    loadDeliveryPersons,
    createDeliveryPerson,
    
    // Dashboard
    loadDashboardStats,
    
    // Utilitários
    getCurrentUser: () => currentUser,
    getCurrentRestaurant: () => currentRestaurant,
    getSupabase: () => supabase
};

console.log('✅ TimePulse AI carregado e pronto para uso!');