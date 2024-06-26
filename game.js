const grid = document.querySelector(".grid");

class Matriz {
    constructor(tamanho, quantidadeNavios, quantidadeBombas) {
        this.tamanho = tamanho;
        this.quantidadeNavios = quantidadeNavios;
        this.quantidadeBombas = quantidadeBombas;
        this.matriz = this.criarMatrizVazia();
        this.adicionarElementos();
    }

    criarMatrizVazia() {
        let matriz = [];
        for (let i = 0; i < this.tamanho; i++) {
            matriz[i] = [];
            for (let j = 0; j < this.tamanho; j++) {
                matriz[i][j] = 0;
            }
        }
        return matriz;
    }

    criaNavio(tamanhoNavio, navio) {
        let linha = Math.floor(Math.random() * this.matriz.length);
        let coluna = Math.floor(Math.random() * this.matriz.length);

        while (this.matriz[linha][coluna] != 0) {
            linha = Math.floor(Math.random() * this.matriz.length);
            coluna = Math.floor(Math.random() * this.matriz.length);
        }

        this.matriz[linha][coluna] = navio;

        let direcao = Math.floor(Math.random() * 2);

        if (direcao == 0) {
            for (let i = 1; i < tamanhoNavio; i++) {
                if (
                    coluna + i < this.matriz.length &&
                    this.matriz[linha][coluna + i] == 0
                ) {
                    this.matriz[linha][coluna + i] = navio;
                } else {
                    for (let j = 0; j < i; j++) {
                        this.matriz[linha][coluna + j] = 0;
                    }
                    this.criaNavio(tamanhoNavio, navio);
                    return;
                }
            }
        } else {
            for (let i = 1; i < tamanhoNavio; i++) {
                if (
                    linha + i < this.matriz.length &&
                    this.matriz[linha + i][coluna] == 0
                ) {
                    this.matriz[linha + i][coluna] = navio;
                } else {
                    for (let j = 0; j < i; j++) {
                        this.matriz[linha + j][coluna] = 0;
                    }
                    this.criaNavio(tamanhoNavio, navio);
                    return;
                }
            }
        }
    }

    adicionarElemento(elemento, quantidadeElemento) {
        for (let i = 0; i < quantidadeElemento; i++) {
            let linha = Math.floor(Math.random() * this.matriz.length);
            let coluna = Math.floor(Math.random() * this.matriz.length);

            while (this.matriz[linha][coluna] != 0) {
                linha = Math.floor(Math.random() * this.matriz.length);
                coluna = Math.floor(Math.random() * this.matriz.length);
            }
            this.matriz[linha][coluna] = elemento;
        }
    }

    adicionarElementos() {
        this.adicionarElemento(9, this.quantidadeBombas);
        this.adicionarElemento(8, 2);
        for (let i = 1; i < this.quantidadeNavios + 1; i++) {
            this.criaNavio(3, i, this.matriz);
        }
    }

    identificarCelula(celula) {
        let string;
        switch (celula) {
            case 0:
                string = "Wave";
                break;
            case 8:
                string = "escudo";
                break;
            case 9:
                string = "Bomb";
                break;
            default:
                string = `Ship-${celula}`;
                break;
        }
        return string;
    }

    gerarArrayStrings() {
        let arrayStrings = [];
        this.matriz.forEach((linha, linhaIndice) => {
            arrayStrings[linhaIndice] = [];
            linha.forEach((celula, colunaIndice) => {
                let string = this.identificarCelula(celula);
                arrayStrings[linhaIndice][colunaIndice] = string;
            });
        });
        return arrayStrings;
    }
}

class Tabuleiro {
    constructor(arrayStrings) {
        this.arrayStrings = arrayStrings;
        this.carregarJogo();
    }

    criarElemento(tag, nomeClasse) {
        const elemento = document.createElement(tag);
        elemento.className = nomeClasse;
        return elemento;
    }

    criarCard(elemento, isNavio, linha, coluna) {
        const card = this.criarElemento("div", "card");
        const front = this.criarElemento("div", "face front");
        const back = this.criarElemento("div", "face back");

        card.addEventListener("click", (event) => this.revelarCard(event));

        front.classList.add(`${elemento}`);

        card.appendChild(front);
        card.appendChild(back);

        card.setAttribute("data-linha", linha);
        card.setAttribute("data-coluna", coluna);

        if (isNavio) {
            card.setAttribute("data-navio", elemento);
        }

        return card;
    }

    isNavioHorizontal(qualNavio) {
        for (let i = 0; i < this.arrayStrings.length; i++) {
            let quantidadeNaviosLinha = 0;
            for (let j = 0; j < this.arrayStrings[i].length; j++) {
                if (this.arrayStrings[i][j] == qualNavio) {
                    quantidadeNaviosLinha += 1;
                }
            }
            if (quantidadeNaviosLinha === 1) {
                return true;
            }
        }
        return false;
    }

    estilizarPontasNavios() {
        for (let i = 1; i < matriz.quantidadeNavios + 1; i++) {
            const partesNavio = document.querySelectorAll(
                `[data-navio="Ship-${i}"]`
            );
            const linha = parseInt(partesNavio[0].getAttribute("data-linha"));
            if (this.isNavioHorizontal(`Ship-${i}`, linha)) {
                partesNavio[0].children[0].classList.add(
                    "primeira-extremidade-navio-vertical"
                );
                partesNavio[partesNavio.length - 1].children[0].classList.add(
                    "ultima-extremidade-navio-vertical"
                );
            } else {
                partesNavio[0].children[0].classList.add(
                    "primeira-extremidade-navio-horizontal"
                );
                partesNavio[partesNavio.length - 1].children[0].classList.add(
                    "ultima-extremidade-navio-horizontal"
                );
            }
        }
    }

    revelarCard = (event) => {
        const card = event.target.parentNode;
        if (
            player.venceu ||
            player.perdeu ||
            card.classList.contains("grid") ||
            card.classList.contains("card-revelado")
        )
            return;

        const isNavio = card.hasAttribute("data-navio");

        card.classList.add("card-revelado");

        const cardVirado = card.children[0];
        cardVirado.style.opacity = "1";

        return player.clicou(cardVirado, this, isNavio);
    };

    mostrarCard(card) {
        if (!card.children || !card.children[0]) return; // Verifica se card possui elementos filhos
        if (card.classList.contains("card-revelado")) return;

        card.classList.add("card-revelado");

        const cardVirado = card.children[0];
        cardVirado.style.opacity = "1";
    }

    revelarTabuleiro() {
        const cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
            if (!card.classList.contains("card-revelado")) {
                this.mostrarCard(card);
            }
        });
    }

    abrirCelulasProximasNavio = (parteNavio) => {
        const navio = document.querySelectorAll(`[data-navio="${parteNavio}"]`);

        const partesTotaisNavio = document.querySelectorAll(`.${parteNavio}`);
        this.piscarNavioDerrubado(partesTotaisNavio);

        navio.forEach((parte) => {
            const linha = parseInt(parte.getAttribute("data-linha"));
            const coluna = parseInt(parte.getAttribute("data-coluna"));

            const coordenadasProximas = [
                { linha: linha - 1, coluna: coluna },
                { linha: linha + 1, coluna: coluna },
                { linha: linha, coluna: coluna - 1 },
                { linha: linha, coluna: coluna + 1 },
            ];

            coordenadasProximas.forEach((coordenada) => {
                if (
                    coordenada.linha >= 0 &&
                    coordenada.linha < this.arrayStrings.length &&
                    coordenada.coluna >= 0 &&
                    coordenada.coluna < this.arrayStrings[0].length
                ) {
                    const celulaProxima = document.querySelector(
                        `[data-linha="${coordenada.linha}"][data-coluna="${coordenada.coluna}"]`
                    );

                    if (
                        celulaProxima &&
                        !celulaProxima.classList.contains("card-revelado")
                    ) {
                        celulaProxima.classList.add("card-revelado");
                        celulaProxima.children[0].style.opacity = "0.8";
                        setTimeout(function () {
                            celulaProxima.classList.remove("card-revelado");
                            celulaProxima.children[0].style.opacity = "0";
                        }, 1000);
                    }
                }
            });
        });
    };

    derrubouNavio(parteNavio) {
        const partesTotaisNavio = document.querySelectorAll(
            `[data-navio="${parteNavio}"]`
        );

        let isNavioDerrubado = true;

        partesTotaisNavio.forEach((parte) => {
            if (!parte.classList.contains("card-revelado")) {
                isNavioDerrubado = false;
            }
        });

        return isNavioDerrubado;
    }

    piscarNavioDerrubado(partesTotaisNavio) {
        partesTotaisNavio.forEach((navio) => {
            for (let i = 0; i < 3; i++) {
                setTimeout(function () {
                    navio.classList.add("pisca-navio");

                    setTimeout(function () {
                        navio.classList.remove("pisca-navio");
                    }, 150);
                }, i * 300);
            }
            navio.classList.add("navio-derrubado");
        });
    }

    revelarBombasTemporariamente() {
        const bombas = document.querySelectorAll(".Bomb");

        bombas.forEach((bomba) => {
            const card = bomba.parentNode;
            if (!card.classList.contains("card-revelado")) {
                card.classList.add("card-revelado");
                card.children[0].style.opacity = "1";

                setTimeout(function () {
                    card.classList.remove("card-revelado");
                    card.children[0].style.opacity = "0";
                }, 1300);
            }
        });
    }

    adicionarIndices(isColuna, indiceLetra) {
        if (isColuna) {
            let imagem = this.criarElemento("img", "card");
            imagem.src = "IconesBatalhaNaval/caveira.png";
            grid.appendChild(imagem);
            for (let i = 0; i < this.arrayStrings.length; i++) {
                let indiceColuna = this.criarElemento("div", "indiceColuna");
                indiceColuna.textContent = i + 1;
                grid.appendChild(indiceColuna);
            }
        } else {
            let listaLetras = [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
            ];
            let indiceLinha = this.criarElemento("div", "indiceLinha");
            indiceLinha.textContent = listaLetras[indiceLetra];
            grid.appendChild(indiceLinha);
        }
    }

    carregarJogo() {
        this.adicionarIndices("coluna");
        this.arrayStrings.forEach((linha, indiceLinha) => {
            this.adicionarIndices(false, indiceLinha);
            linha.forEach((celula, indiceColuna) => {
                let isNavio = false;
                if (
                    celula !== "Wave" &&
                    celula !== "escudo" &&
                    celula !== "Bomb"
                ) {
                    isNavio = true;
                }
                const card = this.criarCard(
                    celula,
                    isNavio,
                    indiceLinha,
                    indiceColuna
                );
                grid.appendChild(card);
            });
        });

        this.estilizarPontasNavios();
    }
}

class Jogador {
    constructor(vidas) {
        this.vidasInicial = vidas;
        this.vidas = vidas;
        this.quantidadeNavios = matriz.quantidadeNavios;
        this.perdeu = false;
        this.venceu = false;
        this.tempoJogo = 0;
        this.pontuacao = 0;
    }

    clicou(cardVirado, tabuleiro, isNavio) {
        const card = cardVirado.parentNode;
        if (cardVirado.classList.contains("Bomb")) {
            this.tocarMusica("bomba");
            this.clicouBomba();
        } else if (cardVirado.classList.contains("Wave")) {
            this.tocarMusica("agua");
        } else if (cardVirado.classList.contains("escudo")) {
            tabuleiro.revelarBombasTemporariamente();
            this.pontuacao += 200;
        } else if (isNavio) {
            this.tocarMusica("navio");
            this.clicouNavio(card);
        }
    }

    clicouBomba() {
        this.vidas -= 1;
        this.pontuacao -= 50;

        menu.retirarVida();

        const originalSrc = menu.emote.src;
        const originalBackgroundColor = menu.emote.style.backgroundColor;
        menu.emote.style.backgroundColor = "gray";
        menu.emote.src = "IconesBatalhaNaval/explodiu.png";

        setTimeout(function () {
            menu.emote.style.backgroundColor = originalBackgroundColor;
            menu.emote.src = originalSrc;
        }, 1700);

        if (this.vidas <= 0) {
            this.perdeu = true;
            this.tocarMusica("derrota");
            menu.instanciarTempo(false);
            tabuleiro.revelarTabuleiro();
            menu.calcularPontuacaoFinal();
        }
    }

    clicouNavio(card) {
        if (tabuleiro.derrubouNavio(card.getAttribute("data-navio"))) {
            tabuleiro.abrirCelulasProximasNavio(
                card.getAttribute("data-navio")
            );
            this.quantidadeNavios -= 1;
            this.pontuacao += 100;

            if (this.quantidadeNavios <= 0) {
                this.venceu = true;
                menu.emote.src = "IconesBatalhaNaval/feliz.png";
                this.tocarMusica("vitoria");
                menu.instanciarTempo(false);
                tabuleiro.revelarTabuleiro();
                menu.calcularPontuacaoFinal();
            }
        }
    }

    tocarMusica(qualMusica) {
        let audio;

        switch (qualMusica) {
            case "bomba":
                audio = new Audio("efeitosSonoros/bomba.mp3");
                break;
            case "navio":
                audio = new Audio("efeitosSonoros/navio.mp3");
                break;
            case "agua":
                audio = new Audio("efeitosSonoros/agua.mp3");
                break;
            case "derrota":
                audio = new Audio("efeitosSonoros/perdeu.mp3");
                break;
            case "vitoria":
                audio = new Audio("efeitosSonoros/vitoria.mp3");
                break;
        }

        audio.volume = 0.5;
        audio.play();

        if (qualMusica != "perdeu" && qualMusica != "vitoria") {
            audio.addEventListener("timeupdate", function () {
                if (audio.currentTime >= 2.5) {
                    audio.pause();
                }
            });
        }
    }

    tocarMusicaFundo() {
        let audio = new Audio("efeitosSonoros/musicaBatalha.mp3");
        audio.volume = "0.2";
        audio.loop = true;
        audio.play();
    }
}

class Interface {
    constructor() {
        this.menuVidas = document.getElementById("vidas");
        this.emote = document.getElementById("emote");
        this.temporizador = document.getElementById("temporizador");
        this.pontuacao = document.getElementById("pontuacao-final");
        this.carregarVidas();
    }

    carregarVidas() {
        for (let i = 0; i < player.vidas; i++) {
            const li = document.createElement("li");
            const coracao = document.createElement("img");
            li.classList.add("coracao");
            coracao.src = "IconesBatalhaNaval/coracao.png";
            li.appendChild(coracao);
            this.menuVidas.appendChild(li);
        }
    }

    retirarVida() {
        const vidas = document.querySelectorAll(".coracao");

        const coracao = vidas[player.vidas];
        coracao.children[0].src = "IconesBatalhaNaval/coracao-partido.png";
        coracao.style.backgroundColor = "gray";

        if (player.vidas === 0) {
            this.emote.src = "IconesBatalhaNaval/morto.png";
            this.emote.style.backgroundColor = "red";
        } else if (player.vidas <= player.vidasInicial / 3) {
            this.emote.src = "IconesBatalhaNaval/surpreso.png";
            this.emote.style.backgroundColor = "rgb(255, 172, 134)";
        } else if (player.vidas <= player.vidasInicial / 2) {
            this.emote.src = "IconesBatalhaNaval/suspeito.png";
            this.emote.style.backgroundColor = "rgb(238, 255, 0)";
        }
    }

    instanciarTempo(continua) {
        const formatarTempo = (tempo) => {
            let minutos = Math.floor((tempo % 3600) / 60);
            let segundos = tempo % 60;

            return `${minutos.toString().padStart(2, "0")}:${segundos
                .toString()
                .padStart(2, "0")}`;
        };

        let tempo = 0;

        if (continua) {
            this.intervaloTempo = setInterval(() => {
                tempo++;
                player.tempoJogo = tempo;

                this.temporizador.textContent =
                    "Tempo de jogo: " + formatarTempo(tempo);
            }, 1000);
        } else {
            clearInterval(this.intervaloTempo);
            this.temporizador.textContent = "";
            this.calcularPontuacaoFinal();
        }
    }

    calcularPontuacaoFinal() {
        const tempoBonus = 80;

        const bonusTempo = Math.max(tempoBonus - player.tempoJogo, 0);

        const bonusVidas = player.vidas * 100;

        player.pontuacao = Math.max(player.pontuacao, 0);

        if (player.venceu) {
            player.pontuacao = player.pontuacao + bonusVidas + bonusTempo + 500; // o +500 é o bonus por vencer

            this.temporizador.innerHTML = `Você venceu! Pontuação Final: ${player.pontuacao}`; // caso o jogador ganhe, ele irá receber os bonus de vida e de tempo
        } else {
            this.temporizador.innerHTML = `Você perdeu! Pontuação Final: ${player.pontuacao}`;
        }

        this.pontuacao.innerHTML = `Sua pontuação é: <b>${player.pontuacao}</b>`;
        this.revelarPopup(true, player.venceu);
    }

    revelarPopup(abrir, venceu) {
        const popup = document.getElementById("fim-jogo");

        if (abrir) {
            popup.classList.add("aberto");

            const piscar = (cor) => {
                const corOriginal = popup.style.backgroundColor;
                setTimeout(() => {
                    popup.style.backgroundColor = cor;
                }, 1000);

                setTimeout(() => {
                    popup.style.backgroundColor = corOriginal;
                }, 2000);
            };

            if (venceu) {
                piscar("rgba(138, 255, 127, 0.479)");
                return;
            }

            piscar("rgba(255, 0, 0, 0.350)");
            return;
        }
        popup.classList.remove("aberto");
    }
}

const matriz = new Matriz(10, 6, 12);

const arrayStrings = matriz.gerarArrayStrings();

const player = new Jogador(5);

const tabuleiro = new Tabuleiro(arrayStrings);

const menu = new Interface();
menu.instanciarTempo(true);

const nomeJogador = document.querySelector(".jogador");
nomeJogador.innerHTML = localStorage.getItem("jogador");

grid.addEventListener("click", player.tocarMusicaFundo, { once: true });
