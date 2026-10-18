const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const marcador = document.getElementById("puntos");

const TOTAL_GATOS = 25;
const TAMANO_GATO = 100;

let gatos = [];
let puntos = 0;
let velocidadExtra = 1;
let ancho = window.innerWidth;
let alto = window.innerHeight;

// Pelajes naturales
const pelajes = [
    { nombre: "naranja", cuerpo: "#c77b36", sombra: "#784421", claro: "#edbd78" },
    { nombre: "gris", cuerpo: "#85858b", sombra: "#4b4b53", claro: "#c6c6cb" },
    { nombre: "negro", cuerpo: "#39343a", sombra: "#211f25", claro: "#77717a" },
    { nombre: "blanco", cuerpo: "#e8e1d6", sombra: "#aaa39b", claro: "#fffaf0" },
    { nombre: "cafe", cuerpo: "#79513e", sombra: "#492e26", claro: "#c19a79" },
    { nombre: "crema", cuerpo: "#d6bd91", sombra: "#927957", claro: "#f3e3c1" },
    { nombre: "atigrado", cuerpo: "#a58b70", sombra: "#514237", claro: "#ddc5a3" },
    { nombre: "gris claro", cuerpo: "#b0b0b5", sombra: "#686871", claro: "#e6e4e8" },
    { nombre: "carey", cuerpo: "#654331", sombra: "#30252a", claro: "#c58b51" }
];

// Cambiar el tamaño real del canvas
function ajustarCanvas() {
    ancho = window.innerWidth;
    alto = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (const gato of gatos) {
        gato.x = Math.max(
            gato.tamano / 2,
            Math.min(ancho - gato.tamano / 2, gato.x)
        );

        gato.y = Math.max(
            gato.tamano / 2 + 70,
            Math.min(alto - gato.tamano / 2, gato.y)
        );
    }
}

// Fondo de atardecer
function dibujarCielo() {
    const gradiente = ctx.createLinearGradient(0, 0, 0, alto);

    gradiente.addColorStop(0, "#220837");
    gradiente.addColorStop(0.28, "#450339");
    gradiente.addColorStop(0.52, "#9f244b");
    gradiente.addColorStop(0.73, "#f49a85");
    gradiente.addColorStop(1, "#f8b66f");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, ancho, alto);

    dibujarSol();
    dibujarNubes();
}

// Sol pixel art
function dibujarSol() {
    const x = ancho * 0.73;
    const y = alto * 0.22;
    const s = Math.max(5, Math.min(12, ancho / 100));

    ctx.fillStyle = "#ffe1a0";

    ctx.fillRect(x, y, s * 8, s * 8);
    ctx.fillRect(x + s, y - s, s * 6, s * 10);
    ctx.fillRect(x - s, y + s, s * 10, s * 6);

    // Franjas del sol para efecto retro
    ctx.fillStyle = "#f5a18d";
    ctx.fillRect(x - s, y + s * 5, s * 10, s);
    ctx.fillRect(x - s, y + s * 7, s * 10, s);
}

// Nubes suaves
function dibujarNubes() {
    const nubes = [
        [ancho * 0.12, alto * 0.20, 1],
        [ancho * 0.43, alto * 0.30, 0.8],
        [ancho * 0.80, alto * 0.39, 0.65]
    ];

    for (const [x, y, escala] of nubes) {
        const p = 12 * escala;

        ctx.fillStyle = "#c4c4c4";
        ctx.fillRect(x + p, y, p * 3, p);
        ctx.fillRect(x, y + p, p * 6, p);
        ctx.fillRect(x + p * 2, y - p, p * 2, p);
        ctx.fillRect(x + p, y + p * 2, p * 4, p);
    }
}

// Ciudad de fondo
function dibujarCiudad() {
    const base = alto * 0.73;

    // Montañas y siluetas lejanas
    ctx.fillStyle = "#220837";
    ctx.beginPath();
    ctx.moveTo(0, base);

    for (let x = 0; x <= ancho + 100; x += 100) {
        ctx.lineTo(x, base - 35 - Math.sin(x * 0.015) * 25);
    }

    ctx.lineTo(ancho, alto);
    ctx.lineTo(0, alto);
    ctx.closePath();
    ctx.fill();

    // Edificios lejanos
    ctx.fillStyle = "#644264";

    for (let i = 0, x = 0; x < ancho; i++) {
        const w = 45 + ((i * 17) % 55);
        const h = 70 + ((i * 31) % 100);

        ctx.fillRect(x, base - h, w, h);
        x += w + 4;
    }

    // Edificios principales
    let x = -10;
    let indice = 0;

    while (x < ancho) {
        const w = 65 + ((indice * 29) % 65);
        const h = alto * (0.13 + ((indice * 13) % 20) / 100);
        const y = alto - h;

        const coloresEdificios = [
            "#593852",
            "#63405b",
            "#70435f",
            "#50354f",
            "#67445c"
        ];

        ctx.fillStyle = coloresEdificios[indice % coloresEdificios.length];
        ctx.fillRect(x, y, w, h);

        // Borde superior del edificio
        ctx.fillStyle = "#483047";
        ctx.fillRect(x, y, w, 5);

        // Algunos tejados
        if (indice % 3 === 0) {
            ctx.fillRect(x + w * 0.25, y - 12, w * 0.5, 12);
            ctx.fillRect(x + w * 0.4, y - 20, w * 0.2, 8);
        }

        // Ventanas iluminadas
        const tamVentana = 7;
        const espacio = 12;

        ctx.fillStyle = "#ffd28c";

        for (
            let wy = y + 18;
            wy < alto - 12;
            wy += espacio + 5
        ) {
            for (
                let wx = x + 10;
                wx < x + w - 5;
                wx += espacio
            ) {
                if (wx + tamVentana < x + w - 3) {
                    // Algunas ventanas quedan apagadas
                    const semilla =
                        Math.floor(wx * 3 + wy * 7 + indice * 11);

                    if (semilla % 4 !== 0) {
                        ctx.fillRect(
                            wx,
                            wy,
                            tamVentana,
                            tamVentana + 3
                        );
                    }
                }
            }
        }

        // Silueta de balcones
        if (indice % 4 === 1) {
            ctx.fillStyle = "#3d2c42";
            ctx.fillRect(x + 5, y + 45, w - 10, 4);
        }

        x += w + 5;
        indice++;
    }

    // Primer plano urbano
    const gradiente = ctx.createLinearGradient(
        0,
        alto * 0.75,
        0,
        alto
    );

    gradiente.addColorStop(0, "rgba(49, 34, 57, 0)");
    gradiente.addColorStop(1, "rgba(49, 34, 57, 0.35)");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, alto * 0.72, ancho, alto * 0.28);
}

function dibujarFondo() {
    dibujarCielo();
    dibujarCiudad();
}

// Clase Gato
class Gato {
    constructor() {
        this.tamano = TAMANO_GATO;

        this.color = pelajes[
            Math.floor(Math.random() * pelajes.length)
        ];

        this.patron = Math.floor(Math.random() * 4);

        this.x = this.tamano / 2 +
            Math.random() * Math.max(1, ancho - this.tamano);

        const zonaSuperior = Math.min(110, alto * 0.15);
        const zonaInferior = Math.max(
            zonaSuperior + 1,
            alto - this.tamano
        );

        this.y = zonaSuperior +
            Math.random() * (zonaInferior - zonaSuperior);

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
            ? "#a126ff"
            : this.color.cuerpo;

        const sombra = this.tiempoAzul > 0
            ? "#8514ae"
            : this.color.sombra;

        const claro = this.tiempoAzul > 0
            ? "#e7b6ff"
            : this.color.claro;

        ctx.save();

        // Cola
        ctx.fillStyle = sombra;
        ctx.fillRect(x - p * 7, y + p * 3, p * 3, p * 3);
        ctx.fillRect(x - p * 8, y + p, p * 3, p * 3);
        ctx.fillRect(x - p * 7, y - p, p * 3, p * 3);

        ctx.fillStyle = cuerpo;
        ctx.fillRect(x - p * 7, y + p, p * 2, p * 3);

        // Orejas
        ctx.fillStyle = sombra;
        ctx.fillRect(x - p * 6, y - p * 6, p * 4, p * 6);
        ctx.fillRect(x + p * 2, y - p * 6, p * 4, p * 6);

        ctx.fillStyle = claro;
        ctx.fillRect(x - p * 5, y - p * 5, p * 2, p * 3);
        ctx.fillRect(x + p * 3, y - p * 5, p * 2, p * 3);

        // Cabeza
        ctx.fillStyle = sombra;
        ctx.fillRect(x - p * 7, y - p * 2, p * 14, p * 8);
        ctx.fillRect(x - p * 6, y - p * 4, p * 12, p * 11);

        ctx.fillStyle = cuerpo;
        ctx.fillRect(x - p * 6, y - p * 3, p * 12, p * 9);
        ctx.fillRect(x - p * 5, y - p * 4, p * 10, p * 10);

        // Marcas de pelaje: rayas o manchas
        if (
            this.patron === 0 ||
            this.color.nombre === "atigrado" ||
            this.color.nombre === "naranja"
        ) {
            ctx.fillStyle = sombra;
            ctx.fillRect(x - p * 4, y - p * 2, p, p * 3);
            ctx.fillRect(x + p, y - p * 3, p, p * 3);
            ctx.fillRect(x + p * 4, y - p * 2, p, p * 3);
        } else if (this.patron === 1) {
            ctx.fillStyle = claro;
            ctx.fillRect(x - p * 5, y + p * 2, p * 3, p * 3);
            ctx.fillRect(x + p * 2, y + p * 2, p * 3, p * 3);
        }

        // Ojos
        ctx.fillStyle = "#b5c98b";
        ctx.fillRect(x - p * 4, y, p * 2, p * 2);
        ctx.fillRect(x + p * 2, y, p * 2, p * 2);

        ctx.fillStyle = "#29272b";
        ctx.fillRect(x - p * 3, y, p, p * 2);
        ctx.fillRect(x + p * 3, y, p, p * 2);

        // Brillos de los ojos
        ctx.fillStyle = "#fffdf4";
        ctx.fillRect(x - p * 4, y, p, p);
        ctx.fillRect(x + p * 2, y, p, p);

        // Hocico
        ctx.fillStyle = claro;
        ctx.fillRect(x - p * 3, y + p * 3, p * 3, p * 2);
        ctx.fillRect(x, y + p * 3, p * 3, p * 2);

        // Nariz
        ctx.fillStyle = "#b66f70";
        ctx.fillRect(x - p, y + p * 2, p * 2, p);

        // Bigotes
        ctx.fillStyle = "#eee6df";
        ctx.fillRect(x - p * 7, y + p * 3, p * 3, p / 2);
        ctx.fillRect(x + p * 4, y + p * 3, p * 3, p / 2);
        ctx.fillRect(x - p * 7, y + p * 5, p * 3, p / 2);
        ctx.fillRect(x + p * 4, y + p * 5, p * 3, p / 2);

        ctx.restore();
    }

    actualizar() {
        const mitad = this.tamano / 2;
        const limiteSuperior = Math.min(110, alto * 0.15);

        this.x += this.dx;
        this.y += this.dy;

        if (this.x - mitad < 0) {
            this.x = mitad;
            this.dx = Math.abs(this.dx);
        } else if (this.x + mitad > ancho) {
            this.x = ancho - mitad;
            this.dx = -Math.abs(this.dx);
        }

        if (this.y - mitad < limiteSuperior) {
            this.y = limiteSuperior + mitad;
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

// Crear gatos
function crearGatos() {
    gatos = [];

    for (let i = 0; i < TOTAL_GATOS; i++) {
        gatos.push(new Gato());
    }
}

// Colisiones entre gatos
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

            if (
                distancia < distanciaMinima &&
                a.tiempoAzul === 0 &&
                b.tiempoAzul === 0
            ) {
                // Intercambiar las direcciones
                const temporalX = a.dx;
                const temporalY = a.dy;

                a.dx = b.dx;
                a.dy = b.dy;

                b.dx = temporalX;
                b.dy = temporalY;

                // Destello azul temporal
                a.tiempoAzul = 10;
                b.tiempoAzul = 10;

                // Separar las figuras para evitar que se encimen
                const longitud = distancia || 1;
                const solapamiento = distanciaMinima - distancia;

                const ajusteX =
                    (distanciaX / longitud) * solapamiento / 2;

                const ajusteY =
                    (distanciaY / longitud) * solapamiento / 2;

                a.x -= ajusteX;
                a.y -= ajusteY;

                b.x += ajusteX;
                b.y += ajusteY;
            }
        }
    }
}

// Animación principal
function animar() {
    ctx.clearRect(0, 0, ancho, alto);

    dibujarFondo();

    for (const gato of gatos) {
        gato.actualizar();
    }

    detectarColisiones();

    for (const gato of gatos) {
        gato.dibujar();
    }

    requestAnimationFrame(animar);
}

// Atrapar gatos
canvas.addEventListener("pointerdown", function(evento) {
    const rect = canvas.getBoundingClientRect();

    const px = evento.clientX - rect.left;
    const py = evento.clientY - rect.top;

    for (let i = gatos.length - 1; i >= 0; i--) {
        if (gatos[i].contiene(px, py)) {
            gatos.splice(i, 1);

            puntos++;
            marcador.textContent = puntos;

            // Incrementar velocidad cada cinco gatos
            if (puntos % 5 === 0) {
                velocidadExtra += 0.15;

                for (const gato of gatos) {
                    gato.dx *= 1.15;
                    gato.dy *= 1.15;
                }
            }

            // Mantener 25 gatos en pantalla
            gatos.push(new Gato());

            break;
        }
    }
});

// Iniciar
ajustarCanvas();
crearGatos();
animar();

window.addEventListener("resize", ajustarCanvas);