import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors({ origin: "*" }));
app.use(express.json());

/* =========================
   CHAT PRINCIPAL
========================= */
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.json({ reply: "Por favor, digite uma pergunta ou manchete." });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "Você é o Verdade & Graça, um analista imparcial que responde com clareza, verdade factual e reflexão bíblica equilibrada."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.6
        })
      }
    );

    const data = await response.json();
    const text =
      data?.choices?.[0]?.message?.content ||
      "Não foi possível gerar uma resposta no momento.";

    res.json({ reply: text });
  } catch (error) {
    res.json({
      reply:
        "Erro ao comunicar com a IA. Tente novamente em alguns instantes."
    });
  }
});

/* =========================
   NOTÍCIAS DO DIA (TEXTO SIMPLES)
========================= */
app.get("/api/noticias", async (req, res) => {
  const prompt = `
Liste 12 notícias atuais e imparciais (política, economia e ciência).
Para cada notícia, escreva em TEXTO CORRIDO:

• Título
• Resumo objetivo
• Relevância e veracidade
• Reflexão bíblica equilibrada

Não use JSON.
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
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
      }
    );

    const data = await response.json();
    const text =
      data?.choices?.[0]?.message?.content ||
      "Não foi possível carregar as notícias hoje.";

    res.json({ reply: text });
  } catch (error) {
    res.json({
      reply: "Erro ao buscar notícias."
    });
  }
});

app.listen(PORT, () => {
  console.log("🔥 Verdade & Graça API rodando");
});

