# Configuração do Supabase para TimePulse AI

## 1. Criação do Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project"
3. Escolha sua organização
4. Defina um nome para o projeto (ex: "timepulse-ai")
5. Defina uma senha segura para o banco de dados
6. Escolha a região mais próxima do seu público
7. Clique em "Create new project"

## 2. Configuração das Credenciais

Após a criação do projeto, você encontrará as credenciais em:
- **Settings** > **API** > **Project URL** (SUPABASE_URL)
- **Settings** > **API** > **anon public** (SUPABASE_ANON_KEY)

Substitua essas credenciais nos arquivos HTML:
```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anonima-aqui';
```

## 3. Schema do Banco de Dados

Execute os seguintes comandos SQL no **SQL Editor** do Supabase:

### 3.1 Tabela de Restaurantes
```sql
CREATE TABLE restaurants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    owner_name VARCHAR(255),
    owner_cpf VARCHAR(14),
    owner_phone VARCHAR(20),
    cnpj VARCHAR(18),
    business_type VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    primary_color VARCHAR(7) DEFAULT '#28a745',
    delivery_fee DECIMAL(10,2) DEFAULT 5.00,
    preparation_time INTEGER DEFAULT 30,
    delivery_radius DECIMAL(5,2) DEFAULT 5.0,
    minimum_order DECIMAL(10,2) DEFAULT 0.00,
    business_hours JSONB,
    notification_settings JSONB,
    asaas_config JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 Tabela de Clientes
```sql
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    zip_code VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.3 Tabela de Categorias de Produtos
```sql
CREATE TABLE product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.4 Tabela de Produtos
```sql
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.5 Tabela de Entregadores
```sql
CREATE TABLE deliverers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    motorcycle_plate VARCHAR(10),
    motorcycle_model VARCHAR(100),
    type VARCHAR(20) NOT NULL CHECK (type IN ('own', 'third-party')),
    salary DECIMAL(10,2),
    commission DECIMAL(5,2),
    balance DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'busy')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.6 Tabela de Pedidos
```sql
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    deliverer_id UUID REFERENCES deliverers(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'novo' CHECK (status IN ('novo', 'aceito', 'preparo', 'pronto', 'entrega', 'entregue', 'rejeitado', 'cancelado')),
    delivery_address TEXT,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.7 Tabela de Itens do Pedido
```sql
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.8 Tabela de Solicitações de Saque
```sql
CREATE TABLE withdrawal_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    deliverer_id UUID REFERENCES deliverers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    rejection_reason TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Configuração de RLS (Row Level Security)

Execute os seguintes comandos para configurar a segurança:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Políticas para restaurantes
CREATE POLICY "Usuários podem ver seus próprios restaurantes" ON restaurants
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Usuários podem atualizar seus próprios restaurantes" ON restaurants
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Usuários podem inserir restaurantes" ON restaurants
    FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Políticas para clientes
CREATE POLICY "Restaurantes podem gerenciar seus clientes" ON customers
    FOR ALL USING (restaurant_id IN (
        SELECT id FROM restaurants WHERE owner_id = auth.uid()
    ));

-- Políticas para categorias de produtos
CREATE POLICY "Restaurantes podem gerenciar suas categorias" ON product_categories
    FOR ALL USING (restaurant_id IN (
        SELECT id FROM restaurants WHERE owner_id = auth.uid()
    ));

-- Políticas para produtos
CREATE POLICY "Restaurantes podem gerenciar seus produtos" ON products
    FOR ALL USING (restaurant_id IN (
        SELECT id FROM restaurants WHERE owner_id = auth.uid()
    ));

-- Políticas para entregadores
CREATE POLICY "Restaurantes podem gerenciar seus entregadores" ON deliverers
    FOR ALL USING (restaurant_id IN (
        SELECT id FROM restaurants WHERE owner_id = auth.uid()
    ));

-- Políticas para pedidos
CREATE POLICY "Restaurantes podem gerenciar seus pedidos" ON orders
    FOR ALL USING (restaurant_id IN (
        SELECT id FROM restaurants WHERE owner_id = auth.uid()
    ));

-- Políticas para itens do pedido
CREATE POLICY "Acesso via pedidos do restaurante" ON order_items
    FOR ALL USING (order_id IN (
        SELECT id FROM orders WHERE restaurant_id IN (
            SELECT id FROM restaurants WHERE owner_id = auth.uid()
        )
    ));

-- Políticas para solicitações de saque
CREATE POLICY "Restaurantes podem gerenciar saques" ON withdrawal_requests
    FOR ALL USING (restaurant_id IN (
        SELECT id FROM restaurants WHERE owner_id = auth.uid()
    ));
```

## 5. Funções e Triggers

### 5.1 Função para atualizar updated_at
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### 5.2 Triggers para updated_at
```sql
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliverers_updated_at BEFORE UPDATE ON deliverers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 6. Configuração de Autenticação

1. Vá para **Authentication** > **Settings**
2. Configure as seguintes opções:
   - **Site URL**: URL do seu site (ex: https://seudominio.com)
   - **Redirect URLs**: Adicione as URLs de redirecionamento necessárias
   - **Email Templates**: Personalize os templates de e-mail se necessário

## 7. Configuração de Storage (Opcional)

Para upload de imagens:

1. Vá para **Storage**
2. Crie um bucket chamado "restaurant-assets"
3. Configure as políticas de acesso conforme necessário

## 8. Dados de Exemplo (Opcional)

Para testar a aplicação, você pode inserir alguns dados de exemplo:

```sql
-- Inserir categorias de exemplo (após criar um restaurante)
INSERT INTO product_categories (restaurant_id, name, description) VALUES
('seu-restaurant-id', 'Lanches', 'Hambúrgueres e sanduíches'),
('seu-restaurant-id', 'Bebidas', 'Refrigerantes e sucos'),
('seu-restaurant-id', 'Sobremesas', 'Doces e sobremesas');

-- Inserir produtos de exemplo
INSERT INTO products (restaurant_id, category_id, name, description, price) VALUES
('seu-restaurant-id', 'categoria-id', 'Hambúrguer Clássico', 'Pão, carne, queijo, alface e tomate', 15.90),
('seu-restaurant-id', 'categoria-id', 'Coca-Cola 350ml', 'Refrigerante gelado', 4.50);
```

## 9. Próximos Passos

1. Configure as credenciais nos arquivos HTML
2. Execute o schema do banco de dados
3. Configure as políticas de segurança
4. Teste a aplicação localmente
5. Faça o deploy na sua VPS

## 10. Observações Importantes

- Mantenha suas credenciais do Supabase seguras
- Configure backups regulares do banco de dados
- Monitore o uso da API para evitar limites
- Configure alertas para erros e problemas de performance

