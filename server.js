import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

/* =========================
   STREAM DE CHAT (SSE)
========================= */
app.post("/api/chat-stream", async (req, res) => {
  const { type, userText } = req.body;

  let systemPrompt = `
Você é o Verdade & Graça.
Escreva sempre com clareza, elegância e profundidade.
Nunca use markdown, asteriscos ou listas visuais.
Texto corrido, jornalístico e humano.
`;

  let userPrompt = userText;

  if (type === "news") {
    userPrompt = `
Escreva um panorama das PRINCIPAIS NOTÍCIAS DA SEMANA,
com linguagem jornalística de alto nível (estilo Folha de S.Paulo / BBC Brasil).

Regras:
- Somente acontecimentos recentes (últimos 7 dias).
- Política, economia, ciência e sociedade.
- Texto fluido, bem escrito, contextualizado.
- Sem listas, sem tópicos, sem datas explícitas.
- Finalize com um parágrafo curto de discernimento bíblico equilibrado,
sem tom moralista ou religioso excessivo.
`;
  }

  if (type === "devotional") {
    userPrompt = `
Escreva um devocional cristão para hoje.

Estrutura natural (sem títulos):
Introdução reflexiva,
Desenvolvimento bíblico,
Conclusão pastoral e prática.

Linguagem acolhedora, profunda e moderna.
`;
  }

  if (type === "jesus") {
    userPrompt = `
Explique como Jesus lidaria hoje com:
dinheiro, trabalho, estudos e relacionamentos.

Baseie-se nos Evangelhos.
Texto fluido, pastoral e prático.
`;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          stream: true,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.6
        })
      }
    );

    response.body.on("data", chunk => {
      const lines = chunk.toString().split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "");
          if (data === "[DONE]") {
            res.write("event: done\ndata: end\n\n");
            res.end();
            return;
          }

          try {
            const json = JSON.parse(data);
            const token = json.choices?.[0]?.delta?.content;
            if (token) {
              res.write(`data: ${token}\n\n`);
            }
          } catch {}
        }
      }
    });
  } catch (err) {
    res.write(`data: Erro ao gerar resposta.\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Verdade & Graça rodando na porta ${PORT}`);
});
