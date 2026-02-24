# API de Tarefas

API REST simples para gerenciamento de tarefas, construída com Node.js e Express.

## Instalação

```bash
npm install
```

## Executar

```bash
# Modo produção
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev
```

A API estará disponível em: `http://localhost:3000`

## Endpoints

### Listar todas as tarefas
```
GET /tarefas
```

### Obter uma tarefa específica
```
GET /tarefas/:id
```

### Criar nova tarefa
```
POST /tarefas
Content-Type: application/json

{
  "titulo": "Nova tarefa",
  "concluida": false
}
```

### Atualizar uma tarefa
```
PUT /tarefas/:id
Content-Type: application/json

{
  "titulo": "Tarefa atualizada",
  "concluida": true
}
```

### Remover uma tarefa
```
DELETE /tarefas/:id
```

## Exemplos com cURL

```bash
# Listar todas as tarefas
curl http://localhost:3000/tarefas

# Criar nova tarefa
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Minha nova tarefa","concluida":false}'

# Atualizar tarefa
curl -X PUT http://localhost:3000/tarefas/1 \
  -H "Content-Type: application/json" \
  -d '{"concluida":true}'

# Remover tarefa
curl -X DELETE http://localhost:3000/tarefas/1
```
