import { joinGame, registerPlayer } from '../API/api.js';

document.addEventListener('DOMContentLoaded', () => {

  const nick = document.getElementById("utilizador").value;
  const password = document.getElementById("password").value;

  function entrar(nick, password) {
    isLoggedIn = registerPlayer(nick, password);
  }

  document.getElementById("entrar").addEventListener("click", function (ev) {
    ev.preventDefault();
    entrar(nick, password);
  });

  // Referencia o elemento do tabuleiro
  const tabuleiroElement = document.getElementById('tabuleiro');

  document.getElementById('iniciarJogo').addEventListener('click', () => {
    const tamanhoTabuleiro = parseInt(document.getElementById('tamanhoTabuleiro').value);
    const primeiroJogador = document.getElementById('primeiroJogador').value === "jogador" ? "Player 1" : "Player 2";
    const dificuldade = document.getElementById('nivelIA').value; // nova opção para escolher dificuldade
    const modoDeJogo = document.getElementById('modoDeJogo').value; // 

    const gameState = new GameState(tamanhoTabuleiro, primeiroJogador, dificuldade, tabuleiroElement, modoDeJogo);

    gameState.iniciarJogo();

    if (modoDeJogo === "multiplayer") {
      joinGame(nick, password, tamanhoTabuleiro);
    }

  });

  const instrucoes = document.getElementById('modal-instrucoes');
  const botaoVerInstrucoes = document.getElementById('verInstrucoes'); // Supondo que você tenha um botão com id 'verInstrucoes'
  const botaoFecharInstrucoes = document.querySelector('.close'); // O botão de fechar no modal

  // Exibe o modal
  botaoVerInstrucoes.addEventListener('click', () => {
    instrucoes.style.display = 'flex'; // Usa flex para centralizar o modal
  });

  // Fecha o modal quando clicar no botão de fechar
  botaoFecharInstrucoes.addEventListener('click', () => {
    instrucoes.style.display = 'none';
  });

  // Fecha o modal quando clicar fora do conteúdo
  instrucoes.addEventListener('click', (event) => {
    // Verifica se o clique foi na área de fundo, ou seja, fora do conteúdo do modal
    if (event.target === instrucoes) {
      instrucoes.style.display = 'none';
    }
  });

  // Impede o clique no conteúdo do modal de fechar o modal
  const modalContent = document.querySelector('.modal-content'); // A classe que envolve o conteúdo do modal
  modalContent.addEventListener('click', (event) => {
    event.stopPropagation(); // Impede a propagação do clique para a área do fundo
  });

  const modalClassificacoes = document.getElementById('modal-classificacoes');
  const botaoVerClassificacoes = document.getElementById('verClassificacoes'); // Botão para abrir a classificação
  const botaoFecharClassificacoes = document.querySelector('.close-classificacoes'); // O botão de fechar no modal

  // Exibe o modal
  botaoVerClassificacoes.addEventListener('click', () => {
    modalClassificacoes.style.display = 'flex'; // Exibe o modal
  });

  // Fecha o modal quando clicar no botão de fechar
  botaoFecharClassificacoes.addEventListener('click', () => {
    modalClassificacoes.style.display = 'none';
  });

  // Fecha o modal quando clicar fora do conteúdo
  modalClassificacoes.addEventListener('click', (event) => {
    // Verifica se o clique foi na área de fundo, ou seja, fora do conteúdo do modal
    if (event.target === modalClassificacoes) {
      modalClassificacoes.style.display = 'none';
    }
  });

  // Impede o clique no conteúdo do modal de fechar o modal
  const modalContentClassificacoes = document.querySelector('.modal-content-classificacoes'); // A classe que envolve o conteúdo do modal
  modalContentClassificacoes.addEventListener('click', (event) => {
    event.stopPropagation(); // Impede a propagação do clique para a área do fundo
  });



});
