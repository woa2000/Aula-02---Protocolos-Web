const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

// Banco de dados temporário (em memória)
let tarefas = [
  { id: 1, titulo: 'Estudar Node.js', concluida: false },
  { id: 2, titulo: 'Aprender Express', concluida: false },
  { id: 3, titulo: 'Criar API REST', concluida: true }
];

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API de Tarefas', 
    versao: '1.0.0',
    endpoints: {
      'GET /tarefas': 'Listar todas as tarefas',
      'GET /tarefas/:id': 'Obter uma tarefa específica',
      'POST /tarefas': 'Criar nova tarefa',
      'PUT /tarefas/:id': 'Atualizar uma tarefa',
      'DELETE /tarefas/:id': 'Remover uma tarefa'
    }
  });
});

// GET - Listar todas as tarefas
app.get('/tarefas', (req, res) => {
  res.json(tarefas);
});

// GET - Obter uma tarefa específica
app.get('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);
  
  if (!tarefa) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
  
  res.json(tarefa);
});

// POST - Criar nova tarefa
app.post('/tarefas', (req, res) => {
  const { titulo, concluida } = req.body;
  
  if (!titulo) {
    return res.status(400).json({ erro: 'Título é obrigatório' });
  }
  
  const novaTarefa = {
    id: tarefas.length > 0 ? Math.max(...tarefas.map(t => t.id)) + 1 : 1,
    titulo,
    concluida: concluida || false
  };
  
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
});

// PUT - Atualizar uma tarefa
app.put('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, concluida } = req.body;
  const indice = tarefas.findIndex(t => t.id === id);
  
  if (indice === -1) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
  
  if (titulo !== undefined) {
    tarefas[indice].titulo = titulo;
  }
  
  if (concluida !== undefined) {
    tarefas[indice].concluida = concluida;
  }
  
  res.json(tarefas[indice]);
});

// DELETE - Remover uma tarefa
app.delete('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = tarefas.findIndex(t => t.id === id);
  
  if (indice === -1) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
  
  const tarefaRemovida = tarefas.splice(indice, 1);
  res.json({ mensagem: 'Tarefa removida com sucesso', tarefa: tarefaRemovida[0] });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
