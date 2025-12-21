import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check (IMPORTANTE para o Render)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    app: "Verdade & Graça",
    message: "Backend ativo e funcionando"
  });
});

// Endpoint principal de análise
app.post("/analisar", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto || texto.trim().length < 5) {
      return res.status(400).json({
        erro: "Texto inválido para análise"
      });
    }

    const prompt = `
Você é um analista cristão que avalia notícias e temas à luz da verdade factual e da Bíblia.

TAREFAS:
1. Avalie se o conteúdo é verdadeiro, falso ou inconclusivo.
2. Analise a relevância social.
3. Faça uma análise bíblica equilibrada, citando princípios ou textos (Antigo e Novo Testamento).
4. Seja respeitoso, claro e pastoral.

FORMATO DA RESPOSTA:
- 📌 Veracidade:
- 📊 Relevância:
- 📖 Análise Bíblica:
- 🧭 Discernimento Cristão:

CONTEÚDO:
"""${texto}"""
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://verdadeegraca.onrender.com",
        "X-Title": "Verdade & Graça"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um especialista em discernimento cristão e análise factual." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    const resposta = data.choices?.[0]?.message?.content;

    res.json({
      sucesso: true,
      resposta
    });

  } catch (error) {
    console.error("Erro na análise:", error.message);
    res.status(500).json({
      sucesso: false,
      erro: "Erro ao analisar o conteúdo"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Verdade & Graça backend rodando na porta ${PORT}`);
});
