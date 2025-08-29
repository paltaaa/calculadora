// widget tirabale - reloj de calculhora
// easter egg divertido para el footer

class RelojTirabale {
    constructor() {
        this.reloj = null;
        this.mensaje = null;
        this.container = null;
        this.isDragging = false;
        this.mensajes = [
            "PARAAA 😵",
            "AYUDA FORTUUU 🥴",
            "ASESINOOOO 😨",
            "no retobes amigo 🤕",
            "basta xfa 😭",
            "john pork",
        ];

        this.init();
    }

    init() {
        // esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.reloj = document.getElementById('reloj-tirabale');
        this.mensaje = document.getElementById('mensaje-rebote');
        this.container = document.getElementById('widget-container');

        if (!this.reloj || !this.mensaje || !this.container) {
            console.warn('elementos del widget tirabale no encontrados');
            return;
        }

        this.configurarEventos();
        console.log('✅ widget tirabale inicializado');
    }

    configurarEventos() {
        // eventos de mouse
        this.reloj.addEventListener('mousedown', this.iniciarArrastre.bind(this));
        document.addEventListener('mousemove', this.arrastrar.bind(this));
        document.addEventListener('mouseup', this.terminarArrastre.bind(this));

        // eventos de touch para móviles
        this.reloj.addEventListener('touchstart', this.iniciarArrastre.bind(this), { passive: false });
        document.addEventListener('touchmove', this.arrastrar.bind(this), { passive: false });
        document.addEventListener('touchend', this.terminarArrastre.bind(this));

        // evitar comportamientos por defecto
        this.reloj.addEventListener('dragstart', (e) => e.preventDefault());
    }

    iniciarArrastre(e) {
        e.preventDefault();

        this.isDragging = true;
        this.reloj.classList.add('dragging');

        // obtener posición inicial
        const rect = this.reloj.getBoundingClientRect();
        this.offsetX = (e.clientX || e.touches[0].clientX) - rect.left;
        this.offsetY = (e.clientY || e.touches[0].clientY) - rect.top;

        // guardar posición original para el rebote
        this.posicionOriginal = {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY
        };

        // hacer el reloj absoluto para poder moverlo
        this.reloj.style.position = 'fixed';
        this.reloj.style.zIndex = '1000';
        this.reloj.style.pointerEvents = 'none';

        console.log('🖱️ arrastrando reloj...');
    }

    arrastrar(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        if (!clientX || !clientY) return;

        // actualizar posición
        this.reloj.style.left = (clientX - this.offsetX) + 'px';
        this.reloj.style.top = (clientY - this.offsetY) + 'px';
    }

    terminarArrastre(e) {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.reloj.classList.remove('dragging');
        this.reloj.style.pointerEvents = 'auto';

        // calcular la distancia del arrastre
        const rect = this.reloj.getBoundingClientRect();
        const distancia = Math.sqrt(
            Math.pow(rect.left - this.posicionOriginal.x, 2) +
            Math.pow(rect.top - this.posicionOriginal.y, 2)
        );

        // si se arrastró lo suficiente, hacer rebote
        if (distancia > 50) {
            this.hacerRebote();
        } else {
            this.volverAOriginal();
        }

        console.log(`📍 reloj soltado - distancia: ${Math.round(distancia)}px`);
    }

    hacerRebote() {
        // mostrar mensaje aleatorio
        this.mostrarMensaje();

        // animación de rebote de vuelta a la posición original
        anime({
            targets: this.reloj,
            left: this.posicionOriginal.x + 'px',
            top: this.posicionOriginal.y + 'px',
            rotate: [0, 360, 0],
            scale: [1.2, 0.8, 1.1, 1],
            duration: 800,
            easing: 'easeOutBounce',
            complete: () => {
                // restaurar estilos originales
                this.restaurarEstilos();
                // animación de temblor
                this.reloj.classList.add('reloj-temblor');
                setTimeout(() => {
                    this.reloj.classList.remove('reloj-temblor');
                }, 500);
            }
        });

        console.log('🎾 reloj rebotando de vuelta...');
    }

    volverAOriginal() {
        // volver suavemente sin efectos dramáticos
        anime({
            targets: this.reloj,
            left: this.posicionOriginal.x + 'px',
            top: this.posicionOriginal.y + 'px',
            duration: 300,
            easing: 'easeOutQuad',
            complete: () => {
                this.restaurarEstilos();
            }
        });
    }

    mostrarMensaje() {
        // elegir mensaje aleatorio
        const mensajeAleatorio = this.mensajes[Math.floor(Math.random() * this.mensajes.length)];
        this.mensaje.textContent = mensajeAleatorio;

        // mostrar mensaje
        this.mensaje.classList.add('mostrar');

        // ocultar después de la animación
        setTimeout(() => {
            this.mensaje.classList.remove('mostrar');
        }, 2000);

        console.log(`💬 mensaje mostrado: ${mensajeAleatorio}`);
    }

    restaurarEstilos() {
        // volver a los estilos originales
        this.reloj.style.position = 'relative';
        this.reloj.style.left = 'auto';
        this.reloj.style.top = 'auto';
        this.reloj.style.zIndex = 'auto';
    }
}

// inicializar cuando se cargue la página
const widgetReloj = new RelojTirabale();