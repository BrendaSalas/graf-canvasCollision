// ==========================================
// CONFIGURACIÓN DEL CANVAS
// ==========================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = false;

// ==========================================
// CONFIGURACIÓN DEL JUEGO
// ==========================================

const TOTAL_OBJETOS = 25;

let objetos = [];
let contador = 0;
let velocidadNivel = 1;

// Paleta pixel art
const colores = [
    "#ff3d81",
    "#ffd447",
    "#20d9ff",
    "#b56cff",
    "#83ff79",
    "#ff844f",
    "#ffffff"
];

// ==========================================
// CLASE OBJETO
// ==========================================

class Objeto {
    constructor() {
        this.radio = Math.floor(Math.random() * 7 + 12);

        this.color = colores[
            Math.floor(Math.random() * colores.length)
        ];

        const figuras = [
            "estrella",
            "corazon",
            "rombo",
            "flor"
        ];

        this.figura = figuras[
            Math.floor(Math.random() * figuras.length)
        ];

        this.eliminado = false;
        this.reiniciarArriba();
    }

    reiniciarArriba() {
        this.x = Math.random() *
            (canvas.width - this.radio * 4) + this.radio * 2;

        this.y = -this.radio * 2 - Math.random() * 200;

        this.velocidadX = (Math.random() - 0.5) * 1.5;
        this.velocidadY = Math.random() * 2 + 1.5;

        this.gravedad = 0.10;
        this.fuerzaRebote = 0.72;
        this.rebotes = 0;
        this.rotacion = 0;
        this.eliminado = false;
    }

    // ======================================
    // DIBUJAR SPRITES PIXEL ART
    // ======================================

    dibujar() {
        if (this.eliminado) return;

        const pixel = 4;
        const r = Math.max(3, Math.floor(this.radio / pixel));

        // Matrices de píxeles:
        // 0 = transparente
        // 1 = color principal
        // 2 = sombra
        // 3 = brillo
        const sprites = {
            estrella: [
                "00000100000",
                "00000100000",
                "00001110000",
                "00011111000",
                "11111111111",
                "01111111110",
                "00111111100",
                "00111111100",
                "01101101110",
                "11000000011",
                "10000000001"
            ],

            corazon: [
                "00110001100",
                "01111011110",
                "11111111111",
                "11111111111",
                "11111111111",
                "01111111110",
                "00111111100",
                "00011111000",
                "00001110000",
                "00000100000"
            ],

            rombo: [
                "00000100000",
                "00011111000",
                "00111111100",
                "01111111110",
                "11111111111",
                "01111111110",
                "00111111100",
                "00011111000",
                "00000100000"
            ],

            flor: [
                "00011000",
                "00111100",
                "01111110",
                "11011011",
                "11111111",
                "01111110",
                "00111100",
                "00011000"
            ]
        };

        const sprite = sprites[this.figura];
        const anchoPixel = this.radio * 2 / sprite[0].length;
        const altoPixel = this.radio * 2 / sprite.length;

        const ancho = sprite[0].length * anchoPixel;
        const alto = sprite.length * altoPixel;

        const inicioX = this.x - ancho / 2;
        const inicioY = this.y - alto / 2;

        ctx.save();

        // Sombra pixelada debajo de la figura
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(
            inicioX + 4,
            inicioY + 4,
            ancho,
            alto
        );

        // Dibujar cada píxel del sprite
        for (let fila = 0; fila < sprite.length; fila++) {
            for (let columna = 0;
                columna < sprite[fila].length;
                columna++) {

                if (sprite[fila][columna] === "0") continue;

                const px = inicioX + columna * anchoPixel;
                const py = inicioY + fila * altoPixel;

                // Borde negro estilo videojuego retro
                ctx.fillStyle = "#2c063d";

                ctx.fillRect(
                    px - 1,
                    py - 1,
                    anchoPixel + 2,
                    altoPixel + 2
                );

                // Color de la figura
                ctx.fillStyle = this.color;

                if (
                    fila < sprite.length / 3 &&
                    columna < sprite[fila].length / 3
                ) {
                    ctx.fillStyle = "#ffffff";
                }

                ctx.fillRect(
                    px,
                    py,
                    anchoPixel,
                    altoPixel
                );
            }
        }

        ctx.restore();
    }

    // ======================================
    // ACTUALIZAR MOVIMIENTO Y REBOTES
    // ======================================

    actualizar() {
        if (this.eliminado) return;

        this.velocidadY += this.gravedad;

        this.x += this.velocidadX * velocidadNivel;
        this.y += this.velocidadY * velocidadNivel;

        // Rebote en el lado derecho
        if (this.x + this.radio >= canvas.width) {
            this.x = canvas.width - this.radio;
            this.velocidadX = -Math.abs(this.velocidadX);
        }

        // Rebote en el lado izquierdo
        if (this.x - this.radio <= 0) {
            this.x = this.radio;
            this.velocidadX = Math.abs(this.velocidadX);
        }

        // Rebote en el suelo
        if (this.y + this.radio >= canvas.height) {
            this.y = canvas.height - this.radio;

            this.velocidadY =
                -Math.abs(this.velocidadY) * this.fuerzaRebote;

            this.fuerzaRebote *= 0.68;
            this.rebotes++;

            // Si pierde la fuerza, vuelve a aparecer arriba
            if (
                Math.abs(this.velocidadY) < 1 ||
                this.rebotes >= 6
            ) {
                this.reiniciarArriba();
            }
        }
    }

    // ======================================
    // DETECTAR SI EL MOUSE TOCA LA FIGURA
    // ======================================

    contienePunto(mouseX, mouseY) {
        return (
            Math.abs(mouseX - this.x) <= this.radio &&
            Math.abs(mouseY - this.y) <= this.radio
        );
    }
}

// ==========================================
// FONDO PIXEL ART
// ==========================================

function dibujarFondo() {
    // Cielo nocturno
    const gradiente = ctx.createLinearGradient(
        0, 0, 0, canvas.height
    );

    gradiente.addColorStop(0, "#080d3d");
    gradiente.addColorStop(0.55, "#21105a");
    gradiente.addColorStop(1, "#711c85");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estrellas cuadradas
    ctx.fillStyle = "#b69aff";

    for (let i = 0; i < 90; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 83.7) % (canvas.height * 0.65);

        const tamaño = i % 4 === 0 ? 4 : 2;

        ctx.fillRect(x, y, tamaño, tamaño);
    }

    // Luna pixelada
    ctx.fillStyle = "#ffe4a3";
    ctx.fillRect(
        canvas.width - 150, 100, 48, 64
    );

    ctx.fillRect(
        canvas.width - 162, 112, 72, 40
    );

    ctx.fillStyle = "#e9b9a1";
    ctx.fillRect(canvas.width - 140, 118, 8, 8);
    ctx.fillRect(canvas.width - 116, 140, 8, 8);
    ctx.fillRect(canvas.width - 128, 154, 8, 4);

    // Ciudad pixelada
    const base = canvas.height * 0.82;
    const anchoEdificio = 38;

    for (
        let x = 0, i = 0;
        x < canvas.width;
        x += anchoEdificio, i++
    ) {
        const altura = 50 + ((i * 37) % 110);

        ctx.fillStyle = i % 2 === 0 ? "#10184f" : "#15134a";

        ctx.fillRect(
            x,
            base - altura,
            anchoEdificio - 3,
            altura + 30
        );

        // Ventanas iluminadas
        for (let wy = base - altura + 12;
            wy < base;
            wy += 18) {

            for (let wx = x + 8;
                wx < x + anchoEdificio - 8;
                wx += 16) {

                ctx.fillStyle =
                    (i + Math.floor(wy)) % 3 === 0
                    ? "#ffb45e"
                    : "#ff5f9e";

                ctx.fillRect(wx, wy, 5, 7);
            }
        }
    }

    // Suelo
    ctx.fillStyle = "#090d35";
    ctx.fillRect(
        0,
        base + 20,
        canvas.width,
        canvas.height - base
    );

    // Línea superior del suelo
    ctx.fillStyle = "#4434a3";
    ctx.fillRect(0, base + 20, canvas.width, 5);
}

// ==========================================
// INTERFAZ PIXEL ART
// ==========================================

function dibujarInterfaz() {
    ctx.save();

    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    // Título
    ctx.font = "bold 28px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("ATRAPA LAS FIGURAS!", 22, 22);

    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#d9c9ff";
    ctx.fillText(
        "CLIC IZQUIERDO PARA ATRAPAR",
        24,
        58
    );

    // Panel de puntuación
    const panelX = canvas.width - 285;

    ctx.fillStyle = "#080d3d";
    ctx.fillRect(panelX, 18, 265, 55);

    ctx.strokeStyle = "#b64dff";
    ctx.lineWidth = 4;
    ctx.strokeRect(panelX, 18, 265, 55);

    ctx.textAlign = "center";
    ctx.font = "bold 17px monospace";
    ctx.fillStyle = "#ffffff";

    ctx.fillText(
        "ATRAPADOS: " + contador,
        panelX + 132,
        36
    );

    // Nivel de velocidad
    let nivel = "INICIAL";

    if (contador > 20) {
        nivel = "ALTA";
    } else if (contador > 10) {
        nivel = "MEDIA";
    }

    ctx.textAlign = "right";
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#ffd447";

    ctx.fillText(
        "VELOCIDAD: " + nivel,
        canvas.width - 22,
        88
    );

    ctx.restore();
}

// ==========================================
// VELOCIDAD SEGÚN EL CONTADOR
// ==========================================

function actualizarVelocidad() {
    if (contador > 20) {
        velocidadNivel = 2.2;
    } else if (contador > 10) {
        velocidadNivel = 1.5;
    } else {
        velocidadNivel = 1;
    }
}

// ==========================================
// ATRAPAR FIGURAS CON EL MOUSE
// ==========================================

canvas.addEventListener("mousedown", function(evento) {
    if (evento.button !== 0) return;

    const rect = canvas.getBoundingClientRect();

    const mouseX = evento.clientX - rect.left;
    const mouseY = evento.clientY - rect.top;

    for (let i = objetos.length - 1; i >= 0; i--) {
        if (objetos[i].contienePunto(mouseX, mouseY)) {
            // Eliminar la figura atrapada
            objetos.splice(i, 1);

            // Actualizar la puntuación
            contador++;
            actualizarVelocidad();

            // Crear una figura nueva
            objetos.push(new Objeto());

            break;
        }
    }
});

// ==========================================
// ANIMACIÓN PRINCIPAL
// ==========================================

function animar() {
    dibujarFondo();

    for (const objeto of objetos) {
        objeto.actualizar();
        objeto.dibujar();
    }

    dibujarInterfaz();

    requestAnimationFrame(animar);
}

// ==========================================
// AJUSTAR TAMAÑO DE PANTALLA
// ==========================================

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.imageSmoothingEnabled = false;
});

// ==========================================
// INICIAR JUEGO
// ==========================================

function iniciarJuego() {
    objetos = [];
    contador = 0;
    velocidadNivel = 1;

    for (let i = 0; i < TOTAL_OBJETOS; i++) {
        objetos.push(new Objeto());
    }

    animar();
}

iniciarJuego();