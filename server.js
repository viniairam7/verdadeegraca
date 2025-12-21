import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/api/ask", async (req, res) => {
  const { type, message } = req.body;

  let prompt = "";

  switch (type) {
    case "noticias":
      prompt = `
Traga as principais notícias do dia de forma imparcial.
Explique com clareza, contexto e finalize com discernimento bíblico equilibrado.
Texto fluido, sem listas.
`;
      break;

    case "devocional":
      prompt = `
Crie uma devocional cristã para hoje.
Estrutura:
Introdução
Desenvolvimento
Conclusão
Com aplicação prática e base bíblica.
`;
      break;

    case "jesus":
      prompt = `
Explique como Jesus agiria hoje em relação a:
dinheiro, trabalho, estudos e relacionamentos.
Baseie-se nos evangelhos.
`;
      break;

    default:
      prompt = message;
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
                "Você é o Verdade & Graça. Responda com clareza, verdade, equilíbrio e fidelidade bíblica."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.6
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Não foi possível gerar a resposta agora.";

    res.json({ reply });
  } catch (err) {
    res.status(500).json({
      reply: "Erro ao se comunicar com a IA."
    });
  }
});

app.listen(PORT, () => {
  console.log("🔥 Verdade & Graça rodando na porta", PORT);
});
