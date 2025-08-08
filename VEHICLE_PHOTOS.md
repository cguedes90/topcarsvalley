# Sistema de Fotos de Veículos - TopCars Valley

## Visão Geral
Sistema completo para upload, gerenciamento e visualização de fotos de veículos na plataforma TopCars Valley.

## Funcionalidades Implementadas

### 1. Upload de Fotos
- **Drag & Drop**: Interface intuitiva para arrastar e soltar múltiplas imagens
- **Validação**: Apenas JPG, PNG e WebP até 5MB cada
- **Limite**: Máximo de 5 fotos por veículo
- **Preview**: Visualização imediata das fotos carregadas
- **Progresso**: Indicador de upload em tempo real

### 2. Gerenciamento de Fotos
- **Visualização em Grid**: Layout responsivo das fotos do veículo
- **Exclusão Individual**: Botão para remover fotos específicas
- **Reordenação**: (Futuro - drag & drop para reordenar)

### 3. Exibição na Garagem
- **Cards com Fotos**: Substituição do placeholder por fotos reais
- **Fallback Elegante**: Ícone de câmera quando não há fotos
- **Navegação**: Links para página de detalhes/edição

## Estrutura de Arquivos

### APIs
```
/api/garage/vehicles/[id]/
├── upload-photo/route.ts    # Upload de fotos
├── delete-photo/route.ts    # Exclusão de fotos
└── route.ts                 # CRUD do veículo
```

### Componentes
```
src/components/garage/
└── VehiclePhotoUploader.tsx  # Componente de upload
```

### Páginas
```
src/app/garagem/
├── page.tsx                  # Lista de veículos
└── [id]/page.tsx            # Detalhes/edição do veículo
```

## Como Usar

### Para Administradores
1. Acesse a garagem em `/garagem`
2. Clique em "Meus Veículos"
3. Clique no botão de editar (ícone de lápis) em um veículo
4. Na página de edição, use a área de upload de fotos:
   - Arraste arquivos para a área pontilhada, ou
   - Clique para selecionar arquivos
5. Aguarde o upload completar
6. Use o botão "X" para remover fotos específicas

### Para Membros
1. Visualize veículos públicos em `/garagem`
2. Clique no ícone de olho para ver detalhes
3. Veja as fotos do veículo na galeria

## Configurações Técnicas

### Validação de Arquivos
- **Tipos permitidos**: image/jpeg, image/png, image/webp
- **Tamanho máximo**: 5MB por arquivo
- **Quantidade máxima**: 5 fotos por veículo

### Armazenamento
- **Diretório**: `public/uploads/vehicles/`
- **Nomenclatura**: `{vehicleId}_{timestamp}_{filename}`
- **Acesso público**: `/uploads/vehicles/{filename}`

### Segurança
- **Autenticação JWT**: Todas as operações requerem token válido
- **Autorização**: Apenas o dono pode gerenciar fotos do veículo
- **Validação de tipo**: Verificação de MIME type no servidor
- **Sanitização**: Nomes de arquivo são limpos e únicos

## APIs Disponíveis

### POST `/api/garage/vehicles/[id]/upload-photo`
Upload de uma ou múltiplas fotos para o veículo.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:**
```
FormData com campo 'photos' contendo os arquivos
```

**Resposta:**
```json
{
  "success": true,
  "photos": ["filename1.jpg", "filename2.jpg"],
  "vehicle": { /* dados do veículo atualizado */ }
}
```

### DELETE `/api/garage/vehicles/[id]/delete-photo`
Remove uma foto específica do veículo.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "filename": "filename.jpg"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Foto removida com sucesso",
  "vehicle": { /* dados do veículo atualizado */ }
}
```

### GET `/api/garage/vehicles/[id]`
Busca dados completos do veículo incluindo fotos.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "success": true,
  "vehicle": {
    "id": "uuid",
    "brand": "Toyota",
    "model": "Supra",
    "photos": ["filename1.jpg", "filename2.jpg"],
    // ... outros campos
  }
}
```

### PUT `/api/garage/vehicles/[id]`
Atualiza dados do veículo (não afeta fotos).

## Próximas Melhorias

### Planejadas
- [ ] **Reordenação**: Drag & drop para definir ordem das fotos
- [ ] **Zoom**: Visualização ampliada das fotos
- [ ] **Galeria Modal**: Modal para navegar entre fotos
- [ ] **Otimização**: Redimensionamento automático das imagens
- [ ] **CDN**: Integração com serviço de CDN para melhor performance

### Considerações Futuras
- [ ] **Compressão**: Compressão automática para reduzir tamanho
- [ ] **Watermark**: Marca d'água automática nas fotos
- [ ] **Backup**: Sistema de backup das imagens
- [ ] **Analytics**: Tracking de visualizações das fotos

## Troubleshooting

### Erro de Upload
1. Verifique se o arquivo é JPG, PNG ou WebP
2. Confirme que o arquivo é menor que 5MB
3. Verifique se não excedeu o limite de 5 fotos

### Foto não Aparece
1. Confirme que o upload foi concluído com sucesso
2. Verifique se o arquivo existe em `/public/uploads/vehicles/`
3. Recarregue a página para atualizar o cache

### Erro de Permissão
1. Verifique se está logado corretamente
2. Confirme que é o dono do veículo
3. Verifique se o token JWT não expirou

---

**Desenvolvido para TopCars Valley** 🏁
Plataforma premium para entusiastas de carros esportivos.
