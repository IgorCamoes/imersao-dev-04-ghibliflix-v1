// Pegar elementos da DOM que precisam ser iniciados agora

const mainWrapper = document.querySelector(".main-wrapper");

// Função para criar uma animação de fade-out e fade-in no elemento

const FadeAnimation = (elem) => {
  elem.classList.add("f-o-i");
  setTimeout(() => {
    elem.classList.remove("f-o-i");
  }, 750);
};

// Função que faz a requisição na GhibliAPI, manda a resposta para a função MostrarCapas() e então tira a classe de opacidade 0 do .main-wrapper

const FetchCapa = () => {
  fetch("https://ghibliapiforked.onrender.com/films")
    .then((lista) => lista.json())
    .then((lista) => {
      MostrarCapas(lista);
    });
  mainWrapper.classList.remove("opacity-0");
};

// Criação das variáveis que serão cruciais para a manipulação de dados e navegação

let listaAtual = [];
let filmeCards;

// Função que renderiza as capas, ela primeiro pega a lista da requisição e atrela ao array que existe localmente (listaAtual) para não precisar fazer uma requisição depois da primeira, então adiciona a div de grade que vai fazer o papel de deixar os cards alinhados para depois ler o array de filmes da listaAtual e adicionar um código html dinâmico para cada filme que encontrar no array dentro da div que tem a classe grade

const MostrarCapas = (lista) => {
  listaAtual = lista;

  mainWrapper.insertAdjacentHTML("afterbegin", '<div class="grade"></div>');

  let grade = document.querySelector(".grade");

  for (let filme of listaAtual) {
    let tagFilme = `
    <div class="filme-card" filme-id="${filme.id}">
      <p class="titulo">${filme.title}</p>
      <img src="${filme.image}" alt="${filme.title}'s cover image." class="capa">
    </div>
    `;
    grade.insertAdjacentHTML("afterbegin", tagFilme);
  }

  // Armazena todos os cards renderizados em uma variável para depois criar uma função que manda o id do filme daquele card para a função que vai criar a página daquele filme que o usuário clicou, também usa a função de animação que foi criada no inicio para ter um efeito bacana

  filmeCards = document.querySelectorAll(".filme-card");

  filmeCards.forEach((card) => {
    card.addEventListener("click", () => {
      let id = card.getAttribute("filme-id");
      CriarAbout(id);
      FadeAnimation(mainWrapper);
    });
  });
};

// Função que cria a página do filme selecionado anteriormente pelo usuário, ela primeiro procura o filme no array listaAtual utilizando o id fornecido na chamada da função e guarda aquele objeto do filme dentro da variável filmeAtual

const CriarAbout = (id) => {
  mainWrapper.innerHTML = "";
  let filmeAtual = listaAtual.find((filme) => filme.id == id);

  // Cria o template do html dinâmico que será alimentado com os dados do filme selecionado com todas as informações e uma imagem que será usada como botão para voltar aos cards de todos os filmes

  let templateFilmeAtual = `
  <div class="filme-about">
    <span class="voltar"><img src="https://cdn-icons-png.flaticon.com/512/507/507257.png" width="25px"></span>
    <div class="info">
      <h2>${filmeAtual.title}</h2>
      <hr>
      <p class="titulo">${filmeAtual.original_title_romanised} - ${filmeAtual.original_title}</p>
      <p>${filmeAtual.description}</p>
      <img src="${filmeAtual.movie_banner}">
    </div>
    <div class="capa">
      <img src="${filmeAtual.image}" alt="${filmeAtual.title}'s cover image."> <br>
      <hr>
      <p>Director: ${filmeAtual.director}</p>
      <p>Producers: ${filmeAtual.producer}</p>
      <p>Release year: ${filmeAtual.release_date}</p>
      <p>Duration: ${filmeAtual.running_time} minutes</p>
    </div>
  </div>
  `;

  // Adiciona o template no html dentro da div com a classe "main-wrapper"

  mainWrapper.insertAdjacentHTML("afterbegin", templateFilmeAtual);

  // Criação da variável que traz a imagem com a classe "voltar" para o js

  let voltar = document.querySelector(".voltar");

  // Cria uma função anônima que sempre é ativada quando o usuário clica na imagem da setinha para voltar, essa função apaga todo o código dentro do .main-wrapper e chama a função de renderizar os cards dos filmes, e por fim, também chama a função de animação de fade

  voltar.onclick = () => {
    mainWrapper.innerHTML = "";
    MostrarCapas(listaAtual);
    FadeAnimation(mainWrapper);
  };
};

// Primeira e única chamada da função que faz a requisição à API

FetchCapa();
