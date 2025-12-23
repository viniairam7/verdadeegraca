import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// rota de teste
app.get("/", (req, res) => {
  res.send("Servidor Verdade & Graça ativo 🙏");
});

// rota principal
app.post("/api/refletir-dia", async (req, res) => {
  try {
    const { planos } = req.body;

    if (!planos || planos.trim().length < 2) {
      return res.status(400).json({
        error: "Envie seus planos para o dia."
      });
    }

    const prompt = `
Você é um orientador cristão sábio, acolhedor e pastoral.

Rotina do dia do usuário:
"${planos}"

Tarefas:
1. Sugira bons horários para oração, leitura bíblica e silêncio com Deus
2. Crie uma reflexão conectando a rotina com a fé cristã
3. Cite ao menos um versículo bíblico
4. Finalize com encorajamento e esperança
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    res.json({
      resultado: response.output_text
    });

  } catch (error) {
    console.error("Erro na reflexão:", error);
    res.status(500).json({
      error: "Não consegui refletir agora. Tente novamente em instantes."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
