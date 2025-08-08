# 🔐 Crede## 👥 Usuários de Teste Disponíveis

### **Usuário de Teste:**
1. **Cedrique Guedes** - `cedriquepereira@gmail.com` (Membro ativo)

**Nota**: Os usuários de teste iniciais foram removidos para manter o banco limpo. Acesso Admin - TopCars Valley

## 👨‍💼 Usuário Administrador

**Email:** `admin@topcarsvalley.com`  
**Senha:** `TopCars2025!`  
**Função:** Administrador (ADMIN)

---

## � Usuários de Teste Disponíveis

### **Usuários Ativos:**
1. **Carlos Silva** - `carlos.silva@email.com` (Membro ativo)
2. **Maria Santos** - `maria.santos@email.com` (Membro ativo)

### **Usuários Inativos:**
1. **João Oliveira** - `joao.oliveira@email.com` (Membro inativo)
2. **Ana Costa** - `ana.costa@email.com` (Convite pendente)

---

## �🚀 Como Testar

### 1. **Acessar o Sistema**
   - Vá para: http://localhost:3000/login
   - Digite as credenciais do admin acima
   - Clique em "Entrar"

### 2. **Gerenciamento de Usuários**
   - No dashboard, clique em "Gerenciar Usuários"
   - Visualize a lista completa de usuários
   - Use a pesquisa para filtrar por nome ou email
   - **Ativar/Desativar usuários** clicando no botão de status
   - **Criar novos convites** com o botão "+ Criar Convite"

### 3. **Funcionalidades Disponíveis**
   - ✅ **Visualizar Usuários** - Lista paginada com detalhes
   - ✅ **Pesquisar** - Por nome ou email
   - ✅ **Ativar/Desativar** - Alterar status de usuários (exceto admins)
   - ✅ **Criar Convites** - Gerar links de convite para novos usuários
   - ✅ **Copiar Links** - Links de convite com um clique
   - ✅ **Estatísticas** - Eventos e convites por usuário

---

## 🔒 Segurança Implementada

### **Autenticação JWT**
- Token válido por 7 dias
- Armazenado no localStorage
- Verificação automática de permissões

### **Proteção de Rotas**
- Páginas admin protegidas automaticamente
- Redirecionamento para login se não autenticado
- Verificação de nível de acesso (ADMIN vs MEMBER)

### **Hash de Senha**
- Senha criptografada com bcrypt (12 rounds)
- Nunca armazenada em texto plano no banco

---

## 📊 Dados do Sistema

### **Banco de Dados**
- ✅ **6 Eventos** criados automaticamente
- ✅ **4 Parceiros** cadastrados
- ✅ **1 Usuário Admin** configurado
- ✅ **Estrutura completa** de relacionamentos

### **API Endpoints**
- `POST /api/auth/login` - Autenticação
- `GET /api/events` - Lista eventos
- Outros endpoints em desenvolvimento

---

## 🎯 Próximos Passos

1. **Teste o login admin** com as credenciais fornecidas
2. **Explore o dashboard** e suas funcionalidades
3. **Feedback** sobre melhorias necessárias
4. **Desenvolvimento** das páginas de gerenciamento específicas

---

## ⚡ Comandos Úteis

```bash
# Resetar dados do banco (se necessário)
npx prisma db seed

# Visualizar dados no Prisma Studio
npx prisma studio

# Gerar novo token JWT (se necessário)
# A chave está em .env.local
```

---

**Status:** ✅ **Sistema funcional e pronto para teste**
