var COLUMNAS = 40;
var FILAS = 30;
var LADO = 20;
var anchoCanvas = COLUMNAS * LADO;
var altoCanvas = FILAS * LADO;

var serpiente;
var comida;

var arriba;
var derecha;
var izquierda;
var abajo;

var canvas;

var score = 0;
var numeroDeMuertes = 0;

function setup() {
  frameRate(10);
  canvas = createCanvas(anchoCanvas, altoCanvas);
  windowResized();
  serpiente = new Serpiente();
  posicionDeComida();
  arriba = createVector(0, -1);
  abajo = createVector(0, 1);
  derecha = createVector(1, 0);
  izquierda = createVector(-1, 0);
};

function draw() {
  background("black");
  serpiente.dibujar();
  fill("white");
  textSize(22);
  text("Score: "+score+"\n\nnumero de muertes: "+numeroDeMuertes+
  "\n\n(─‿‿─)",anchoCanvas-750,altoCanvas-540);
  fill("red");
  rect(comida.x * LADO, comida.y * LADO, LADO, LADO);
  if (serpiente.posicion.dist(comida) == 0) {
    serpiente.tamaño++;
    score = score + 1;
    posicionDeComida();
  };
};

function windowResized() {
  var escala = windowWidth / width;
  if (escala >= 1) {
    return;
  };
  canvas.style("width", width * escala + "px");
  canvas.style("height", height * escala + "px");
};

function keyPressed() {
  if (!isLooping()) {
    juegoNuevo();
  };
  switch (keyCode) {
    case UP_ARROW:
      if (serpiente.cola.length && serpiente.aceleracion == abajo) {
        break;
      };
      serpiente.aceleracion = arriba;
      break;
    case RIGHT_ARROW:
      if (serpiente.cola.length && serpiente.aceleracion == izquierda) {
        break;
      };
      serpiente.aceleracion = derecha;
      break;
    case DOWN_ARROW:
      if (serpiente.cola.length && serpiente.aceleracion == arriba) {
        break;
      };
      serpiente.aceleracion = abajo;
      break;
    case LEFT_ARROW:
      if (serpiente.cola.length && serpiente.aceleracion == derecha) {
        break;
      };
      serpiente.aceleracion = izquierda;
      break;
    default:
      break;
  };
};

function posicionDeComida() {
  comida = createVector(
    int(random(COLUMNAS)),
    int(random(FILAS))
  );
};

function juegoNuevo() {
  serpiente = new Serpiente();
  loop();
};

function juegoTerminado() {
  if (serpiente.sistemaDeChoques()) {
    textAlign(CENTER, CENTER);
    textSize(40);
    text("Juego terminado\n\n(ㆆ_ㆆ)", width / 2, height / 2);
    score = 0;
    numeroDeMuertes = numeroDeMuertes + 1;
    noLoop();
  };
};

function Serpiente() {
  this.posicion = createVector(
    COLUMNAS / 2,
    FILAS / 2
  );
  this.aceleracion = createVector();
  this.cola = [];
  this.tamaño = 0;
  this.sistemaDeChoques = function() {
    if (this.posicion.x < 0 || this.posicion.y < 0) {
      return true;
    };
    if (this.posicion.x >= COLUMNAS || this.posicion.y >= FILAS) {
      return true;
    };
    for (const c of this.cola) {
      if (this.posicion.equals(c)) {
        return true;
      };
    };
    return false;
  };
  this.dibujar = function() {
    fill("white");
    rect(
      constrain(this.posicion.x, 0, COLUMNAS - 1) * LADO,
      constrain(this.posicion.y, 0, FILAS - 1) * LADO,
      LADO,
      LADO
    );
    for (const c of this.cola) {
      rect(
        constrain(c.x, 0, COLUMNAS - 1) * LADO,
        constrain(c.y, 0, FILAS - 1) * LADO,
        LADO,
        LADO
      );
    };
    juegoTerminado();
    this.cola.push(this.posicion.copy());
    if (this.cola.length > this.tamaño) {
      this.cola.splice(0, 1);
    };
    this.posicion.add(this.aceleracion);
  };
};