# Instruções para Deploy das Migrations - Sistema de Reset de Senha

## ⚠️ Importante
Os campos `resetToken` e `resetTokenExpiry` foram adicionados ao schema do Prisma, mas as APIs estão funcionando em modo simulação até que a migration seja aplicada ao banco de dados.

## Passos para Ativar o Sistema Completo:

### 1. Aplicar Migration no Banco de Dados
```bash
# No terminal, execute:
npx prisma db push
# ou
npx prisma migrate deploy
```

### 2. Regenerar o Prisma Client
```bash
npx prisma generate
```

### 3. Descomentarie o código das APIs
Nos seguintes arquivos, descomente o código marcado com comentários:

#### `/src/app/api/auth/forgot-password/route.ts`
- Descomente as linhas 35-42 (salvamento do token no banco)
- Comente/remova a linha 44 (console.log)

#### `/src/app/api/auth/validate-reset-token/route.ts`
- Descomente as linhas 19-33 (busca do usuário por token)
- Remova as linhas 35-46 (simulação atual)

#### `/src/app/api/auth/reset-password/route.ts`
- Descomente as linhas 19-35 (busca e validação do usuário)
- Descomente as linhas 55-63 (atualização da senha no banco)
- Remova as linhas 37-53 (simulação atual)

### 4. Testar o Sistema
1. Acesse `/esqueci-senha`
2. Digite um email válido
3. Verifique se o email de reset foi enviado
4. Clique no link do email
5. Redefina a senha
6. Teste o login com a nova senha

## Campos Adicionados ao Schema:
```prisma
model User {
  // ... outros campos
  resetToken      String?   @unique
  resetTokenExpiry DateTime?
  // ... outros campos
}
```

## Como Funciona:
1. **Solicitar Reset**: Usuário informa email → sistema gera token → envia email
2. **Validar Token**: Link do email valida token e expiração
3. **Redefinir Senha**: Usuário define nova senha → sistema atualiza e limpa token

## Segurança Implementada:
- ✅ Token único de 32 bytes (64 chars hex)
- ✅ Expiração de 1 hora
- ✅ Token é removido após uso
- ✅ Senha hashada com bcrypt (salt 12)
- ✅ Validação de força da senha (min 8 chars)
- ✅ Email estilizado com tema racing
- ✅ Não revela se email existe ou não

## Template de Email Incluso:
- Design responsivo com tema TopCars Valley
- Cores racing (vermelho #DC2626)
- Typography Orbitron para headers
- Instruções de segurança
- Link com CTA destacado
- Footer com créditos InovaMente Labs
