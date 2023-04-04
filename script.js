var date, minutos;

const chat_container = document.querySelector(".chat-container");
chat_container.style.transform = `translateX(${-450}px)`;
const chat = $(".chat-container .chat");
const btn_esquerda = document.querySelector('.btn-esquerda')
const btn_direita = document.querySelector('.btn-direita')
let idx = 0;
  
function carrossel_esquerda(){
    idx++; 
    if (idx > 0) {
      btn_esquerda.style.display = 'none';
    } else {
      btn_esquerda.style.display = 'block';
    }

    if (idx < 0) {
      btn_direita.style.display = 'none';
    } else {
      btn_direita.style.display = 'block';
    }
    let currentValue = parseInt(chat_container.style.transform.match(/-?\d+/)[0]);
    chat_container.style.transform = `translateX(${currentValue + 490}px)`;
}

  
function carrossel_direita(){
  idx--; 
  if (idx < 0) {
    btn_direita.style.display = 'none';
  } else {
    btn_direita.style.display = 'block';
  }

  if (idx > 0) {
    btn_esquerda.style.display = 'none';
  } else {
    btn_esquerda.style.display = 'block';
  }
  let currentValue = parseInt(chat_container.style.transform.match(/-?\d+/)[0]);
  chat_container.style.transform = `translateX(${currentValue - 490}px)`;
}

$(document).ready(function () {
  respostaMessagem(1,null,true);
  respostaMessagem(2,null,true);
  respostaMessagem(3,null,true);
  respostaMessagem(4,null,true);
  respostaMessagem(5,null,true);
});

function updateScrollbar(chat) {
    var $messages = $(`.msg${chat} .messages-content`);
  if ($messages.length) {
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }
}

function setDate() {
  date = new Date();
  if (minutos != date.getMinutes()) {
    minutos = date.getMinutes();
    $('<div class="timestamp">' + date.getHours() + ":" + minutos + "</div>").appendTo($('.message:last'));
  }
}

function insertMessage(chat) {
    var $messages = $(`.msg${chat} .messages-content`).first();
  console.log( $messages);
  msg = $(`#input-${chat}`).val();
  if ($.trim(msg) == "") {
    return false;
  }
  $('<div class="message message-personal">' + msg + "</div>").appendTo($messages).addClass("new");
  setDate();
  $(`#input-${chat}`).val(null);
  updateScrollbar(chat);
  setTimeout(function () {
    respostaMessagem(chat,msg,false);
  }, 3000);
}

var msgInicio = [
  "O destino raramente nos chama no momento de nossa escolha. Me diga seu problema humano.",
  "Eu voltarei. Do que precisa?",
  "Vivo ou morto, você vem comigo. Quais são suas últimas perguntas?",
  "Como a humanidade será salva se não for permitida que evolua? Como posso te ajudar a evoluir?",
  "Bip-bip-bop-bip-bop-bip. ¿?",
];

const respostaMessagem = async(chat,msgPergunta,inicio) => {
  var $messages = $(`.msg${chat} .messages-content`).first();
  msg = $(`#input-${chat}`).val();
  if ($.trim(msg) != "") {
    return false;
  }
  $(`<div class="message loading new"><figure class="avatar"><img src="./assets/avatar-${chat}.jpeg" /></figure><span></span></div>`).appendTo($messages);
  updateScrollbar(chat);
  if (inicio){
    setTimeout(function () {
      $(".message.loading").remove();
      $(`<div class="message new"><figure class="avatar"><img src="./assets/avatar-${chat}.jpeg" /></figure>${msgInicio[chat-1]}</div>`).appendTo($messages).addClass("new");
      setDate();
      updateScrollbar(chat);
    }, 3000);
  } else {
    const chatGPTResponse = await chatGPTAPI(msgPergunta,chat);
    setTimeout(function () {
      $(".message.loading").remove();
      $(`<div class="message new"><figure class="avatar"><img src="./assets/avatar-${chat}.jpeg" /></figure>${chatGPTResponse}</div>`).appendTo($messages).addClass("new");
      setDate();
      updateScrollbar(chat);
    }, 3000);
  }
}


const chatGPTAPI = async (prompt,chat) => {
  const apiKey = [
    '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',
    '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',
    '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',
    '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',
    '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'
  ]; 

  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey[chat-1]}`
  };

  const body = JSON.stringify({
    messages: [{role: "user", content: prompt}],
    model: 'gpt-3.5-turbo'
  });

  try {
    const response = await fetch(apiUrl, { method: 'POST', headers, body });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching ChatGPT API:', error);
    return 'Erro ao buscar a resposta do ChatGPT.';
  }
};

