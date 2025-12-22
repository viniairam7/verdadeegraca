import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

/* =========================
   FUNÇÃO BASE IA
========================= */
async function callAI(prompt) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://verdadeegraca.vercel.app",
        "X-Title": "Verdade & Graça"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content:
              "Você é o Verdade & Graça. Responda com clareza, equilíbrio bíblico, verdade factual e linguagem acessível."
          },
          { role: "user", content: prompt }
        ]
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("OpenRouter erro:", error);
    throw new Error("Erro IA");
  }

  const data = await response.json();

  return (
    data?.choices?.[0]?.message?.content ||
    "Não foi possível gerar a resposta agora."
  );
}

/* =========================
   CHAT GERAL
========================= */
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.json({ reply: "Digite uma pergunta." });
  }

  try {
    let finalPrompt = prompt;

    if (prompt === "Notícias do dia") {
      finalPrompt = `
Liste e explique essas notícias e depois faça uma Reflexão bíblica equilibrada:
🇧🇷 Principais notícias do Brasil

🏛️ Política
	•	Lula promete vetar projeto que reduz pena de Bolsonaro
O presidente Luiz Inácio Lula da Silva anunciou que vetará um projeto de lei aprovado pelo Congresso que reduziria a pena de prisão de mais de 27 anos imposta ao ex-presidente Jair Bolsonaro por tentativa de golpe. A proposta causou protestos em várias cidades.  ￼
	•	Brasil espera assinatura do acordo Mercosul-UE em janeiro
Lula afirmou que o longo tratado de livre-comércio entre o Mercosul e a União Europeia poderá ser assinado no início de 2026, apesar de objeções de países europeus como França e Itália.  ￼

📉 Economia
	•	Governo define prazo para redução da dependência de combustíveis fósseis
O Brasil comprometeu ministérios a entregar um plano em dois meses para diminuir a dependência de combustíveis fósseis, combinando metas de energia renovável e um fundo financiado por receitas de petróleo e gás.  ￼
	•	Impactos recentes no mercado financeiro
Dados de dezembro mostram que o mercado acionário brasileiro (Ibovespa) sofreu forte queda e o dólar subiu — reflexo da tensão política e perspectivas eleitorais.  ￼
	•	Reportagens destacam presença econômica da China no Brasil
Especialistas observam um aumento da presença empresarial e cultural da China no Brasil em 2025, com oportunidades de negócios e investimentos.  ￼

🔌 Infraestrutura e energia
	•	Governo pode encerrar contrato da Enel em SP após apagão
Autoridades brasileiras pedem que a agência reguladora investigue a rescisão do contrato da Enel em São Paulo após falhas na resposta a grandes apagões.  ￼

📊 Dados econômicos mais amplos
	•	Crescimento econômico do Brasil tem desaceleração
Relatório econômico mostra que o crescimento do PIB brasileiro enfraqueceu em 2025, com maior moderação no consumo e investimento, mas com perspectivas de recuperação em 2026.  ￼

⸻

🌍 Principais notícias do Mundo

🏛️ Política Global
	•	Carta de congressistas dos EUA critica Trump por ações contra democracia brasileira
Mais de 40 legisladores democratas enviaram uma carta ao presidente dos EUA, Donald Trump, acusando-o de tentar influenciar assuntos internos do Brasil e proteger Bolsonaro da responsabilização legal.  ￼
	•	Ucrânia e Taiwan: foco de tensões internacionais
Pacote de apoio militar dos EUA a Taiwan no valor de US$11 bilhões, incluindo equipamentos de defesa, gerou forte reação da China, em meio a preocupações geopolíticas maiores (relatório financeiro internacional).  ￼

📈 Economia
	•	China enfrenta desafios econômicos internos apesar do superávit comercial
Enquanto mantém um enorme superávit comercial, a economia chinesa mostra fraqueza em consumo interno, investimentos e produção, o que pode impactar negociações com os EUA.  ￼
	•	Debates econômicos em meio a políticas globais de comércio
Especialistas destacam que políticas de tarifas e relançamentos de taxações podem gerar efeitos mistos no comércio global — mostrando como fatores políticos afetem a economia mundial.  ￼

🔬 Ciência & Tecnologia
	•	Debates sobre ciência, democracia e financiamento
Durante o banquete do Prêmio Nobel, temas sobre a importância da pesquisa científica e os desafios de financiamento e liberdade acadêmica foram destaque, com críticas às políticas que limitam cientistas nos EUA.  ￼
	•	Principais pesquisas de 2025 destacadas internacionalmente
Diversos avanços científicos em temas como saúde, estresse, vacinas de câncer e benefícios do café foram destacados como histórias de pesquisa importantes do ano.  ￼

⸻

🧠 Contexto Ampliado (Tendências Atuais)

🌡️ Acordos climáticos e ciência
	•	No cenário internacional, a COP30 no Brasil segue em foco, com pressão para dar mais voz à ciência nas decisões climáticas e criar estratégias mais rápidas para enfrentar mudanças climáticas.  ￼

📚 Ciência no Brasil
	•	Pesquisadores brasileiros discutem o papel da ciência e tecnologia no crescimento econômico e na cooperação internacional, especialmente com países do BRICS, incentivando maior investimento em pesquisa.  ￼
`;
    }

    if (prompt === "Devocional de hoje") {
      finalPrompt = `
Crie um devocional cristão para o dia de hoje.
Estrutura:
- Introdução
- Desenvolvimento
- Aplicação prática
- Versículo bíblico
- Conclusão
`;
    }

    if (prompt === "O que Jesus faria?") {
      finalPrompt = `
Explique como Jesus lidaria hoje com:
- Dinheiro
- Trabalho
- Relacionamentos
- Estudos
Use os evangelhos como base.
`;
    }

    const reply = await callAI(finalPrompt);
    res.json({ reply });

  } catch (err) {
    res.json({
      reply: "Não foi possível gerar a resposta agora."
    });
  }
});

app.listen(PORT, () => {
  console.log("🔥 Verdade & Graça rodando na porta", PORT);
});
