import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";

/* ===============================
   FUNÇÃO CENTRAL – CHAMADA IA
================================ */
async function chamarIA(prompt) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://verdadeegraca.github.io",
      "X-Title": "Verdade & Graça"
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
Você é uma IA cristã reformada.
RESPONDA OBRIGATORIAMENTE EM JSON VÁLIDO.
NUNCA use markdown.
NUNCA escreva texto fora do JSON.
`
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    throw new Error("Resposta inválida da IA");
  }

  const texto = data.choices[0].message.content;

  try {
    return JSON.parse(texto);
  } catch (e) {
    throw new Error("IA retornou JSON inválido");
  }
}

/* ===============================
   ROTA: CHAT (USUÁRIO)
================================ */
app.post("/api/pergunta", async (req, res) => {
  try {
    const { mensagem } = req.body;

    const prompt = `
Analise a mensagem abaixo.
Se for notícia: faça análise factual e bíblica.
Se for pergunta bíblica: responda biblicamente.

Retorne no formato:
{
  "resposta": "texto completo"
}

Mensagem:
"${mensagem}"
`;

    const resultado = await chamarIA(prompt);

    res.json({
      resposta: resultado.resposta
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      resposta: "Erro ao analisar. Tente novamente em instantes."
    });
  }
});

/* ===============================
   ROTA: NOTÍCIAS DO DIA (12)
================================ */
app.get("/api/noticias", async (req, res) => {
  try {
    const prompt = `
Liste AS 12 NOTÍCIAS MAIS FALADAS DO DIA
(relacionadas a política, economia e ciência).

Para cada notícia retorne:
- titulo
- categoria
- statusFactual (Verdadeira, Falsa ou Em verificação)
- relevancia (Alta, Média ou Baixa)
- analise
- reflexaoBiblica

Formato obrigatório:
{
  "noticias": [
    {
      "titulo": "",
      "categoria": "",
      "statusFactual": "",
      "relevancia": "",
      "analise": "",
      "reflexaoBiblica": ""
    }
  ]
}
`;

    const resultado = await chamarIA(prompt);

    if (!resultado.noticias || resultado.noticias.length !== 12) {
      throw new Error("Quantidade incorreta de notícias");
    }

    res.json(resultado);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      noticias: []
    });
  }
});

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("✅ Verdade & Graça API rodando");
});

/* ===============================
   START
================================ */
app.listen(PORT, () => {
  console.log(`🔥 API Verdade & Graça rodando na porta ${PORT}`);
});
