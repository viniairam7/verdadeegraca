import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARES
========================= */

app.use(cors({
  origin: "*", // GitHub Pages precisa disso
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

/* =========================
   ROTAS
========================= */

// Rota de teste (sanidade)
app.get("/", (req, res) => {
  res.json({
    status: "online",
    app: "Verdade & Graça",
    mensagem: "Servidor ativo e funcionando."
  });
});

/* =========================
   ANÁLISE DE TEXTO
========================= */

app.post("/api/analisar", async (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({
      erro: "Texto não enviado."
    });
  }

  // 🔹 Análise simulada (IA entra aqui depois)
  const resposta = `
O tema apresentado nos leva a refletir à luz das Escrituras.

A Bíblia nos ensina que toda verdade procede de Deus (João 17:17).
Ao analisarmos esse assunto, somos chamados ao discernimento espiritual,
não reagindo segundo o mundo, mas segundo a mente de Cristo (Romanos 12:2).

Que essa reflexão conduza à edificação, sabedoria e graça.
  `;

  res.json({
    entrada: texto,
    resposta
  });
});

/* =========================
   NOTÍCIAS DO DIA (12)
========================= */

app.get("/api/noticias", (req, res) => {

  const noticias = [
    {
      titulo: "Conflitos internacionais elevam tensões globais",
      analise: "A busca por poder e domínio revela a ausência de justiça verdadeira.",
      reflexao: "Bem-aventurados os pacificadores, porque serão chamados filhos de Deus. (Mt 5:9)"
    },
    {
      titulo: "Economia global enfrenta novos desafios",
      analise: "A instabilidade econômica expõe a fragilidade da confiança no material.",
      reflexao: "Não ajunteis tesouros na terra... (Mateus 6:19)"
    },
    {
      titulo: "Avanços em inteligência artificial aceleram transformações",
      analise: "O conhecimento cresce, mas sem sabedoria pode se tornar soberba.",
      reflexao: "O temor do Senhor é o princípio da sabedoria. (Provérbios 9:10)"
    },
    {
      titulo: "Debates sobre ética digital ganham força",
      analise: "A tecnologia amplia o alcance do coração humano — para o bem ou para o mal.",
      reflexao: "Sobre tudo o que se deve guardar, guarda o teu coração. (Pv 4:23)"
    },
    {
      titulo: "Crises humanitárias aumentam em regiões vulneráveis",
      analise: "A indiferença do mundo contrasta com o chamado ao amor ao próximo.",
      reflexao: "Amai o vosso próximo como a vós mesmos. (Mateus 22:39)"
    },
    {
      titulo: "Mudanças climáticas geram alertas globais",
      analise: "A criação geme, aguardando redenção.",
      reflexao: "A criação aguarda a revelação dos filhos de Deus. (Romanos 8:19)"
    },
    {
      titulo: "Sociedade discute limites da liberdade de expressão",
      analise: "Liberdade sem verdade se torna confusão.",
      reflexao: "Conhecereis a verdade, e a verdade vos libertará. (João 8:32)"
    },
    {
      titulo: "Aumento de ansiedade e depressão preocupa especialistas",
      analise: "A alma humana clama por descanso que o mundo não pode oferecer.",
      reflexao: "Vinde a mim, todos os que estais cansados... (Mateus 11:28)"
    },
    {
      titulo: "Educação enfrenta crise de valores",
      analise: "Ensinar sem fundamento moral gera conhecimento vazio.",
      reflexao: "Instrui o menino no caminho em que deve andar. (Provérbios 22:6)"
    },
    {
      titulo: "Avivamentos locais despertam interesse espiritual",
      analise: "Deus continua chamando seu povo ao arrependimento e retorno.",
      reflexao: "Se o meu povo se humilhar... (2 Crônicas 7:14)"
    },
    {
      titulo: "Cresce o debate sobre identidade e propósito",
      analise: "Sem Criador, a criatura perde seu sentido.",
      reflexao: "Antes que te formasse no ventre, eu te conheci. (Jeremias 1:5)"
    },
    {
      titulo: "Igrejas discutem seu papel na sociedade moderna",
      analise: "A Igreja não deve se moldar ao mundo, mas transformá-lo.",
      reflexao: "Vós sois o sal da terra. (Mateus 5:13)"
    }
  ];

  res.json(noticias);
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`🔥 Verdade & Graça rodando na porta ${PORT}`);
});
