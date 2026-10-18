const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const marcador = document.getElementById("puntos");

const TOTAL_GATOS = 25;
const TAMANO_GATO = 64;

let gatos = [];
let puntos = 0;
let velocidadExtra = 1;

const coloresGatos = [
    { cuerpo: "#ff75b5", sombra: "#d94087", claro: "#ffb6d9" },
    { cuerpo: "#68d9ff", sombra: "#2996ce", claro: "#b5f1ff" },
    { cuerpo: "#ffe16b", sombra: "#e5a82e", claro: "#fff3b0" },
    { cuerpo: "#bd8cff", sombra: "#8650cb", claro: "#e1c6ff" },
    { cuerpo: "#85ed9a", sombra: "#37ae68", claro: "#c6ffd0" },
    { cuerpo: "#ff9a66", sombra: "#df633f", claro: "#ffd0a8" },
    { cuerpo: "#ff8d9e", sombra: "#d64d72", claro: "#ffc3ce" },
    { cuerpo: "#a6a9ff", sombra: "#646bd1", claro: "#d6d8ff" },
    { cuerpo: "#f4a8ff", sombra: "#b75cc8", claro: "#ffe0ff" }
];

// Ajustar el canvas a su tamaño visible
function ajustarCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (const gato of gatos) {
        gato.x = Math.max(
            gato.tamano / 2,
            Math.min(rect.width - gato.tamano / 2, gato.x)
        );

        gato.y = Math.max(
            gato.tamano / 2,
            Math.min(rect.height - gato.tamano / 2, gato.y)
        );
    }
}

// Fondo con colores de atardecer
function dibujarAtardecer() {
    const ancho = canvas.clientWidth;
    const alto = canvas.clientHeight;

    const gradiente = ctx.createLinearGradient(0, 0, 0, alto);

    gradiente.addColorStop(0, "#654080");
    gradiente.addColorStop(0.35, "#c75d9d");
    gradiente.addColorStop(0.68, "#fa8c8b");
    gradiente.addColorStop(1, "#ffbc78");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, ancho, alto);

    // Sol pixelado
    const solX = ancho * 0.75;
    const solY = alto * 0.18;
    const p = 8;

    ctx.fillStyle = "#ffe8a3";
    ctx.fillRect(solX, solY, p * 6, p * 6);
    ctx.fillRect(solX + p, solY - p, p * 4, p * 8);
    ctx.fillRect(solX - p, solY + p, p * 8, p * 4);

    // Nubes decorativas
    dibujarNube(ancho * 0.12, alto * 0.22);
    dibujarNube(ancho * 0.43, alto * 0.40);
}

function dibujarNube(x, y) {
    const p = 8;

    ctx.fillStyle = "rgba(255, 220, 240, 0.45)";
    ctx.fillRect(x + p, y, p * 3, p);
    ctx.fillRect(x, y + p, p * 6, p);
    ctx.fillRect(x + p, y + p * 2, p * 4, p);
}

// Clase de los gatos
class Gato {
    constructor() {
        this.tamano = TAMANO_GATO;

        this.color = coloresGatos[
            Math.floor(Math.random() * coloresGatos.length)
        ];

        const ancho = canvas.clientWidth;
        const alto = canvas.clientHeight;

        this.x = this.tamano / 2 +
            Math.random() * Math.max(1, ancho - this.tamano);

        this.y = this.tamano / 2 +
            Math.random() * Math.max(1, alto - this.tamano);

        const velocidad = (1 + Math.random() * 2) * velocidadExtra;

        this.dx = (Math.random() < 0.5 ? -1 : 1) * velocidad;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * velocidad;

        this.tiempoAzul = 0;
    }

    dibujar() {
        const x = Math.round(this.x);
        const y = Math.round(this.y);
        const p = this.tamano / 16;

        const cuerpo = this.tiempoAzul > 0
            ? "#35aaff"
            : this.color.cuerpo;

        const sombra = this.tiempoAzul > 0
            ? "#1762d0"
            : this.color.sombra;

        const claro = this.tiempoAzul > 0
            ? "#b8eaff"
            : this.color.claro;

        ctx.save();

        // Cola: píxeles sin fondo rectangular
        ctx.fillStyle = sombra;
        ctx.fillRect(x - p * 7, y + p * 4, p * 3, p * 3);
        ctx.fillRect(x - p * 8, y + p * 2, p * 3, p * 3);
        ctx.fillRect(x - p * 7, y, p * 3, p * 3);

        // Orejas exteriores
        ctx.fillStyle = sombra;
        ctx.fillRect(x - p * 6, y - p * 6, p * 4, p * 6);
        ctx.fillRect(x + p * 2, y - p * 6, p * 4, p * 6);

        // Interior de las orejas
        ctx.fillStyle = claro;
        ctx.fillRect(x - p * 5, y - p * 5, p * 2, p * 3);
        ctx.fillRect(x + p * 3, y - p * 5, p * 2, p * 3);

        // Cabeza
        ctx.fillStyle = sombra;
        ctx.fillRect(x - p * 7, y - p * 2, p * 14, p * 8);
        ctx.fillRect(x - p * 6, y - p * 4, p * 12, p * 12);

        ctx.fillStyle = cuerpo;
        ctx.fillRect(x - p * 6, y - p * 3, p * 12, p * 9);
        ctx.fillRect(x - p * 5, y - p * 4, p * 10, p * 10);

        // Brillos de la cara
        ctx.fillStyle = claro;
        ctx.fillRect(x - p * 4, y - p * 2, p * 2, p);
        ctx.fillRect(x + p * 2, y - p * 2, p * 2, p);

        // Ojos
        ctx.fillStyle = "#40274e";
        ctx.fillRect(x - p * 4, y, p * 2, p * 2);
        ctx.fillRect(x + p * 2, y, p * 2, p * 2);

        // Brillos de los ojos
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - p * 4, y, p, p);
        ctx.fillRect(x + p * 2, y, p, p);

        // Nariz
        ctx.fillStyle = "#ff6b9e";
        ctx.fillRect(x - p, y + p * 2, p * 2, p);

        // Hocico
        ctx.fillStyle = claro;
        ctx.fillRect(x - p * 3, y + p * 3, p * 3, p * 2);
        ctx.fillRect(x, y + p * 3, p * 3, p * 2);

        // Bigotes
        ctx.fillStyle = "#fff6f2";
        ctx.fillRect(x - p * 7, y + p * 3, p * 3, p / 2);
        ctx.fillRect(x + p * 4, y + p * 3, p * 3, p / 2);
        ctx.fillRect(x - p * 7, y + p * 5, p * 3, p / 2);
        ctx.fillRect(x + p * 4, y + p * 5, p * 3, p / 2);

        ctx.restore();
    }

    actualizar() {
        const ancho = canvas.clientWidth;
        const alto = canvas.clientHeight;
        const mitad = this.tamano / 2;

        this.x += this.dx;
        this.y += this.dy;

        // Rebote horizontal
        if (this.x - mitad < 0) {
            this.x = mitad;
            this.dx = Math.abs(this.dx);
        } else if (this.x + mitad > ancho) {
            this.x = ancho - mitad;
            this.dx = -Math.abs(this.dx);
        }

        // Rebote vertical
        if (this.y - mitad < 0) {
            this.y = mitad;
            this.dy = Math.abs(this.dy);
        } else if (this.y + mitad > alto) {
            this.y = alto - mitad;
            this.dy = -Math.abs(this.dy);
        }

        if (this.tiempoAzul > 0) {
            this.tiempoAzul--;
        }
    }

    contiene(px, py) {
        return Math.abs(px - this.x) < this.tamano * 0.65 &&
               Math.abs(py - this.y) < this.tamano * 0.65;
    }
}

// Crear los 25 gatos
function crearGatos() {
    gatos = [];

    for (let i = 0; i < TOTAL_GATOS; i++) {
        gatos.push(new Gato());
    }
}

// Detectar colisiones entre gatos
function detectarColisiones() {
    for (let i = 0; i < gatos.length; i++) {
        for (let j = i + 1; j < gatos.length; j++) {
            const a = gatos[i];
            const b = gatos[j];

            const distanciaX = b.x - a.x;
            const distanciaY = b.y - a.y;

            const distancia = Math.sqrt(
                distanciaX * distanciaX +
                distanciaY * distanciaY
            );

            const distanciaMinima = (a.tamano + b.tamano) / 2;

            if (distancia < distanciaMinima) {
                // Evitar invertir la dirección en cada fotograma
                if (a.tiempoAzul === 0 && b.tiempoAzul === 0) {
                    const temporalX = a.dx;
                    const temporalY = a.dy;

                    a.dx = b.dx;
                    a.dy = b.dy;

                    b.dx = temporalX;
                    b.dy = temporalY;

                    a.tiempoAzul = 10;
                    b.tiempoAzul = 10;

                    // Separar ligeramente los gatos para evitar
                    // que permanezcan superpuestos
                    const longitud = distancia || 1;
                    const solapamiento = distanciaMinima - distancia;

                    const ajusteX = (distanciaX / longitud) *
                        solapamiento / 2;

                    const ajusteY = (distanciaY / longitud) *
                        solapamiento / 2;

                    a.x -= ajusteX;
                    a.y -= ajusteY;

                    b.x += ajusteX;
                    b.y += ajusteY;
                }
            }
        }
    }
}

// Animación principal
function animar() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    dibujarAtardecer();

    for (const gato of gatos) {
        gato.actualizar();
    }

    detectarColisiones();

    for (const gato of gatos) {
        gato.dibujar();
    }

    requestAnimationFrame(animar);
}

// Atrapar gatos al hacer clic
canvas.addEventListener("pointerdown", function(evento) {
    const rect = canvas.getBoundingClientRect();

    const px = evento.clientX - rect.left;
    const py = evento.clientY - rect.top;

    for (let i = gatos.length - 1; i >= 0; i--) {
        if (gatos[i].contiene(px, py)) {
            gatos.splice(i, 1);

            puntos++;
            marcador.textContent = puntos;

            // Aumentar la velocidad cada cinco gatos atrapados
            if (puntos % 5 === 0) {
                velocidadExtra += 0.15;

                for (const gato of gatos) {
                    gato.dx *= 1.15;
                    gato.dy *= 1.15;
                }
            }

            // Mantener siempre 25 gatos en pantalla
            gatos.push(new Gato());

            break;
        }
    }
});

// Inicio del juego
ajustarCanvas();
crearGatos();
animar();

window.addEventListener("resize", ajustarCanvas);