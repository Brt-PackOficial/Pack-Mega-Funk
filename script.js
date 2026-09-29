// Dados configurados
const SEU_NUMERO_WHATSAPP = "5598987261116";

// Chaves Pix para cada opção
const CODIGO_PIX_BASE = "00020126730014BR.GOV.BCB.PIX0114+55989872611160233Pack Mega Funk - Brota Tchuca Ofc520400005303986540515.905802BR5925VINICIUS ALVES DE OLIVEIR6009SAO PAULO622605225Ellz6l6HeScJIFcWvo0BY6304DEFB";
const CODIGO_PIX_COMBO = "00020126360014BR.GOV.BCB.PIX0114+5598987261116520400005303986540538.905802BR5925VINICIUS ALVES DE OLIVEIR6009SAO PAULO622605221mkrSuLYX6wgSCMhkIU6MP6304F597";

// Atualiza o Pix e QR Code conforme o estado da caixa
function updatePixData() {
  const isChecked = document.getElementById("bumpCheckbox").checked;
  const activePix = isChecked ? CODIGO_PIX_COMBO : CODIGO_PIX_BASE;
  const currentPrice = isChecked ? "38,90" : "15,90";
  
  // Atualiza textos de valores
  document.getElementById("displayPrice").innerText = currentPrice;
  document.getElementById("modalTotalPrice").innerText = `R$ ${currentPrice}`;
  
  // Insere a chave ativa no campo
  document.getElementById("pixCode").value = activePix;
  
  // Atualiza o QR Code
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(activePix)}`;
  document.getElementById("qrCodeImg").src = qrApiUrl;
}

// Clique no checkbox
function toggleOrderBump(e) {
  e.stopPropagation();
  updatePixData();
}

// Clique na caixa completa do Order Bump
function toggleOrderBumpByCard() {
  const checkbox = document.getElementById("bumpCheckbox");
  checkbox.checked = !checkbox.checked;
  updatePixData();
}

// Inicializa dados no carregamento
updatePixData();

// Abrir Modal e Travar a Rolagem do Fundo
function openModal() {
  document.getElementById("paymentModal").classList.add("active");
  document.body.classList.add("no-scroll");
}

// Fechar Modal e Destravar a Rolagem
function closeModal() {
  document.getElementById("paymentModal").classList.remove("active");
  document.body.classList.remove("no-scroll");
}

// Copiar Pix sem Alert + Texto no Próprio Botão
function copyPixCode() {
  const pixTextarea = document.getElementById("pixCode");
  const copyBtn = document.getElementById("copyBtn");
  
  pixTextarea.select();
  pixTextarea.setSelectionRange(0, 99999);
  
  const updateButtonSuccess = () => {
    copyBtn.classList.add("copied");
    copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Código Copiado!`;
    
    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copiar Código Pix`;
    }, 2000);
  };
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(pixTextarea.value).then(updateButtonSuccess).catch(() => {
      document.execCommand("copy");
      updateButtonSuccess();
    });
  } else {
    document.execCommand("copy");
    updateButtonSuccess();
  }
}

// Validação de E-mail + Redirecionamento WhatsApp
function sendWhatsapp() {
  const emailInput = document.getElementById("userEmail").value.trim();
  const isChecked = document.getElementById("bumpCheckbox").checked;
  const valorTotal = isChecked ? "38,90" : "15,90";
  const itemExtra = isChecked ? "\n• Inclui: Pasta de Músicas Extra (R$ 23,00)" : "";
  
  if (!emailInput || !emailInput.includes("@") || !emailInput.includes(".")) {
    alert("Por favor, preencha um e-mail válido antes de enviar o comprovante!");
    document.getElementById("userEmail").focus();
    return;
  }
  
  const mensagem = `Olá, Brota Tchuca Oficial! Fiz o pagamento de R$ ${valorTotal} do Repertório Mega Funk.${itemExtra}\n\nSegue o comprovante em anexo.\nMeu e-mail para liberação do acesso: *${emailInput}*`;
  
  const urlWhatsapp = `https://api.whatsapp.com/send?phone=${SEU_NUMERO_WHATSAPP}&text=${encodeURIComponent(mensagem)}`;
  
  window.open(urlWhatsapp, "_blank");
}

// ========================================================
// BLOQUEIO DE DOWNLOAD/CLIQUE DIREITO EM IMAGENS
// ========================================================
document.addEventListener('contextmenu', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

document.addEventListener('dragstart', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// ========================================================
// BLOQUEIO TOTAL DE ZOOM (PC E MOBILE)
// ========================================================

// Bloqueia atalhos de zoom no teclado (Ctrl + +, Ctrl + -, Ctrl + 0)
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0' || e.keyCode === 187 || e.keyCode === 189 || e.keyCode === 48 || e.keyCode === 96 || e.keyCode === 107 || e.keyCode === 109)) {
    e.preventDefault();
  }
});

// Bloqueia zoom com a roda do mouse (Ctrl + Wheel)
document.addEventListener('wheel', function(e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// Bloqueia toque de múltiplos dedos (pinça de zoom no mobile)
document.addEventListener('touchstart', function(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// Bloqueia toque duplo rápido que causa zoom no mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);
