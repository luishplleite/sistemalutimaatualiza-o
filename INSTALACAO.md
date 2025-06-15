# Instruções de Instalação e Configuração - TimePulse AI

## 📋 Pré-requisitos

- VPS com Ubuntu 18.04+ ou CentOS 7+
- Apache ou Nginx instalado
- Domínio configurado (opcional, mas recomendado)
- Conta no Supabase (gratuita)

## 🚀 Instalação na VPS

### 1. Preparação do Servidor

```bash
# Atualizar o sistema
sudo apt update && sudo apt upgrade -y

# Instalar Apache (se não estiver instalado)
sudo apt install apache2 -y

# Habilitar Apache
sudo systemctl enable apache2
sudo systemctl start apache2

# Instalar utilitários necessários
sudo apt install unzip curl -y
```

### 2. Upload dos Arquivos

#### Opção A: Via SCP/SFTP
```bash
# No seu computador local, comprima os arquivos
zip -r timepulse-ai.zip timepulse-ai/

# Envie para a VPS
scp timepulse-ai.zip usuario@seu-servidor:/var/www/html/

# Na VPS, extraia os arquivos
cd /var/www/html/
sudo unzip timepulse-ai.zip
sudo chown -R www-data:www-data timepulse-ai/
sudo chmod -R 755 timepulse-ai/
```

#### Opção B: Via Git (se você subir para um repositório)
```bash
cd /var/www/html/
sudo git clone https://github.com/seu-usuario/timepulse-ai.git
sudo chown -R www-data:www-data timepulse-ai/
sudo chmod -R 755 timepulse-ai/
```

### 3. Configuração do Apache

Crie um arquivo de configuração para o site:

```bash
sudo nano /etc/apache2/sites-available/timepulse-ai.conf
```

Adicione o seguinte conteúdo:

```apache
<VirtualHost *:80>
    ServerName seudominio.com
    ServerAlias www.seudominio.com
    DocumentRoot /var/www/html/timepulse-ai
    
    <Directory /var/www/html/timepulse-ai>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Configurações para SPA (Single Page Application)
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>
    
    ErrorLog ${APACHE_LOG_DIR}/timepulse-ai_error.log
    CustomLog ${APACHE_LOG_DIR}/timepulse-ai_access.log combined
</VirtualHost>
```

Habilite o site e módulos necessários:

```bash
# Habilitar módulos
sudo a2enmod rewrite
sudo a2enmod ssl

# Habilitar o site
sudo a2ensite timepulse-ai.conf

# Desabilitar site padrão (opcional)
sudo a2dissite 000-default.conf

# Reiniciar Apache
sudo systemctl restart apache2
```

### 4. Configuração de SSL (Recomendado)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-apache -y

# Obter certificado SSL
sudo certbot --apache -d seudominio.com -d www.seudominio.com

# Configurar renovação automática
sudo crontab -e
# Adicione a linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

## ⚙️ Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Clique em "New Project"
4. Preencha os dados do projeto
5. Aguarde a criação (pode levar alguns minutos)

### 2. Configurar Banco de Dados

1. Vá para **SQL Editor** no painel do Supabase
2. Execute o script SQL completo do arquivo `SUPABASE_SETUP.md`
3. Verifique se todas as tabelas foram criadas corretamente

### 3. Obter Credenciais

1. Vá para **Settings** > **API**
2. Copie a **Project URL** e **anon public key**

### 4. Configurar Credenciais nos Arquivos

Edite os seguintes arquivos na VPS e substitua as credenciais:

```bash
# Editar arquivos HTML
sudo nano /var/www/html/timepulse-ai/login.html
sudo nano /var/www/html/timepulse-ai/cadastro_restaurante.html
sudo nano /var/www/html/timepulse-ai/js/app.js
```

Substitua:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Por:
```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anonima-aqui';
```

## 🔧 Configurações Adicionais

### 1. Configuração de CORS (se necessário)

Se você tiver problemas de CORS, adicione ao arquivo `.htaccess`:

```bash
sudo nano /var/www/html/timepulse-ai/.htaccess
```

```apache
# Habilitar CORS
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization"

# Configurações de cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>
```

### 2. Configuração de Firewall

```bash
# Configurar UFW (se estiver usando)
sudo ufw allow 'Apache Full'
sudo ufw allow ssh
sudo ufw enable
```

### 3. Monitoramento e Logs

```bash
# Verificar logs do Apache
sudo tail -f /var/log/apache2/timepulse-ai_error.log
sudo tail -f /var/log/apache2/timepulse-ai_access.log

# Verificar status do Apache
sudo systemctl status apache2
```

## 🧪 Teste da Instalação

1. Acesse `http://seudominio.com` ou `http://ip-da-vps`
2. Você deve ver a página de login do TimePulse AI
3. Teste o cadastro de um novo restaurante
4. Verifique se os dados estão sendo salvos no Supabase

## 🔒 Segurança

### 1. Configurações Básicas de Segurança

```bash
# Ocultar versão do Apache
sudo nano /etc/apache2/conf-available/security.conf
# Altere para:
ServerTokens Prod
ServerSignature Off

# Habilitar configuração
sudo a2enconf security
sudo systemctl restart apache2
```

### 2. Backup Automático

Crie um script de backup:

```bash
sudo nano /usr/local/bin/backup-timepulse.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/timepulse-ai"
SOURCE_DIR="/var/www/html/timepulse-ai"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/timepulse-ai_$DATE.tar.gz $SOURCE_DIR

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "timepulse-ai_*.tar.gz" -mtime +7 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-timepulse.sh

# Adicionar ao crontab para backup diário
sudo crontab -e
# Adicione:
0 2 * * * /usr/local/bin/backup-timepulse.sh
```

## 🚨 Solução de Problemas

### Problema: Página não carrega
- Verifique se o Apache está rodando: `sudo systemctl status apache2`
- Verifique os logs: `sudo tail -f /var/log/apache2/error.log`
- Verifique permissões: `ls -la /var/www/html/timepulse-ai/`

### Problema: Erro de conexão com Supabase
- Verifique se as credenciais estão corretas
- Verifique se o projeto Supabase está ativo
- Verifique o console do navegador para erros JavaScript

### Problema: Erro 403 Forbidden
- Verifique permissões dos arquivos: `sudo chmod -R 755 /var/www/html/timepulse-ai/`
- Verifique propriedade: `sudo chown -R www-data:www-data /var/www/html/timepulse-ai/`

### Problema: SSL não funciona
- Verifique se o Certbot foi executado corretamente
- Verifique configuração do Apache: `sudo apache2ctl configtest`

## 📞 Suporte

Para suporte adicional:
1. Verifique a documentação do Supabase
2. Consulte os logs de erro
3. Verifique as configurações de rede e firewall

## 🔄 Atualizações

Para atualizar o sistema:
1. Faça backup dos arquivos atuais
2. Substitua os arquivos pelos novos
3. Verifique se as configurações do Supabase ainda estão corretas
4. Teste todas as funcionalidades

