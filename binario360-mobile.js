// ======= ELEMENTOS PRINCIPAIS =======
const saldoEl = document.getElementById('saldo');
const recarregarBtn = document.getElementById('recarregar');
const mudarContaBtn = document.getElementById('mudarConta');
const valorInput = document.getElementById('valorEntrada');
const payoutEl = document.getElementById('payout');
const lucroEl = document.getElementById('lucro');
const btnAcima = document.getElementById('btnAcima');
const btnAbaixo = document.getElementById('btnAbaixo');
const tempoVelaPainel = document.getElementById('tempoVelaPainel');
const notificacoes = document.getElementById("notificacoes");
const canvas = document.getElementById("grafico");
const btnHistorico = document.getElementById("btnHistorico");
const parSelecionado = document.getElementById("parSelecionado");

// ======= PAR DE MOEDA (Dropdown) =======
const dropdownParBtn = document.getElementById("dropdownPar");
const dropdownList = document.getElementById("dropdown-list");
const parContainer = dropdownParBtn.closest('.par-container');
const pares = [
  { nome: "EUR/USD", vol: 1.2, vel: 4500 },
  { nome: "GBP/USD", vol: 1.6, vel: 3500 },
  { nome: "BTC/USD", vol: 8.5, vel: 2000 },
  { nome: "ETH/USD", vol: 4.1, vel: 2700 },
  { nome: "USD/JPY", vol: 2.2, vel: 4200 },
  { nome: "AUD/USD", vol: 1.3, vel: 5100 },
  { nome: "USD/BRL", vol: 2.8, vel: 3900 }
];
let parAtualIndex = 5; // AUD/USD como default

function atualizarDropdownPar() {
  dropdownList.innerHTML = "";
  pares.forEach((par, i) => {
    const li = document.createElement("li");
    li.textContent = par.nome;
    li.setAttribute("role", "option");
    li.setAttribute("tabindex", "0");
    if (i === parAtualIndex) {
      li.setAttribute("aria-selected", "true");
      li.style.fontWeight = "bold";
      li.style.background = "#ffc600";
      li.style.color = "#181c23";
    }
    li.onclick = () => {
      if (parAtualIndex !== i) {
        trocarPar(i);
      }
      parContainer.classList.remove('open');
      dropdownParBtn.setAttribute("aria-expanded", "false");
    };
    dropdownList.appendChild(li);
  });
}

dropdownParBtn.onclick = function(e) {
  e.stopPropagation();
  if (parContainer.classList.contains('open')) {
    parContainer.classList.remove('open');
    dropdownParBtn.setAttribute("aria-expanded", "false");
  } else {
    atualizarDropdownPar();
    parContainer.classList.add('open');
    dropdownParBtn.setAttribute("aria-expanded", "true");
    document.addEventListener("click", clickForaDropdown, { once: true });
  }
};

function clickForaDropdown(evt) {
  if (!parContainer.contains(evt.target)) {
    parContainer.classList.remove('open');
    dropdownParBtn.setAttribute("aria-expanded", "false");
  }
}

function trocarPar(novoParIndex) {
  parAtualIndex = novoParIndex;
  parSelecionado.textContent = pares[parAtualIndex].nome;
  // Gera novo cenário de velas
  velas = [];
  linhasOperacao = [];
  let base = 100 + Math.floor(Math.random() * 50) + parAtualIndex * 25;
  for (let i = 0; i < numVelasVisiveis; i++) {
    let open = base + (Math.random() - 0.5) * 2;
    let close = open + (Math.random() - 0.5) * pares[parAtualIndex].vol * 10;
    let high = Math.max(open, close) + Math.random() * pares[parAtualIndex].vol;
    let low = Math.min(open, close) - Math.random() * pares[parAtualIndex].vol;
    velas.push({ open, close, high, low });
    base = close;
  }
  tempoInicio = Date.now();
  if (intervaloVelas) clearInterval(intervaloVelas);
  intervaloVelas = setInterval(() => gerarNovaVela(), pares[parAtualIndex].vel);
  desenharVelas();
}
parSelecionado.textContent = pares[parAtualIndex].nome;

// ======= PERFIL =======
const modalPerfil = document.getElementById('modalPerfil');
const btnPerfil = document.getElementById('btnPerfil');
const fecharPerfil = document.getElementById('fecharPerfil');
const perfilFoto = document.getElementById('perfilFoto');
const perfilUpload = document.getElementById('perfilUpload');
const perfilEmail = document.getElementById('perfilEmail');
const perfilId = document.getElementById('perfilId');
const perfilBandeira = document.getElementById('perfilBandeira');
const perfilPais = document.getElementById('perfilPais');

// ======= DADOS DE EXEMPLO PERFIL =======
const CLIENTE = {
  email: "cliente@exemplo.com",
  id: "007956",
  pais: "Brasil",
  bandeira: "https://flagcdn.com/w20/br.png"
};

// ======= VARIÁVEIS PRINCIPAIS =======
let saldo = 1000;
let payout = 90;
let contaReal = false;
let operacoes = [];
let velas = [];
let tempoInicio = Date.now();
const larguraVela = 12;
const espacamento = 2;
const numVelasVisiveis = 28;
let linhasOperacao = [];
let intervaloVelas = null;

// ======= FUNÇÕES DE UTILIDADE =======
function precoParaY(preco, precoMin, precoMax, height) {
  return height - ((preco - precoMin) / (precoMax - precoMin)) * height;
}
function adicionarLinhaOperacao(preco, direcao, tempoFim, indexVelaEntrada) {
  linhasOperacao.push({ preco, direcao, tempoFim, removida: false, indexVelaEntrada });
}
setInterval(() => {
  const agora = Date.now();
  linhasOperacao.forEach(linha => {
    if (!linha.removida && agora > linha.tempoFim + 5000) {
      linha.removida = true;
    }
  });
}, 1000);

// ======= VELAS =======
function movimentarVelaAtual() {
  if (!velas.length) return;
  const vol = pares[parAtualIndex].vol;
  const vela = velas[velas.length - 1];
  let variacao = (Math.random() - 0.5) * vol * 0.7;
  let novoClose = vela.close + variacao;
  vela.high = Math.max(vela.high, novoClose);
  vela.low = Math.min(vela.low, novoClose);
  vela.close = novoClose;
}
function gerarNovaVela() {
  const vol = pares[parAtualIndex].vol;
  const ultima = velas[velas.length - 1] || { close: 100 };
  const open = ultima.close;
  const close = open + (Math.random() - 0.5) * vol * 10;
  const high = Math.max(open, close) + Math.random() * vol;
  const low = Math.min(open, close) - Math.random() * vol;
  if (velas.length >= numVelasVisiveis) velas.shift();
  velas.push({ open, close, high, low });
  tempoInicio = Date.now();
  verificarOperacoes();
}

function desenharVelas() {
  let graficoDiv = canvas.parentElement;
  let size = Math.min(graficoDiv.clientWidth, graficoDiv.clientHeight);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grade
  const gridColor = "#23262d";
  const gridSpacing = Math.floor(size / 6);
  ctx.save();
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let x = 0; x < size; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y < size; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  ctx.restore();

  // Velas
  const inicio = Math.max(0, velas.length - numVelasVisiveis);
  const fim = velas.length;
  const velasVisiveis = velas.slice(inicio, fim);
  const precos = velasVisiveis.flatMap(v => [v.high, v.low]);
  const max = Math.max(...precos);
  const min = Math.min(...precos);

  const centerVelaX = size / 2;
  const offsetX = centerVelaX - (larguraVela + espacamento) / 2 - (velasVisiveis.length - 1) * (larguraVela + espacamento);
  const escala = size / (max - min + 10);

  for (let i = 0; i < velasVisiveis.length; i++) {
    const v = velasVisiveis[i];
    const x = offsetX + i * (larguraVela + espacamento);
    const yOpen = size - (v.open - min) * escala;
    const yClose = size - (v.close - min) * escala;
    const yHigh = size - (v.high - min) * escala;
    const yLow = size - (v.low - min) * escala;
    const cor = v.close >= v.open ? "#27ae60" : "#e74c3c";
    ctx.strokeStyle = cor;
    ctx.beginPath();
    ctx.moveTo(x + larguraVela / 2, yHigh);
    ctx.lineTo(x + larguraVela / 2, yLow);
    ctx.stroke();
    ctx.fillStyle = cor;
    const altura = Math.abs(yClose - yOpen) || 2;
    ctx.fillRect(x, Math.min(yOpen, yClose), larguraVela, altura);
  }

  // Linhas de operação
  linhasOperacao.forEach(linha => {
    if (linha.removida) return;
    if (linha.indexVelaEntrada == null) return;
    const i = linha.indexVelaEntrada - inicio;
    if (i < 0 || i >= velasVisiveis.length) return;
    const xVela = offsetX + i * (larguraVela + espacamento) + larguraVela / 2;
    const y = precoParaY(linha.preco, min, max, size);

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = linha.direcao === "acima" ? "#27ae60" : "#e74c3c";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 7]);
    ctx.moveTo(0, y);
    ctx.lineTo(xVela, y);
    ctx.stroke();
    ctx.setLineDash([]);
    const texto = `preço ${linha.preco.toLocaleString("pt-BR", { minimumFractionDigits: 3 })}`;
    ctx.font = "bold 13px Inter, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    const textPadding = 8;
    const textH = 18;
    const textW = ctx.measureText(texto).width + 2 * textPadding;
    const boxX = xVela - textW / 2;
    const boxY = y - 30;
    ctx.fillStyle = "#23262d";
    ctx.fillRect(boxX, boxY, textW, textH);
    ctx.strokeStyle = linha.direcao === "acima" ? "#27ae60" : "#e74c3c";
    ctx.strokeRect(boxX, boxY, textW, textH);
    ctx.fillStyle = "#fff";
    ctx.fillText(texto, xVela, boxY + textH / 2);
    ctx.beginPath();
    ctx.arc(xVela, y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = linha.direcao === "acima" ? "#27ae60" : "#e74c3c";
    ctx.fill();
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(linha.direcao === "acima" ? "▲" : "▼", xVela, y);
    ctx.restore();
  });

  // Preço atual
  if (velasVisiveis.length > 0) {
    const precoAtual = velasVisiveis[velasVisiveis.length - 1].close;
    const yAtual = size - (precoAtual - min) * escala;
    ctx.save();
    ctx.strokeStyle = "#ffc600";
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, yAtual);
    ctx.lineTo(size, yAtual);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#ffc600";
    ctx.fillText(`Preço atual: ${precoAtual.toLocaleString("pt-BR", { minimumFractionDigits: 3 })}`, 12, yAtual - 8);
    ctx.restore();
  }
}
window.addEventListener('resize', desenharVelas);

// ======= ANIMAÇÃO =======
let ultimoMovimento = Date.now();
function animar() {
  if (Date.now() - ultimoMovimento > 100) {
    movimentarVelaAtual();
    ultimoMovimento = Date.now();
  }
  desenharVelas();
  const tempoRestanteMs = Math.max(0, pares[parAtualIndex].vel - (Date.now() - tempoInicio));
  const segundos = Math.ceil(tempoRestanteMs / 1000);
  tempoVelaPainel.textContent = `Vela atual: 00:${segundos.toString().padStart(2, '0')}`;
  requestAnimationFrame(animar);
}

// ======= ENTRADAS E OPERAÇÕES =======
function iniciarOperacao(direcao) {
  const valor = parseFloat(valorInput.value);
  if (isNaN(valor) || valor < 5 || valor > saldo) {
    criarNotificacao("Valor inválido para operação!", "erro");
    valorInput.focus();
    return;
  }
  saldo -= valor;
  atualizarSaldo();
  const entrada = velas[velas.length - 1].close;
  const indiceVela = velas.length - 1;
  const duracao = 20000;
  adicionarLinhaOperacao(entrada, direcao, Date.now() + duracao, indiceVela);
  operacoes.push({
    valor, direcao, entrada,
    tempo: Date.now(),
    payout,
    finalizada: false,
    par: pares[parAtualIndex].nome,
    resultado: null,
    dataFinal: null
  });
}
function verificarOperacoes() {
  const agora = Date.now();
  operacoes.forEach(op => {
    if (!op.finalizada && agora - op.tempo >= 20000) {
      const ultima = velas[velas.length - 1];
      const ganho = (op.direcao === "acima" && ultima.close > op.entrada)
        || (op.direcao === "abaixo" && ultima.close < op.entrada);
      const lucro = ganho ? op.valor * (op.payout / 100) : -op.valor;
      op.resultado = ganho ? "bom" : "ruim";
      op.dataFinal = Date.now();
      op.finalizada = true;
      if (ganho) {
        saldo += op.valor + lucro;
        criarNotificacao("✅ Deu bom!", "sucesso");
      } else {
        criarNotificacao("❌ Deu ruim!", "erro");
      }
      atualizarSaldo();
      if (modalHistorico.style.display === "flex") renderHistorico();
    }
  });
}

// ======= SALDO E LUCRO =======
function atualizarSaldo() {
  saldoEl.textContent = `R$${saldo.toFixed(2)}`;
  btnAcima.disabled = saldo < 5;
  btnAbaixo.disabled = saldo < 5;
}
function calcularLucro() {
  const valor = parseFloat(valorInput.value);
  if (isNaN(valor) || valor < 5) {
    lucroEl.textContent = "R$0,00";
  } else {
    lucroEl.textContent = `R$${(valor * payout / 100).toFixed(2)}`;
  }
}

// ======= NOTIFICAÇÕES =======
function criarNotificacao(msg, tipo = "") {
  const div = document.createElement("div");
  div.className = `notificacao ${tipo}`;
  div.textContent = msg;
  notificacoes.appendChild(div);
  setTimeout(() => div.remove(), 3300);
}

// ======= EVENTOS =======
recarregarBtn.onclick = () => { saldo = 1000; atualizarSaldo(); criarNotificacao("Saldo recarregado!", "sucesso"); };
mudarContaBtn.onclick = () => {
  contaReal = !contaReal;
  if (contaReal) {
    mudarContaBtn.textContent = "Conta Demo";
    saldo = 5;
    saldoEl.classList.add("saldo-real");
    recarregarBtn.style.display = "none";
    criarNotificacao("Conta real ativada!", "sucesso");
  } else {
    mudarContaBtn.textContent = "Conta Real";
    saldo = 1000;
    saldoEl.classList.remove("saldo-real");
    recarregarBtn.style.display = "inline-block";
    criarNotificacao("Conta demo ativada!", "sucesso");
  }
  atualizarSaldo();
};
valorInput.addEventListener("input", calcularLucro);
btnAcima.onclick = () => iniciarOperacao("acima");
btnAbaixo.onclick = () => iniciarOperacao("abaixo");

// ======= MODAL HISTÓRICO =======
const modalHistorico = document.getElementById("modalHistorico");
const historicoOperacoes = document.getElementById("historicoOperacoes");
const fecharHistorico = document.getElementById("fecharHistorico");
btnHistorico.onclick = () => {
  renderHistorico();
  modalHistorico.style.display = "flex";
};
fecharHistorico.onclick = () => modalHistorico.style.display = "none";
modalHistorico.onclick = e => {
  if (e.target === modalHistorico) modalHistorico.style.display = "none";
};
function renderHistorico() {
  if (!operacoes.length) {
    historicoOperacoes.innerHTML = `<div style="color:#b6b6b6;text-align:center;margin-top:18px;">Nenhuma operação realizada.</div>`;
  } else {
    historicoOperacoes.innerHTML = operacoes
      .slice().reverse()
      .map(op => {
        let statusStr = "";
        let statusClass = "";
        let icone = "";
        if (!op.finalizada) {
          statusStr = "PENDENTE";
          statusClass = "";
          icone = "⏳";
        } else if (op.resultado === "bom") {
          statusStr = "deu bom";
          statusClass = "sucesso";
          icone = "✅";
        } else {
          statusStr = "deu ruim";
          statusClass = "erro";
          icone = "❌";
        }
        const direcao = op.direcao === "acima" ? "Acima" : "Abaixo";
        const direcaoClass = op.direcao;
        const dataStr = (op.finalizada
          ? new Date(op.dataFinal)
          : new Date(op.tempo)
        ).toLocaleDateString('pt-BR', {day:"2-digit", month:"2-digit"}) + " " +
          (op.finalizada
            ? new Date(op.dataFinal)
            : new Date(op.tempo)
          ).toLocaleTimeString('pt-BR', {hour:"2-digit",minute:"2-digit",second:"2-digit"});
        return `<div class="historico-item ${statusClass}">
          <span class="historico-icone">${icone}</span>
          <div class="historico-info">
            <span class="historico-direcao ${direcaoClass}">${direcao}</span>
            <span>
              <span class="historico-valor">R$${op.valor.toFixed(2)}</span>
              <span class="historico-resultado ${statusClass}">${statusStr}</span>
            </span>
            <span class="historico-dt">${dataStr}</span>
          </div>
        </div>`;
      }).join("");
  }
}

// ======= DATA/HORA =======
function atualizarDataHoraFooter() {
  const agora = new Date();
  const dia = agora.getDate();
  const mes = agora.toLocaleString('pt-BR', { month: 'long' });
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('dataHoraFooter').textContent =
    `${dia} ${mes} ${agora.getFullYear()}, ${hora}`;
}
setInterval(atualizarDataHoraFooter, 1000);
atualizarDataHoraFooter();

// ======= MODAL PERFIL =======
btnPerfil.onclick = () => {
  perfilEmail.textContent = CLIENTE.email;
  perfilId.textContent = "ID: " + CLIENTE.id;
  perfilBandeira.src = CLIENTE.bandeira;
  perfilBandeira.alt = CLIENTE.pais.substring(0,2).toUpperCase();
  perfilPais.textContent = CLIENTE.pais;
  modalPerfil.style.display = "flex";
};
fecharPerfil.onclick = () => modalPerfil.style.display = "none";
modalPerfil.onclick = e => { if (e.target === modalPerfil) modalPerfil.style.display = "none"; };
perfilUpload.onchange = function(ev) {
  if (this.files && this.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) { perfilFoto.src = e.target.result; };
    reader.readAsDataURL(this.files[0]);
  }
};
document.getElementById("perfilDeposito").onclick = () => criarNotificacao("Em breve: Depósito.", "sucesso");
document.getElementById("perfilRetirada").onclick = () => criarNotificacao("Em breve: Retirada.", "sucesso");
document.getElementById("perfilSuporteModal").onclick = () => criarNotificacao("Em breve: Suporte no perfil!", "sucesso");
document.getElementById("perfilConfiguracoes").onclick = () => criarNotificacao("Em breve: Configurações.", "sucesso");

// ======= INICIALIZAÇÃO =======
payoutEl.textContent = `${payout}%`;
for (let i = 0; i < numVelasVisiveis; i++) gerarNovaVela();
atualizarDropdownPar();
parSelecionado.textContent = pares[parAtualIndex].nome;
if (intervaloVelas) clearInterval(intervaloVelas);
intervaloVelas = setInterval(() => gerarNovaVela(), pares[parAtualIndex].vel);
atualizarSaldo();
calcularLucro();
animar();
