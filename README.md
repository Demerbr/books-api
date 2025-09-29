# Books API

Uma API REST para gerenciamento de livros construída com Node.js e PostgreSQL 

 **Nota**: Esta é uma versão modificada da API original desenvolvida por [alencarlucas](https://github.com/alencarlucas/books-api) para realização de teste técnico. A API original pode ser encontrada em: https://github.com/alencarlucas/books-api



### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar com Docker Compose
docker-compose up

# Ou iniciar diretamente (requer PostgreSQL local)
npm start
```

### Deploy para Produção

A aplicação está configurada para deploy automático na AWS usando:

- **App Runner** para hospedagem
- **RDS PostgreSQL** para banco de dados
- **ECR** para registry de imagens Docker
- **GitHub Actions** para CI/CD



##  Tecnologias

- **Backend**: Node.js, Express.js
- **Banco de Dados**: PostgreSQL
- **Containerização**: Docker
- **Cloud**: AWS (App Runner, RDS, ECR)
- **CI/CD**: GitHub Actions
- **Infraestrutura**: Terraform

## API Endpoints

- `GET /books` - Listar todos os livros
- `GET /books/:id` - Buscar livro por ID
- `GET /books/search?q=termo` - Buscar livros por termo


## Segurança

- Arquivos sensíveis protegidos via `.gitignore`
- Credenciais AWS configuradas como secrets no GitHub
- Banco de dados em subnets privadas
- Security groups com regras restritivas

## Melhorias Implementadas 

### **Sistema de Preços Integrado**
- Campo `price` adicionado ao modelo de livros
- Preços  configurados para todos os livros de exemplo
- Suporte a valores decimais (DECIMAL(10,2)) para precisão financeira
- Ideal para implementar funcionalidades de e-commerce como carrinho de compras

### **Performance Otimizada**
- Pool de conexões configurável via `DB_POOL`
- Conexões reutilizadas para reduzir latência
- Melhor escalabilidade para múltiplas requisições simultâneas

### **Configuração CORS Inteligente**
- **Desenvolvimento**: Permite origens (localhost:3000, localhost:3001, 127.0.0.1:3000, 127.0.0.1:3001)
- **Produção**: Restringe a origem específica via `FRONTEND_URL`
- **Segurança**: Validação rigorosa de origens em ambos os ambientes
- **Headers**: Configurados para métodos GET, POST, PUT, DELETE, OPTIONS
- **Credenciais**: Suporte a cookies e autenticação via `Access-Control-Allow-Credentials`

##  Histórico de Mudanças

### Novos endpoints criados:

- Nenhum endpoint novo foi adicionado na versão atual

### Campos adicionados ao modelo:

- **price**: Campo decimal para preço dos livros (DECIMAL(10,2), padrão 0.00)

### Ajustes de performance ou paginação:

- **Sistema de ordenação flexível**: Suporte a ordenação por `name`, `title`, `date`, `publishedAt`, `createdAt` e `price`
- **Controle de direção**: Ordenação ascendente (ASC) ou descendente (DESC)
- **Busca unificada**: Endpoint `/books` com busca por texto integrada via parâmetro `text`
- **Paginação otimizada**: Suporte a `page` e `limit` em todas as operações (listagem e busca)
- **Validação de parâmetros**: Campos de ordenação e direção validados para segurança
- **Pool de conexões configurável**: Via variável `DB_POOL` para melhor performance

### Outros (detalhe brevemente):

- Remoção completa de todos os comentários de código da aplicação
- Limpeza de arquivos de configuração mantendo apenas funcionalidades essenciais
- Dados de exemplo pré-carregados com preços configurados

## 📄 Licença

MIT License