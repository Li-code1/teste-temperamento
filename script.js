document.addEventListener("DOMContentLoaded", function () {

  let resultadoGlobal = {
    principal: "",
    secundario: "",
    nome: ""
  };

  const nomesBonitos = {
    colerico: "Colérico",
    sanguineo: "Sanguíneo",
    melancolico: "Melancólico",
    fleumatico: "Fleumático"
  };

  const perguntas = [
    "Quando algo foge do seu controle, o que acontece dentro de você?",
    "Em um ambiente com várias pessoas, você costuma:",
    "Quando algo te machuca emocionalmente, você:",
    "Como você costuma lidar com decisões importantes?",
    "Quando você está sob pressão, sua reação é:",
    "Como você lida com conflitos?",
    "O que mais te incomoda nas pessoas?",
    "Como você costuma se comportar em relacionamentos?",
    "Quando algo dá errado, seu pensamento automático é:",
    "Como você lida com suas emoções no dia a dia?",
    "Você sente que sua mente é mais:",
    "Qual dessas frases mais parece com você?"
  ];

  const opcoes = [
    ["Tento assumir o controle rapidamente", "Busco alguém para conversar", "Analiso tudo profundamente", "Tento evitar ou me afastar"],
    ["Tomar iniciativa e liderar", "Interagir e conversar com todos", "Observar antes de agir", "Ficar mais na sua"],
    ["Tenta resolver na hora", "Se distrai ou busca apoio", "Fica pensando por muito tempo", "Guarda para si"],
    ["Decide rápido", "Pede opinião", "Analisa muito antes", "Adia ao máximo"],
    ["Age imediatamente", "Procura apoio", "Pensa demais", "Se fecha"],
    ["Enfrenta direto", "Tenta manter harmonia", "Analisa antes de agir", "Evita confronto"],
    ["Lentidão", "Frieza ou distância", "Erros", "Conflitos"],
    ["Intenso e direto", "Afetuoso e presente", "Profundo e cuidadoso", "Tranquilo e estável"],
    ["“Preciso resolver isso agora”", "“Vou tentar não pensar nisso”", "“Por que isso aconteceu?”", "“Deixa assim…”"],
    ["Expressa com facilidade", "Busca apoio", "Guarda e processa", "Evita lidar"],
    ["Acelerada", "Emocional", "Analítica", "Tranquila"],
    ["“Preciso ter controle”", "“Preciso de conexão”", "“Preciso entender tudo”", "“Só quero paz”"]
  ];

  const tipos = ["colerico","sanguineo","melancolico","fleumatico"];

  const container = document.getElementById("questions");

  let html = "";
  perguntas.forEach((pergunta, i) => {
    html += `<div class="question"><p>${i + 1}. ${pergunta}</p>`;
    opcoes[i].forEach((opcao, j) => {
      html += `<label class="option">
        <input type="radio" name="q${i}" value="${tipos[j]}">
        <span>${opcao}</span>
      </label>`;
    });
    html += `</div>`;
  });

  container.innerHTML = html;

  globalThis.calcular = function () {

    let respostas = document.querySelectorAll('input[type="radio"]:checked');
    if (respostas.length < perguntas.length) {
      alert("Responda todas as perguntas.");
      return;
    }

    let contagem = { colerico:0, sanguineo:0, melancolico:0, fleumatico:0 };
    respostas.forEach(r => contagem[r.value]++);

    let ordenado = Object.entries(contagem).sort((a,b)=>b[1]-a[1]);
    let principal = ordenado[0][0];
    let secundario = ordenado[1][0];
    let nome = document.getElementById("nome").value || "Você";

    resultadoGlobal = { principal, secundario, nome };

    const descricao = {
      colerico: {
        positivo: "Você é direto, determinado e gosta de resolver as coisas rapidamente.",
        negativo: "Pode ser impulsivo, controlador e ter dificuldade em lidar com emoções.",
        impacto: "Isso pode gerar conflitos, sobrecarga e afastamento de pessoas importantes."
      },
      sanguineo: {
        positivo: "Você é comunicativo, emocional e se conecta facilmente com as pessoas.",
        negativo: "Pode agir por impulso e depender da validação dos outros.",
        impacto: "Isso pode gerar instabilidade emocional e dificuldade em manter foco."
      },
      melancolico: {
        positivo: "Você é analítico, profundo e atento aos detalhes.",
        negativo: "Pode pensar demais e se cobrar excessivamente.",
        impacto: "Isso pode gerar ansiedade, insegurança e travar decisões."
      },
      fleumatico: {
        positivo: "Você é calmo, equilibrado e evita conflitos.",
        negativo: "Pode evitar decisões e guardar emoções.",
        impacto: "Isso pode levar à procrastinação e a se anular."
      }
    };

    document.getElementById("resultado").style.display = "block";

    document.getElementById("resultado").innerHTML = `
      <h2>${nome}, esse é o seu resultado:</h2>
      <p><b>Temperamento principal:</b> ${nomesBonitos[principal]}</p>
      <p>${descricao[principal].positivo}</p>
      <p style="margin-top:10px;"><b>Ponto de atenção:</b></p>
      <p>${descricao[principal].negativo}</p>
      <p style="margin-top:10px;"><b>Como isso impacta sua vida:</b></p>
      <p>${descricao[principal].impacto}</p>
      <br>
      <p><b>Temperamento secundário:</b> ${nomesBonitos[secundario]}</p>
      <p>${descricao[secundario].positivo}</p>
      <canvas id="grafico" style="max-width:400px; margin-top:20px;"></canvas>
      <button id="baixarPDF" style="margin-top:20px;">Baixar PDF</button>
      <p style="margin-top:15px; font-weight:bold; color:#7e22ce;">
        Se você não entende esse padrão, ele continua se repetindo automaticamente.
      </p>
      <p style="margin-top:10px;">
        Esse resultado mostra padrões emocionais que influenciam suas decisões, relações e sua forma de reagir ao mundo.
      </p>
      <p style="margin-top:10px;">
        Entender isso é o primeiro passo para ter mais controle sobre sua vida, melhorar seus relacionamentos e alcançar seus objetivos.
      </p>
    `;

    // -------------------
    // GRÁFICO
    // -------------------
    const ctx = document.getElementById('grafico').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(contagem).map(k=>nomesBonitos[k]),
        datasets: [{
          label: 'Pontuação por Temperamento',
          data: Object.values(contagem),
          backgroundColor: ['#ef4444','#f59e0b','#3b82f6','#10b981']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, stepSize: 1 } }
      }
    });

    // -------------------
    // PDF
    // -------------------
    document.getElementById("baixarPDF").addEventListener("click", function() {
      const { jsPDF } = window.jspdf; // CORREÇÃO PARA UMD
      const doc = new jsPDF();

      let y = 10;
      doc.setFontSize(16);
      doc.text(`${nome}, esse é o seu resultado:`, 10, y);
      y += 10;

      doc.setFontSize(12);
      doc.text(`Temperamento principal: ${nomesBonitos[principal]}`, 10, y);
      y += 8;
      doc.text(descricao[principal].positivo, 10, y);
      y += 8;
      doc.text(`Ponto de atenção: ${descricao[principal].negativo}`, 10, y);
      y += 8;
      doc.text(`Impacto na vida: ${descricao[principal].impacto}`, 10, y);
      y += 12;
      doc.text(`Temperamento secundário: ${nomesBonitos[secundario]}`, 10, y);
      y += 8;
      doc.text(descricao[secundario].positivo, 10, y);

      doc.save("resultado_temperamento.pdf");
    });

  };

  globalThis.enviarWhats = function () {
    globalThis.open("https://wa.me/5513996621700");
  };

});