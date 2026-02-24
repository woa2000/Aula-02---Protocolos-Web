const express = require("express");
const app = express();

app.disable("x-powered-by");

// Parse JSON
app.use(express.json({ type: ["application/json", "application/*+json"] }));

// Tratamento de JSON quebrado -> 400 (em envelope)
app.use((err, req, res, next) => {
  const isBadJson =
    err instanceof SyntaxError && err.status === 400 && "body" in err;

  if (isBadJson) {
    return res.status(400).json({
      error: {
        code: "BAD_JSON",
        message: "JSON inválido (verifique vírgulas/aspas e Content-Type).",
      },
    });
  }
  return next(err);
});

// "Banco" em memória
const tasks = new Map(); // id -> task
let seq = 1;

function isAuth(req) {
  const auth = req.header("Authorization") || "";
  return auth === "Bearer demo-token";
}

// Healthcheck
app.get("/health", (req, res) => {
  res.status(200).json({ data: { ok: true } });
});

// List (GET)
app.get("/tasks", (req, res) => {
  res.status(200).json({ data: Array.from(tasks.values()) });
});

// Get by id (GET)
app.get("/tasks/:id", (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Task não encontrada." },
    });
  }
  return res.status(200).json({ data: task });
});

// Create (POST) -> 201 + Location
app.post("/tasks", (req, res) => {
  if (!isAuth(req)) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Token ausente/inválido." },
    });
  }

  const { title } = req.body || {};
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Campo 'title' é obrigatório.",
        details: [{ field: "title", issue: "required" }],
      },
    });
  }

  // Exemplo de conflito: título duplicado
  const exists = Array.from(tasks.values()).some(
    (t) => t.title.toLowerCase() === title.toLowerCase()
  );
  if (exists) {
    return res.status(409).json({
      error: { code: "CONFLICT", message: "Já existe task com esse título." },
    });
  }

  const id = String(seq++);
  const task = { id, title: title.trim(), done: false };
  tasks.set(id, task);

  res.setHeader("Location", `/tasks/${id}`);
  return res.status(201).json({ data: task });
});

// Patch (PATCH) -> 200
app.patch("/tasks/:id", (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Task não encontrada." },
    });
  }

  const { title, done } = req.body || {};

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(422).json({
        error: { code: "VALIDATION_ERROR", message: "title inválido." },
      });
    }
    task.title = title.trim();
  }

  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(422).json({
        error: { code: "VALIDATION_ERROR", message: "done deve ser boolean." },
      });
    }
    task.done = done;
  }

  tasks.set(task.id, task);
  return res.status(200).json({ data: task });
});

// Delete (DELETE) -> 204
app.delete("/tasks/:id", (req, res) => {
  const existed = tasks.delete(req.params.id);
  if (!existed) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Task não encontrada." },
    });
  }
  return res.status(204).send();
});

// StackBlitz/WebContainers: use PORT do ambiente
const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`API rodando na porta ${port}`);
});
