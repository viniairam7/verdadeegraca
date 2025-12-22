import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/api/rotina", async (req, res) => {
  const { rotina } = req.body;

  const systemPrompt = `
Você é um orientador espiritual cristão sábio, sensível e prático.
Seu papel é ajudar pessoas comuns a organizarem sua vida diária
de forma saudável, equilibrada e conectada com Deus.

Nunca use listas com marcadores, asteriscos ou markdown.
Escreva sempre em texto fluido, humano e acolhedor.
`;

  const userPrompt = `
A pessoa descreveu sua rotina do dia assim:

"${rotina}"

Tarefa:
1. Analise os horários e compromissos.
2. Sugira, em texto corrido, os melhores momentos do dia para:
oração, leitura bíblica e um tempo de quietude com Deus,
de forma realista e respeitosa.
3. Em seguida, escreva uma reflexão personalizada sobre esse dia,
conectando a rotina apresentada com um texto bíblico apropriado
(cite apenas o livro e capítulo).
4. Finalize com palavras de encorajamento pastoral, simples e sinceras.

Tudo deve parecer uma conversa pessoal e cuidadosa.
`;

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
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.6
        })
      }
    );

    const data = await response.json();
    res.json({ resposta: data.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar orientação espiritual." });
  }
});

app.listen(PORT, () => {
  console.log(`🙏 Servidor espiritual rodando na porta ${PORT}`);
});
