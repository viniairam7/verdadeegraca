import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors({ origin: "*" }));
app.use(express.json());

/* =========================
   CHAT COM IA
========================= */
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.json(data.choices[0].message);

  } catch (err) {
    res.status(500).json({ error: "Erro ao comunicar com a IA" });
  }
});

/* =========================
   NOTÍCIAS IMPARCIAIS
========================= */
app.get("/api/noticias", async (req, res) => {
  const prompt = `
Gere 12 notícias imparciais no estilo jornalístico profissional.
Para cada notícia, forneça:
- Título
- Resumo objetivo
- Análise de relevância e veracidade
- Reflexão bíblica conectada ao tema (sem proselitismo político)
Formato JSON.
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4
      })
    });

    const data = await response.json();
    res.json(JSON.parse(data.choices[0].message.content));

  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar notícias" });
  }
});

/* ========================= */
app.listen(PORT, () => {
  console.log("🔥 Verdade & Graça API rodando");
});

