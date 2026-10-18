// ==========================================
// CONFIGURACIÓN DEL CANVAS
// ==========================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Colores del fondo
const fondo = "#50237c";

// ==========================================
// CONFIGURACIÓN DEL JUEGO
// ==========================================

const TOTAL_OBJETOS = 25;

let objetos = [];
let contador = 0;
let velocidadNivel = 1;

// ==========================================
// CLASE OBJETO
// Cada objeto tiene sus propios atributos
// y métodos de movimiento y dibujo.
// ==========================================

class Objeto {
    constructor() {
        this.radio = Math.random() * 16 + 20;

        this.x = Math.random() *
            (canvas.width - this.radio * 2) + this.radio;

        this.y = -Math.random() * canvas.height;

        // Velocidad horizontal y vertical
        this.velocidadX = (Math.random() - 0.5) * 2;
        this.velocidadY = Math.random() * 2 + 2;

        // Gravedad y fuerza del rebote
        this.gravedad = 0.12;
        this.fuerzaRebote = 0.72;
        this.rebotes = 0;

        this.eliminado = false;

        // Diseño aleatorio
        const colores = [
            "#ff4fa3",
            "#ffcc00",
            "#00e5ff",
            "#a970ff",
            "#7dff7a",
            "#ff784f",
            "#ffffff"
        ];

        this.color = colores[
            Math.floor(Math.random() * colores.length)
        ];

        // Cada objeto tendrá una figura diferente
        const figuras = ["estrella", "rombo", "corazon", "flor"];

        this.figura = figuras[
            Math.floor(Math.random() * figuras.length)
        ];

        this.rotacion = Math.random() * Math.PI * 2;
        this.velocidadRotacion = (Math.random() - 0.5) * 0.06;

        this.reiniciarArriba();
    }

    // ======================================
    // REINICIAR OBJETO EN LA PARTE SUPERIOR
    // ======================================

    reiniciarArriba() {
        this.x = Math.random() *
            (canvas.width - this.radio * 2) + this.radio;

        this.y = -this.radio - Math.random() * 150;

        this.velocidadY = Math.random() * 2 + 2;
        this.velocidadX = (Math.random() - 0.5) * 2;

        this.rebotes = 0;
        this.fuerzaRebote = 0.72;
        this.rotacion = Math.random() * Math.PI * 2;
        this.eliminado = false;
    }

    // ======================================
    // DIBUJAR FIGURAS
    // ======================================

    dibujarFigura() {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotacion);

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;

        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;

        ctx.beginPath();

        if (this.figura === "estrella") {
            // Estrella de cinco puntas
            for (let i = 0; i < 10; i++) {
                const radio = i % 2 === 0
                    ? this.radio
                    : this.radio * 0.45;

                const angulo = i * Math.PI / 5 - Math.PI / 2;

                const px = Math.cos(angulo) * radio;
                const py = Math.sin(angulo) * radio;

                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }

            ctx.closePath();
            ctx.fill();
            ctx.stroke();

        } else if (this.figura === "rombo") {
            ctx.moveTo(0, -this.radio);
            ctx.lineTo(this.radio * 0.7, 0);
            ctx.lineTo(0, this.radio);
            ctx.lineTo(-this.radio * 0.7, 0);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();

        } else if (this.figura === "corazon") {
            const r = this.radio * 0.75;

            ctx.moveTo(0, r * 0.9);
            ctx.bezierCurveTo(
                -r * 1.8, -r * 0.2,
                -r * 1.2, -r * 1.5,
                0, -r * 0.7
            );

            ctx.bezierCurveTo(
                r * 1.2, -r * 1.5,
                r * 1.8, -r * 0.2,
                0, r * 0.9
            );

            ctx.closePath();
            ctx.fill();
            ctx.stroke();

        } else if (this.figura === "flor") {
            for (let i = 0; i < 6; i++) {
                const angulo = i * Math.PI / 3;

                const px = Math.cos(angulo) * this.radio * 0.55;
                const py = Math.sin(angulo) * this.radio * 0.55;

                ctx.moveTo(px + this.radio * 0.35, py);

                ctx.arc(
                    px,
                    py,
                    this.radio * 0.35,
                    0,
                    Math.PI * 2
                );
            }

            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, 0, this.radio * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = "#fff3a0";
            ctx.fill();

            ctx.strokeStyle = "#ffffff";
            ctx.stroke();
        }

        ctx.restore();
    }

    // ======================================
    // MOVIMIENTO Y CAÍDA LIBRE
    // ======================================

    actualizar() {
        if (this.eliminado) return;

        // Caída vertical con aceleración por gravedad
        this.velocidadY += this.gravedad;
        this.y += this.velocidadY * velocidadNivel;

        // Desplazamiento horizontal
        this.x += this.velocidadX * velocidadNivel;

        // Rotación de las figuras
        this.rotacion += this.velocidadRotacion;

        // Rebote en las paredes laterales
        if (this.x + this.radio >= canvas.width) {
            this.x = canvas.width - this.radio;
            this.velocidadX = -Math.abs(this.velocidadX);
        }

        if (this.x - this.radio <= 0) {
            this.x = this.radio;
            this.velocidadX = Math.abs(this.velocidadX);
        }

        // Rebote en el piso
        if (this.y + this.radio >= canvas.height) {
            this.y = canvas.height - this.radio;

            this.velocidadY = -Math.abs(this.velocidadY) *
                this.fuerzaRebote;

            this.rebotes++;

            // Cada rebote pierde fuerza
            this.fuerzaRebote *= 0.68;

            // Cuando ya casi no rebota, reaparece arriba
            if (
                Math.abs(this.velocidadY) < 1 ||
                this.rebotes >= 6
            ) {
                this.reiniciarArriba();
            }
        }

        // Evitar que los objetos se salgan por arriba
        if (this.y + this.radio < 0) {
            this.y = -this.radio;
        }
    }

    // ======================================
    // DETECTAR CLIC SOBRE EL OBJETO
    // ======================================

    contienePunto(mouseX, mouseY) {
        const distanciaX = mouseX - this.x;
        const distanciaY = mouseY - this.y;

        const distancia = Math.sqrt(
            distanciaX * distanciaX +
            distanciaY * distanciaY
        );

        return distancia <= this.radio;
    }
}

// ==========================================
// CREAR LOS 25 OBJETOS
// ==========================================

function crearObjetos() {
    objetos = [];

    for (let i = 0; i < TOTAL_OBJETOS; i++) {
        objetos.push(new Objeto());
    }
}

// ==========================================
// CONTADOR Y NIVELES DE VELOCIDAD
// ==========================================

function dibujarContador() {
    ctx.save();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    ctx.fillText(
        "Objetos eliminados: " + contador,
        canvas.width - 25,
        25
    );

    let mensaje = "Velocidad: inicial";

    if (contador > 20) {
        mensaje = "Velocidad: alta";
    } else if (contador > 10) {
        mensaje = "Velocidad: media";
    }

    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffccff";

    ctx.fillText(
        mensaje,
        canvas.width - 25,
        58
    );

    ctx.restore();
}

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
// DETECTAR CLIC IZQUIERDO DEL MOUSE
// ==========================================

canvas.addEventListener("click", function(evento) {
    // Solo aceptar el botón izquierdo
    if (evento.button !== 0) return;

    const rect = canvas.getBoundingClientRect();

    const mouseX = evento.clientX - rect.left;
    const mouseY = evento.clientY - rect.top;

    // Recorrer de atrás hacia adelante
    for (let i = objetos.length - 1; i >= 0; i--) {
        const objeto = objetos[i];

        if (objeto.contienePunto(mouseX, mouseY)) {
            // Sumar al contador
            contador++;

            // Eliminar el objeto y crear otro
            objeto.reiniciarArriba();

            // Actualizar el nivel de velocidad
            actualizarVelocidad();

            // Solo eliminar un objeto por clic
            break;
        }
    }
});

// ==========================================
// FONDO DECORATIVO
// ==========================================

function dibujarFondo() {
    const gradiente = ctx.createLinearGradient(
        0, 0, canvas.width, canvas.height
    );

    gradiente.addColorStop(0, "#1b1028");
    gradiente.addColorStop(0.5, "#30204d");
    gradiente.addColorStop(1, "#101b35");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pequeñas estrellas decorativas
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";

    for (let i = 0; i < 45; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 83.7) % canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Instrucciones
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.fillText("¡Atrapa las figuras!", 25, 25);

    ctx.font = "14px Arial";
    ctx.fillStyle = "#e6d9ff";

    ctx.fillText(
        "Haz clic izquierdo sobre las figuras para atraparlas",
        25,
        53
    );
}

// ==========================================
// ANIMACIÓN PRINCIPAL
// ==========================================

function animar() {
    // Dibujar el fondo
    dibujarFondo();

    // Actualizar y dibujar cada objeto
    for (const objeto of objetos) {
        objeto.actualizar();
        objeto.dibujarFigura();
    }

    // Dibujar contador y velocidad
    dibujarContador();

    // Repetir animación
    requestAnimationFrame(animar);
}

// ==========================================
// AJUSTAR EL CANVAS AL CAMBIAR DE TAMAÑO
// ==========================================

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==========================================
// INICIAR APLICACIÓN
// ==========================================

crearObjetos();
actualizarVelocidad();
animar();