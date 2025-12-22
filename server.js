import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

function buildPrompt(userText) {
  if (userText === "Notícias da semana") {
    return `
Você é um jornalista sênior no padrão editorial da BBC e da Folha de S.Paulo.

Escreva um panorama das principais notícias da semana,
considerando Brasil e mundo, política, economia, ciência e sociedade.

Regras obrigatórias:
- Texto fluido, elegante e humano
- Parágrafos curtos
- Linguagem jornalística moderna
- Sem listas, sem markdown, sem numeração
- Sem datas explícitas
- Nada sensacionalista

Finalize cada bloco com uma reflexão cristã sutil,
sem pregação, apenas discernimento bíblico equilibrado.

Escreva para leitura em celular.
`;
  }

  if (userText === "Devocional de hoje") {
    return `
Crie um devocional cristão para hoje.

Estrutura:
Introdução curta e acolhedora.
Desenvolvimento com reflexão bíblica prática.
Conclusão com encorajamento para o dia.

Linguagem simples, profunda e pastoral.
Parágrafos curtos.
`;
  }

  if (userText === "O que Jesus faria?") {
    return `
Explique como Jesus agiria hoje em relação a:
dinheiro, trabalho, estudos e relacionamentos.

Use os Evangelhos como base.
Seja prático, amoroso e direto.
Parágrafos curtos.
`;
  }

  return `
Responda à pergunta abaixo com base bíblica,
clareza teológica e linguagem acessível:

${userText}
`;
}

/* =========================
   STREAMING (DIGITAÇÃO)
========================= */
app.post("/api/chat-stream", async (req, res) => {
  const { prompt } = req.body;
  const finalPrompt = buildPrompt(prompt);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        stream: true,
        messages: [
          {
            role: "system",
            content:
              "Você é o Verdade & Graça, um analista cristão com ética jornalística."
          },
          { role: "user", content: finalPrompt }
        ],
        temperature: 0.4
      })
    });

    response.body.on("data", chunk => {
      const lines = chunk.toString().split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "");
          if (data === "[DONE]") {
            res.write("event: end\ndata: done\n\n");
            res.end();
            return;
          }
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              res.write(`data: ${content}\n\n`);
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
  console.log("🔥 Verdade & Graça rodando com streaming");
});
