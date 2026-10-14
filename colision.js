
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color;
        this.text = text;
        this.speed = speed;
        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
        this.isColliding = false;
    }

    draw(context) {
        context.beginPath();

        context.strokeStyle = this.isColliding ? "#0000FF" : this.originalColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);

        // Actualizar la posición X
        this.posX += this.dx;

        // Cambiar la dirección si llega al borde en X
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        // Actualizar la posición Y
        this.posY += this.dy;

        // Cambiar la dirección si llega al borde en Y
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    // Detectar colisión con otro círculo
    checkCollision(other) {
        let distanciaX = other.posX - this.posX;
        let distanciaY = other.posY - this.posY;

        // Fórmula de distancia entre los centros
        let distancia = Math.sqrt(
            distanciaX * distanciaX + distanciaY * distanciaY
        );

        if (distancia <= this.radius + other.radius) {
            this.isColliding = true;
            other.isColliding = true;
        }
    }
}

// Crear un array para almacenar los círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

        // Velocidad entre 1 y 5
        let speed = Math.random() * 4 + 1;

        let text = `C${i + 1}`;
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Función para detectar las colisiones entre todos los círculos
function detectCollisions() {
    // Restablecer el estado de colisión
    circles.forEach(circle => {
        circle.isColliding = false;
    });

    // Comparar cada círculo con los demás
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            circles[i].checkCollision(circles[j]);
        }
    }
}

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height);

    circles.forEach(circle => {
        circle.update(ctx);
    });

    // Detectar colisiones en cada fotograma
    detectCollisions();

    requestAnimationFrame(animate);
}

// Generar 20 círculos y comenzar la animación
generateCircles(20);
animate();