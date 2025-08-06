# 💳 Open Banking App

Aplicação desenvolvida para simular operações de um sistema bancário moderno, inspirado nos conceitos de Open Banking. A interface é construída em **React**, com gerenciamento de dados através de **hooks personalizados** e uma API fake criada com **JSON Server**.

## 🚀 Funcionalidades

- Cadastro de usuários e contas bancárias
- Listagem de transações financeiras
- Realização de transferências entre contas
- Busca de transações por descrição
- Interface moderna e responsiva

## 🛠️ Tecnologias Utilizadas

- React + TypeScript
- TailwindCSS
- Vite
- JSON Server (para simular API REST)
- React Query

## 📦 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/Jorge989/challange-frontend.git
cd open-banking-app
npm install

▶️ Como rodar o projeto
1. Iniciar a API
A API é simulada usando json-server. Ela roda com os seguintes endpoints:

npm run api
Isso inicia a API localmente em http://0.0.0.0:3000.

2. Iniciar o Frontend
Em outro terminal, execute:

npm run dev
O frontend estará disponível em http://localhost:5173.

🧾 Scripts Disponíveis
json
Copiar
Editar
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "api": "json-server --watch db.json --port 3000 --host 0.0.0.0"

  Feito por Jorge Attie
```
