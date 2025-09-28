# Books API

Uma API REST para gerenciamento de livros construída com Node.js e PostgreSQL.

## 🚀 Início Rápido

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

## 📚 Documentação

Toda a documentação técnica foi movida para a pasta `docs/` para manter o repositório limpo.

### Documentos Disponíveis:
- `docs/ARCHITECTURE.md` - Arquitetura da aplicação na AWS
- `docs/DATABASE_MIGRATION.md` - Migração do banco local para RDS
- `docs/INFRASTRUCTURE_SUMMARY.md` - Resumo da infraestrutura criada
- `docs/SECURITY_GUIDE.md` - Guia de segurança e boas práticas
- `docs/GITHUB_CREDENTIALS_SETUP.md` - Configuração de credenciais
- `docs/ENV-SETUP.md` - Configuração de ambiente
- `docs/DEPLOY-AWS.md` - Guia de deploy para AWS

## 🔧 Tecnologias

- **Backend**: Node.js, Express.js
- **Banco de Dados**: PostgreSQL
- **Containerização**: Docker
- **Cloud**: AWS (App Runner, RDS, ECR)
- **CI/CD**: GitHub Actions
- **Infraestrutura**: Terraform

## 📝 API Endpoints

- `GET /books` - Listar todos os livros
- `GET /books/:id` - Buscar livro por ID
- `GET /books/search?q=termo` - Buscar livros por termo
- `POST /books` - Criar novo livro
- `PUT /books/:id` - Atualizar livro
- `DELETE /books/:id` - Deletar livro

## 🔒 Segurança

- Arquivos sensíveis protegidos via `.gitignore`
- Credenciais AWS configuradas como secrets no GitHub
- Banco de dados em subnets privadas
- Security groups com regras restritivas

## 📄 Licença

MIT License
