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

// ==========================================
// COLORES DE LOS GATOS
// ==========================================

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

// ==========================================
// AJUSTAR CANVAS A LA PANTALLA
// ==========================================

function ajustarCanvas() {
    const dpr = window.devicePixelRatio || 1;

    ancho = window.innerWidth;
    alto = window.innerHeight;

    canvas.width = ancho * dpr;
    canvas.height = alto * dpr;

    canvas.style.width = ancho + "px";
    canvas.style.height = alto + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    gatos.forEach(gato => {
        const mitad = gato.tamano / 2;

        gato.x = Math.max(
            mitad,
            Math.min(ancho - mitad, gato.x)
        );

        gato.y = Math.max(
            125 + mitad,
            Math.min(alto - mitad, gato.y)
        );
    });
}

// ==========================================
// CIELO NOCTURNO
// ==========================================

function dibujarCielo() {
    const gradiente = ctx.createLinearGradient(0, 0, 0, alto);

    gradiente.addColorStop(0, "#080d25");
    gradiente.addColorStop(0.35, "#111b3d");
    gradiente.addColorStop(0.7, "#45204b");
    gradiente.addColorStop(1, "#4d304a");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, ancho, alto);

    dibujarEstrellas();
    dibujarLuna();
    dibujarNubes();
}

// ==========================================
// ESTRELLAS PIXEL ART
// ==========================================

function dibujarEstrellas() {
    const estrellas = [
        [0.05, 0.12], [0.12, 0.25], [0.20, 0.08],
        [0.27, 0.19], [0.34, 0.10], [0.42, 0.28],
        [0.50, 0.16], [0.58, 0.07], [0.65, 0.25],
        [0.73, 0.12], [0.85, 0.08], [0.94, 0.19],
        [0.09, 0.37], [0.30, 0.34], [0.48, 0.36],
        [0.62, 0.33], [0.89, 0.35], [0.96, 0.06],
        [0.17, 0.05], [0.39, 0.06], [0.81, 0.29]
    ];

    estrellas.forEach(([x, y], i) => {
        const tamano = i % 3 === 0 ? 4 : 2;

        ctx.fillStyle = i % 2 === 0
            ? "#ffffff"
            : "#a9c7ff";

        ctx.fillRect(
            Math.floor(x * ancho),
            Math.floor(y * alto),
            tamano,
            tamano
        );

        // Algunas estrellas brillantes
        if (i % 4 === 0) {
            ctx.fillRect(
                Math.floor(x * ancho) - 2,
                Math.floor(y * alto) + 1,
                tamano + 4,
                1
            );

            ctx.fillRect(
                Math.floor(x * ancho) + 1,
                Math.floor(y * alto) - 2,
                1,
                tamano + 4
            );
        }
    });
}

// ==========================================
// LUNA PIXEL ART
// ==========================================

function dibujarLuna() {
    const x = Math.floor(ancho * 0.78);
    const y = Math.floor(alto * 0.22);
    const p = Math.max(3, Math.min(6, ancho / 200));

    // Resplandor
    ctx.fillStyle = "rgba(190, 207, 255, 0.06)";
    ctx.fillRect(x - p * 9, y - p * 9, p * 18, p * 18);

    ctx.fillStyle = "rgba(190, 207, 255, 0.10)";
    ctx.fillRect(x - p * 7, y - p * 7, p * 14, p * 14);

    // Forma de la luna
    ctx.fillStyle = "#f4f0d5";

    ctx.fillRect(x - p * 3, y - p * 4, p * 6, p * 8);
    ctx.fillRect(x - p * 4, y - p * 3, p * 8, p * 6);
    ctx.fillRect(x - p * 2, y - p * 5, p * 4, p * 10);

    // Cráteres
    ctx.fillStyle = "#c8cbe0";
    ctx.fillRect(x + p, y - p * 2, p, p);
    ctx.fillRect(x - p * 2, y + p, p, p);
    ctx.fillRect(x + p, y + p * 2, p, p);
}

// ==========================================
// NUBES NOCTURNAS
// ==========================================

function dibujarNubes() {
    const nubes = [
        { x: ancho * 0.10, y: alto * 0.30, s: 1 },
        { x: ancho * 0.40, y: alto * 0.38, s: 0.75 },
        { x: ancho * 0.84, y: alto * 0.40, s: 0.85 }
    ];

    nubes.forEach(nube => {
        const p = 8 * nube.s;

        ctx.fillStyle = "rgba(39, 43, 76, 0.65)";

        ctx.fillRect(nube.x, nube.y, p * 6, p * 2);
        ctx.fillRect(nube.x + p, nube.y - p, p * 4, p * 3);
        ctx.fillRect(nube.x + p * 2, nube.y - p * 2, p * 2, p);

        ctx.fillStyle = "rgba(79, 77, 112, 0.55)";

        ctx.fillRect(nube.x + p, nube.y, p * 4, p);
        ctx.fillRect(nube.x + p * 2, nube.y - p, p * 2, p);
    });
}

// ==========================================
// CIUDAD NOCTURNA PIXEL ART
// ==========================================

function dibujarCiudad() {
    const base = Math.floor(alto * 0.73);

    // Montañas lejanas
    ctx.fillStyle = "#292641";

    ctx.beginPath();
    ctx.moveTo(0, base + 30);
    ctx.lineTo(ancho * 0.12, base - 50);
    ctx.lineTo(ancho * 0.22, base + 10);
    ctx.lineTo(ancho * 0.38, base - 75);
    ctx.lineTo(ancho * 0.54, base + 15);
    ctx.lineTo(ancho * 0.70, base - 40);
    ctx.lineTo(ancho * 0.84, base + 5);
    ctx.lineTo(ancho, base - 55);
    ctx.lineTo(ancho, alto);
    ctx.lineTo(0, alto);
    ctx.closePath();
    ctx.fill();

    // Edificios lejanos
    for (let x = 0, i = 0; x < ancho; x += 85, i++) {
        const altura = 65 + ((i * 17) % 100);

        ctx.fillStyle = "#202039";
        ctx.fillRect(x, base - altura, 65, altura + 100);

        ctx.fillStyle = "#15182d";
        ctx.fillRect(x + 8, base - altura - 8, 49, 8);

        // Algunas ventanas lejanas
        for (let wy = base - altura + 15; wy < base - 5; wy += 25) {
            if ((i + wy) % 3 !== 0) {
                ctx.fillStyle = "#b59b78";
                ctx.fillRect(x + 15, wy, 5, 7);
                ctx.fillRect(x + 38, wy, 5, 7);
            }
        }
    }

    // Edificios principales
    const coloresEdificios = [
        "#111526",
        "#171a30",
        "#1b2038",
        "#101426",
        "#202039"
    ];

    const anchoEdificio = 90;

    for (let x = 0, i = 0; x < ancho; x += anchoEdificio, i++) {
        const altura = 100 + ((i * 47) % 140);
        const y = base - altura;

        ctx.fillStyle = coloresEdificios[i % coloresEdificios.length];
        ctx.fillRect(x, y, anchoEdificio - 5, altura + alto * 0.3);

        // Techo
        ctx.fillStyle = "#0b1023";
        ctx.fillRect(x - 4, y, anchoEdificio, 8);

        // Antenas
        if (i % 3 === 0) {
            ctx.fillRect(x + 35, y - 18, 3, 18);
            ctx.fillRect(x + 29, y - 17, 15, 3);
        }

        // Ventanas
        const columnas = 3;
        const filas = Math.floor(altura / 23);

        for (let fila = 0; fila < filas; fila++) {
            for (let columna = 0; columna < columnas; columna++) {
                const wx = x + 12 + columna * 22;
                const wy = y + 17 + fila * 23;

                if (wy < base - 5) {
                    const encendida =
                        (i * 7 + fila * 3 + columna) % 4 !== 0;

                    ctx.fillStyle = encendida
                        ? "#ffc58f"
                        : "#303047";

                    ctx.fillRect(wx, wy, 10, 12);

                    // Resplandor suave de las ventanas
                    if (encendida) {
                        ctx.fillStyle = "rgba(255, 197, 143, 0.10)";
                        ctx.fillRect(wx - 2, wy - 2, 14, 16);
                    }
                }
            }
        }
    }

    // Suelo oscuro
    const suelo = ctx.createLinearGradient(0, base, 0, alto);
    suelo.addColorStop(0, "#17182b");
    suelo.addColorStop(1, "#080b18");

    ctx.fillStyle = suelo;
    ctx.fillRect(0, base, ancho, alto - base);

    // Línea del horizonte
    ctx.fillStyle = "#55516f";
    ctx.globalAlpha = 0.35;
    ctx.fillRect(0, base, ancho, 2);
    ctx.globalAlpha = 1;

    // Calle
    ctx.fillStyle = "#0b0e1c";
    ctx.fillRect(0, alto - 22, ancho, 22);

    // Marcas de la calle
    ctx.fillStyle = "#55516f";

    for (let x = 0; x < ancho; x += 100) {
        ctx.fillRect(x, alto - 12, 42, 3);
    }
}

function dibujarFondo() {
    dibujarCielo();
    dibujarCiudad();
}

// ==========================================
// CLASE GATO
// ==========================================

class Gato {
    constructor() {
        this.tamano = TAMANO_GATO;

        this.color = pelajes[
            Math.floor(Math.random() * pelajes.length)
        ];

        this.patron = Math.floor(Math.random() * 4);

        const mitad = this.tamano / 2;

        this.x = mitad + Math.random() * Math.max(1, ancho - this.tamano);

        this.y = 125 + mitad +
            Math.random() * Math.max(1, alto - 125 - this.tamano);

        this.dx = (Math.random() < 0.5 ? -1 : 1)
            * (1 + Math.random() * 2)
            * velocidadExtra;

        this.dy = (Math.random() < 0.5 ? -1 : 1)
            * (1 + Math.random() * 2)
            * velocidadExtra;

        this.tiempoDestello = 0;
        this.enfriamientoColision = 0;
    }

    // Dibujar gato pixel art
    dibujar() {
        const p = this.tamano / 16;

        const cuerpo = this.tiempoDestello > 0
            ? "#381d5e"
            : this.color.cuerpo;

        const sombra = this.tiempoDestello > 0
            ? "#3f2f50"
            : this.color.sombra;

        const claro = this.tiempoDestello > 0
            ? "#5e5268"
            : this.color.claro;

        ctx.save();

        ctx.translate(
            Math.round(this.x - this.tamano / 2),
            Math.round(this.y - this.tamano / 2)
        );

        // Cola
        ctx.fillStyle = sombra;
        ctx.fillRect(p * 2, p * 10, p * 2, p * 3);
        ctx.fillRect(p, p * 9, p * 2, p * 2);
        ctx.fillRect(p * 2, p * 13, p * 2, p);

        // Orejas
        ctx.fillStyle = sombra;
        ctx.fillRect(p * 3, p, p * 4, p * 4);
        ctx.fillRect(p * 9, p, p * 4, p * 4);

        ctx.fillStyle = cuerpo;
        ctx.fillRect(p * 4, p, p * 3, p * 3);
        ctx.fillRect(p * 9, p, p * 3, p * 3);

        ctx.fillStyle = claro;
        ctx.fillRect(p * 5, p * 2, p, p * 2);
        ctx.fillRect(p * 10, p * 2, p, p * 2);

        // Cabeza
        ctx.fillStyle = sombra;
        ctx.fillRect(p * 2, p * 4, p * 12, p * 9);
        ctx.fillRect(p * 3, p * 3, p * 10, p * 11);

        ctx.fillStyle = cuerpo;
        ctx.fillRect(p * 3, p * 4, p * 10, p * 8);
        ctx.fillRect(p * 4, p * 3, p * 8, p * 10);

        // Rayas
        if (this.patron === 0 || this.color.nombre === "atigrado") {
            ctx.fillStyle = sombra;
            ctx.fillRect(p * 5, p * 4, p, p * 3);
            ctx.fillRect(p * 8, p * 4, p, p * 3);
            ctx.fillRect(p * 6, p * 8, p, p * 2);
        }

        // Manchas
        if (this.patron === 1 || this.color.nombre === "carey") {
            ctx.fillStyle = claro;
            ctx.fillRect(p * 4, p * 5, p * 3, p * 2);
            ctx.fillRect(p * 9, p * 8, p * 3, p * 2);
        }

        // Mejillas
        ctx.fillStyle = claro;
        ctx.fillRect(p * 4, p * 9, p * 3, p * 2);
        ctx.fillRect(p * 9, p * 9, p * 3, p * 2);

        // Ojos
        ctx.fillStyle = "#272337";
        ctx.fillRect(p * 4, p * 7, p * 3, p * 2);
        ctx.fillRect(p * 9, p * 7, p * 3, p * 2);

        ctx.fillStyle = "#a8e6a1";
        ctx.fillRect(p * 5, p * 7, p, p * 2);
        ctx.fillRect(p * 10, p * 7, p, p * 2);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(p * 5, p * 7, p, p);

        // Nariz
        ctx.fillStyle = "#d87d9d";
        ctx.fillRect(p * 7, p * 10, p * 2, p);

        // Hocico
        ctx.fillStyle = claro;
        ctx.fillRect(p * 6, p * 10, p * 2, p * 2);
        ctx.fillRect(p * 8, p * 10, p * 2, p * 2);

        // Bigotes
        ctx.fillStyle = sombra;
        ctx.fillRect(p, p * 10, p * 4, p);
        ctx.fillRect(p * 11, p * 10, p * 4, p);
        ctx.fillRect(p * 2, p * 12, p * 3, p);
        ctx.fillRect(p * 11, p * 12, p * 3, p);

        // Patas
        ctx.fillStyle = sombra;
        ctx.fillRect(p * 4, p * 13, p * 3, p * 2);
        ctx.fillRect(p * 9, p * 13, p * 3, p * 2);

        ctx.fillStyle = cuerpo;
        ctx.fillRect(p * 4, p * 13, p * 2, p);
        ctx.fillRect(p * 9, p * 13, p * 2, p);

        ctx.restore();
    }

    // Movimiento y rebotes
    actualizar() {
        this.x += this.dx;
        this.y += this.dy;

        const mitad = this.tamano / 2;
        const limiteSuperior = 115 + mitad;

        if (this.x - mitad <= 0) {
            this.x = mitad;
            this.dx = Math.abs(this.dx);
        }

        if (this.x + mitad >= ancho) {
            this.x = ancho - mitad;
            this.dx = -Math.abs(this.dx);
        }

        if (this.y - mitad <= limiteSuperior - mitad) {
            this.y = limiteSuperior;
            this.dy = Math.abs(this.dy);
        }

        if (this.y + mitad >= alto) {
            this.y = alto - mitad;
            this.dy = -Math.abs(this.dy);
        }

        if (this.tiempoDestello > 0) {
            this.tiempoDestello--;
        }

        if (this.enfriamientoColision > 0) {
            this.enfriamientoColision--;
        }
    }

    // Detectar clic sobre el gato
    contiene(px, py) {
        return (
            px >= this.x - this.tamano * 0.65 &&
            px <= this.x + this.tamano * 0.65 &&
            py >= this.y - this.tamano * 0.65 &&
            py <= this.y + this.tamano * 0.65
        );
    }
}

// ==========================================
// CREAR LOS GATOS
// ==========================================

function crearGatos() {
    gatos = [];

    for (let i = 0; i < TOTAL_GATOS; i++) {
        gatos.push(new Gato());
    }
}

// ==========================================
// COLISIONES Y CAMBIO DE DIRECCIÓN
// ==========================================

function detectarColisiones() {
    for (let i = 0; i < gatos.length; i++) {
        for (let j = i + 1; j < gatos.length; j++) {
            const a = gatos[i];
            const b = gatos[j];

            const diferenciaX = b.x - a.x;
            const diferenciaY = b.y - a.y;

            const distancia = Math.sqrt(
                diferenciaX * diferenciaX +
                diferenciaY * diferenciaY
            );

            const distanciaMinima = (a.tamano + b.tamano) / 2;

            if (
                distancia < distanciaMinima &&
                a.enfriamientoColision === 0 &&
                b.enfriamientoColision === 0
            ) {
                let nx = diferenciaX;
                let ny = diferenciaY;

                const longitud = Math.sqrt(nx * nx + ny * ny) || 1;

                nx /= longitud;
                ny /= longitud;

                // Componentes de velocidad en la dirección del choque
                const velocidadA = a.dx * nx + a.dy * ny;
                const velocidadB = b.dx * nx + b.dy * ny;

                // Intercambiar componentes normales de velocidad
                a.dx += (velocidadB - velocidadA) * nx;
                a.dy += (velocidadB - velocidadA) * ny;

                b.dx += (velocidadA - velocidadB) * nx;
                b.dy += (velocidadA - velocidadB) * ny;

                // Separar los gatos para evitar que se encimen
                const solapamiento = distanciaMinima - distancia;
                const separacion = solapamiento / 2 + 1;

                a.x -= nx * separacion;
                a.y -= ny * separacion;

                b.x += nx * separacion;
                b.y += ny * separacion;

                // Destello rosa y lila
                a.tiempoDestello = 10;
                b.tiempoDestello = 10;

                // Evitar repetir el mismo choque inmediatamente
                a.enfriamientoColision = 8;
                b.enfriamientoColision = 8;
            }
        }
    }
}

// ==========================================
// ATRAPAR GATOS
// ==========================================

canvas.addEventListener("pointerdown", function (evento) {
    const rect = canvas.getBoundingClientRect();

    const mouseX = evento.clientX - rect.left;
    const mouseY = evento.clientY - rect.top;

    for (let i = gatos.length - 1; i >= 0; i--) {
        if (gatos[i].contiene(mouseX, mouseY)) {
            // Eliminar el gato atrapado
            gatos.splice(i, 1);

            puntos++;
            marcador.textContent = puntos;

            // Aumentar velocidad cada cinco gatos atrapados
            if (puntos % 5 === 0) {
                velocidadExtra += 0.15;

                gatos.forEach(gato => {
                    gato.dx *= 1.15;
                    gato.dy *= 1.15;
                });
            }

            // Crear otro gato para mantener 25 en pantalla
            gatos.push(new Gato());

            break;
        }
    }
});

// ==========================================
// ANIMACIÓN PRINCIPAL
// ==========================================

function animar() {
    ctx.clearRect(0, 0, ancho, alto);

    dibujarFondo();

    gatos.forEach(gato => gato.actualizar());

    detectarColisiones();

    gatos.forEach(gato => gato.dibujar());

    requestAnimationFrame(animar);
}

// ==========================================
// INICIAR PROGRAMA
// ==========================================

ajustarCanvas();
crearGatos();
animar();

window.addEventListener("resize", ajustarCanvas);