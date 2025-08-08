# TopCars Valley

> Conectando Máquinas e Pessoas - A plataforma premium para entusiastas automotivos

## 🚗 Visão Geral

TopCars Valley é uma plataforma digital exclusiva desenvolvida para conectar entusiastas automotivos em uma comunidade premium. O sistema oferece funcionalidades completas para gerenciamento de eventos, networking entre membros, e promoção da cultura automotiva esportiva.

## 🎯 Características Principais

### ✨ Sistema de Autenticação Exclusivo
- **Acesso por convite**: Apenas membros convidados podem se cadastrar
- **Controle de acesso baseado em roles** (Admin/Member)
- **Tokens únicos** com prazo de validade

### 🏁 Gestão de Eventos
- **Eventos públicos e privados**
- **Sistema de RSVP** para confirmação de presença
- **QR Codes** para eventos especiais
- **Dashboard administrativo** completo

### 💬 Comunicação Interna
- **Mural de anúncios** para administradores
- **Sistema de contatos** com categorização
- **Widget WhatsApp** integrado
- **Networking entre membros**

### 🛍️ Loja Exclusiva
- **Merchandise premium** da marca
- **Acesso restrito** para membros
- **Produtos limitados** e exclusivos

## 🛠️ Tecnologias

- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: Radix UI + shadcn/ui
- **Ícones**: Lucide React
- **Fonts**: Orbitron + Inter

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/your-org/topcars-valley.git
   cd topcars-valley
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:3000
   ```

## 📱 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Estilos globais
│   └── ...
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── landing/          # Componentes da landing page
│   ├── navigation/       # Navegação e footer
│   └── widgets/          # Widgets especiais
└── lib/                  # Utilitários e configurações
    └── utils.ts          # Funções utilitárias
```

## 🎨 Design System

### Cores
- **Racing Red**: `#DC2626` - Cor principal da marca
- **Charcoal**: `#262626` - Backgrounds escuros
- **Graphite**: `#404040` - Tons médios
- **Steel**: `#525252` - Acentos claros

### Tipografia
- **Títulos**: Orbitron (estilo racing/futurista)
- **Texto**: Inter (legibilidade e modernidade)

## 📄 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de linting

## 🔧 Configuração

### Variáveis de Ambiente (planejadas)
```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email
EMAIL_SERVER="smtp://..."
EMAIL_FROM="noreply@topcarsvalley.com"
```

## 🌟 Funcionalidades Planejadas

- [ ] Sistema de autenticação completo
- [ ] Dashboard administrativo
- [ ] Dashboard de membros
- [ ] Gestão de eventos com RSVP
- [ ] Sistema de convites por token
- [ ] Integração com email
- [ ] Sistema de notificações
- [ ] API REST completa
- [ ] Testes automatizados

## 🤝 Contribuição

Este é um projeto privado e exclusivo. Para contribuições, entre em contato com a equipe do TopCars Valley.

## 📞 Suporte

- **Email**: contato@topcarsvalley.com
- **WhatsApp**: +55 (11) 99999-9999
- **Endereço**: São Paulo, SP - Brasil

## �‍💻 Desenvolvido por

**[InovaMente Labs](https://inovamentelabs.com.br)** - Soluções tecnológicas inovadoras para empresas que pensam no futuro.

## �📝 Licença

© 2025 TopCars Valley. Todos os direitos reservados.

## 🌐 Links Importantes

- **GitHub**: [https://github.com/cguedes90/topcarsvalley](https://github.com/cguedes90/topcarsvalley)
- **Instagram**: [https://www.instagram.com/topcarsvalley/](https://www.instagram.com/topcarsvalley/)
- **InovaMente Labs**: [https://inovamentelabs.com.br](https://inovamentelabs.com.br)

---

**TopCars Valley** - Onde a paixão automotiva encontra a inovação digital. 🏁
