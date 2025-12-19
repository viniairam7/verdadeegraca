import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

app.post("/analisar", upload.single("imagem"), async (req, res) => {
  try {
    const { texto, link } = req.body;

    let conteudo = "";
    if (texto) conteudo = texto;
    else if (link) conteudo = `Analise esta notícia a partir deste link: ${link}`;
    else if (req.file) conteudo = "Analise biblicamente o conteúdo presente nesta imagem.";

    const prompt = `
Você é um analista cristão com profundo conhecimento bíblico.
Analise a notícia abaixo com base em princípios bíblicos.

Retorne:
1. Resumo da notícia
2. Princípios bíblicos
3. Discernimento cristão
4. Alertas espirituais ou éticos
5. Versículos bíblicos

Notícia:
${conteudo}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    res.json({
      resultado: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao analisar a notícia" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});

