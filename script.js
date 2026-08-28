// app.js
const {
    createApp,
    ref,
    watch,
    computed,
    onMounted,
    onUnmounted
} = Vue;

const app = createApp({
    setup() {
        const scrolled = ref(false);

        // Menu UX state
        const selectedCategory = ref('all');
        const menuSearch = ref('');
        const showFilterPanel = ref(false);
        const activeFeatureFilters = ref([]);
        const openAccordions = ref([]);
        const expandedCategories = ref([]);
        const selectedProduct = ref(null);
        const isModalOpen = ref(false);

        const selectedOption = ref('');
        const selectedVariantLabel = ref('');

        const mobileMenuOpen = ref(false);
        const mobileMenuDropdownOpen = ref(false);
        const currentSlide = ref(0);
        let autoplayInterval = null;

        // Nuevas categorías según segmentación
        const menuCategories = ref([
            { id: 'entradas', name: 'Entradas', icon: '🥟' },
            { id: 'sushi', name: 'Sushi', icon: '🍣' },
            { id: 'rolls', name: 'Rolls', icon: '🍱' },
            { id: 'tablas', name: 'Tablas', icon: '🎎' }
        ]);

        const categories = ref([
            { id: 'all', name: 'Todo', icon: '●' },
            ...menuCategories.value
        ]);

        const carouselImages = ref([
            { src: 'assets/carrousel/16.59.36.jpeg', alt: 'SENDA Sushi - Imagen 1' },
            { src: 'assets/carrousel/17.13.13.jpeg', alt: 'SENDA Sushi - Imagen 2' },
            { src: 'assets/carrousel/17.13.56.jpeg', alt: 'SENDA Sushi - Imagen 3' },
            { src: 'assets/carrousel/17.14.31.jpeg', alt: 'SENDA Sushi - Imagen 4' },
            { src: 'assets/carrousel/17.17.27.jpeg', alt: 'SENDA Sushi - Imagen 5' }
        ]);

        // NUEVA ESTRUCTURA DE MENÚ SEGÚN SEGMENTACIÓN
        const menuItems = ref([
            // ========== ENTRADAS ==========
            {
                name: "Harumakis",
                secondname: "Carne o verdura",
                type: "Entrada",
                contents: "Harumakis de carne o verdura.",
                price: "$8.000",
                flags: ["Picante"],
                options: ["3 unidades"],
                category: "entradas",
                subcategory: "Entradas",
                pieces: "3 unidades",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Gyozas",
                secondname: "De cerdo",
                type: "Entrada",
                contents: "Gyozas rellenas de cerdo.",
                price: "$11.000",
                flags: ["Picante"],
                options: ["5 unidades"],
                category: "entradas",
                subcategory: "Entradas",
                pieces: "5 unidades",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Langostino crunchy",
                secondname: "Con guacamole",
                type: "Entrada",
                contents: "Langostinos crocantes acompañados de guacamole.",
                price: "$13.000",
                flags: ["Picante", "Tempura"],
                options: ["6 unidades"],
                category: "entradas",
                subcategory: "Entradas",
                pieces: "6 unidades",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Tempura",
                secondname: "Salmón con salsa Bs As / Langostino con salsa teriyaki",
                type: "Entrada",
                contents: "Salmón en tempura con salsa Bs As o Langostino en tempura con salsa teriyaki.",
                price: "$14.000",
                flags: ["Tempura", "Picante"],
                options: ["5 unidades"],
                category: "entradas",
                subcategory: "Entradas",
                pieces: "5 unidades",
                variants: [
                    { label: "Salmón", price: "$14.000" },
                    { label: "Langostino", price: "$14.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Colchón de arroz frito",
                secondname: "Topping de tartar de salmón y salsa Senda",
                type: "Entrada",
                contents: "Colchón de arroz frito con topping de tartar de salmón y salsa Senda.",
                price: "$14.000",
                flags: ["Empanado"],
                options: ["4 unidades"],
                category: "entradas",
                subcategory: "Entradas",
                pieces: "4 unidades",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ========== SUSHI (incluye Cortes, Sushi, Fusión, Platos) ==========
            // --- Cortes ---
            {
                name: "Temakis",
                secondname: "Atún rojo / Salmón / Pulpo",
                type: "Temaki",
                contents: "Atún rojo con philadelphia picante, pepino y ciboulette / Salmón con philadelphia y palta / Pulpo con palta, pasta de ají amarillo con limón y cilantro.",
                price: "$10.000",
                flags: ["Sin TACC", "Opción Veggie"],
                options: ["1 unidad"],
                category: "sushi",
                subcategory: "Cortes",
                pieces: "1 unidad",
                variants: [
                    { label: "Atún rojo", price: "$10.000" },
                    { label: "Salmón", price: "$10.000" },
                    { label: "Pulpo", price: "$10.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Nigiris",
                secondname: "Atún rojo / Pulpo / Salmón / Salmón flameado / Salmón ahumado / Langostino / Palta flameada",
                type: "Nigiri",
                contents: "Nigiris de diferentes variedades.",
                price: "$12.000",
                flags: ["Sin TACC", "Opción Veggie"],
                options: ["5 unidades"],
                category: "sushi",
                subcategory: "Cortes",
                pieces: "5 unidades",
                variants: [
                    { label: "Atún rojo", price: "$12.000" },
                    { label: "Pulpo", price: "$12.000" },
                    { label: "Salmón", price: "$12.000" },
                    { label: "Salmón flameado", price: "$12.000" },
                    { label: "Salmón ahumado", price: "$12.000" },
                    { label: "Langostino", price: "$12.000" },
                    { label: "Palta flameada", price: "$12.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Sashimis",
                secondname: "Salmón / Atún rojo / Pulpo / Deluxe",
                type: "Sashimi",
                contents: "Cortes de pescado fresco.",
                price: "$10.000",
                flags: ["Sin TACC"],
                options: ["3 unidades"],
                category: "sushi",
                subcategory: "Cortes",
                pieces: "3 unidades",
                variants: [
                    { label: "Salmón", price: "$10.000" },
                    { label: "Atún rojo", price: "$10.000" },
                    { label: "Pulpo", price: "$10.000" },
                    { label: "Deluxe", price: "$15.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Geishas",
                secondname: "Atún rojo / Pulpo / Salmón / Langostino crunchy",
                type: "Geisha",
                contents: "Atún rojo con palta, philadelphia y ciboulette / Pulpo y palta con teriyaki flameado / Salmón con palta y philadelphia / Langostino crunchy con palta y philadelphia envuelto en salmón.",
                price: "$13.000",
                flags: ["Sin TACC"],
                options: ["5 unidades"],
                category: "sushi",
                subcategory: "Cortes",
                pieces: "5 unidades",
                variants: [
                    { label: "Atún rojo", price: "$13.000" },
                    { label: "Pulpo", price: "$13.000" },
                    { label: "Salmón", price: "$13.000" },
                    { label: "Langostino crunchy", price: "$13.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Tiraditos",
                secondname: "Salmón / Atún rojo / Pulpo",
                type: "Tiradito",
                contents: "Salmón con jugo de lima y mango, pasta de ají amarillo y palta flameada / Atún rojo en salsa de soja alimonada y miso / Pulpo con espuma de aceituna, limón y aceite de oliva.",
                price: "$15.000",
                flags: [],
                options: ["6 unidades"],
                category: "sushi",
                subcategory: "Cortes",
                pieces: "6 unidades",
                variants: [
                    { label: "Salmón", price: "$15.000" },
                    { label: "Atún rojo", price: "$17.000" },
                    { label: "Pulpo", price: "$17.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // --- Sushi ---
            {
                name: "Hot dogs",
                secondname: "Salmón / Langostino crunchy / Atún rojo / Kani",
                type: "Hot Dog",
                contents: "Roll de arroz en panko, frito, relleno de palta y philadelphia.",
                price: "$15.000",
                flags: ["Picante", "Opción Veggie", "Tempura"],
                options: ["1 unidad"],
                category: "sushi",
                subcategory: "Sushi",
                pieces: "1 unidad",
                variants: [
                    { label: "Salmón", price: "$15.000" },
                    { label: "Langostino crunchy", price: "$15.000" },
                    { label: "Atún rojo", price: "$15.000" },
                    { label: "Kani", price: "$15.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Sushi bowls",
                secondname: "Salmón / Tropical / Langostino crunchy / Atún rojo / Vegetariano",
                type: "Sushi Bowl",
                contents: "Arroz dulce, palta, philadelphia y diferentes toppings.",
                price: "$18.000",
                flags: ["Picante", "Opción Veggie"],
                options: [],
                category: "sushi",
                subcategory: "Sushi",
                pieces: "",
                variants: [
                    { label: "Salmón", price: "$18.000" },
                    { label: "Tropical", price: "$18.000" },
                    { label: "Langostino crunchy", price: "$18.000" },
                    { label: "Atún rojo", price: "$18.000" },
                    { label: "Vegetariano", price: "$18.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Sushi burrito",
                secondname: "Tokyo / Crunchy / Veggie",
                type: "Sushi Burrito",
                contents: "Salmón, palta, philadelphia, pepino con salsa teriyaki / Langostino apanado, kanikama y hongo cocinados / Zanahoria, pepino, palta, huevo, philadelphia y sésamo tostado.",
                price: "$15.000",
                flags: ["Opción Veggie"],
                options: ["1 unidad"],
                category: "sushi",
                subcategory: "Sushi",
                pieces: "1 unidad",
                variants: [
                    { label: "Tokyo", price: "$15.000" },
                    { label: "Crunchy", price: "$15.000" },
                    { label: "Veggie", price: "$15.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Chow Fan",
                secondname: "Pollo / Vegetales",
                type: "Chow Fan",
                contents: "Arroz sofrito, huevo, zanahoria, arvejas y verdeo.",
                price: "$18.000",
                flags: ["Opción Veggie"],
                options: [],
                category: "sushi",
                subcategory: "Sushi",
                pieces: "",
                variants: [
                    { label: "Pollo", price: "$18.000" },
                    { label: "Vegetales", price: "$18.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // --- Fusión ---
            {
                name: "Tartares",
                secondname: "Atún rojo / Salmón / Pulpo",
                type: "Tartar",
                contents: "Colchón de palta con diferentes marinados.",
                price: "$17.000",
                flags: [],
                options: [],
                category: "sushi",
                subcategory: "Fusión",
                pieces: "",
                variants: [
                    { label: "Atún rojo", price: "$17.000" },
                    { label: "Salmón", price: "$17.000" },
                    { label: "Pulpo", price: "$17.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Ceviches",
                secondname: "Salmón / Atún rojo / Pulpo",
                type: "Ceviche",
                contents: "Cebolla morada en pluma, palta, ají dulce, jugo de limón, cilantro y lluvia de batatas fritas.",
                price: "$17.000",
                flags: ["Picante"],
                options: [],
                category: "sushi",
                subcategory: "Fusión",
                pieces: "",
                variants: [
                    { label: "Salmón", price: "$17.000" },
                    { label: "Atún rojo", price: "$17.000" },
                    { label: "Pulpo", price: "$18.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Baos",
                secondname: "Pulled Pork / Lango fusion",
                type: "Bao",
                contents: "Bondiola de cerdo desmenuzada, braseada con soja, verduras / Langostinos y champignon a la plancha con aceite de sésamo.",
                price: "$16.000",
                flags: ["Picante"],
                options: ["2 unidades"],
                category: "sushi",
                subcategory: "Fusión",
                pieces: "2 unidades",
                variants: [
                    { label: "Pulled Pork", price: "$16.000" },
                    { label: "Lango fusion", price: "$16.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // --- Platos ---
            {
                name: "Wok",
                secondname: "Pollo teriyaki / Langostinos / Salmón grille / Vegetales / Lomo / Mixto",
                type: "Wok",
                contents: "Zanahoria, brote de soja, huevo, verdeo y salsa de soja.",
                price: "$18.000",
                flags: ["Picante", "Opción Veggie"],
                options: [],
                category: "sushi",
                subcategory: "Platos",
                pieces: "",
                variants: [
                    { label: "Pollo teriyaki", price: "$18.000" },
                    { label: "Langostinos", price: "$18.000" },
                    { label: "Salmón grille", price: "$18.000" },
                    { label: "Vegetales", price: "$18.000" },
                    { label: "Lomo", price: "$18.000" },
                    { label: "Mixto", price: "$20.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Cerdo Tonkatsu",
                secondname: "",
                type: "Plato",
                contents: "Apanado en panko, frito con salsa tonkatsu y arroz blanco.",
                price: "$18.000",
                flags: ["Picante", "Tempura"],
                options: [],
                category: "sushi",
                subcategory: "Platos",
                pieces: "",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Lomo salteado",
                secondname: "",
                type: "Plato",
                contents: "Lomo salteado con cebolla morada, morrón rojo y amarillo, y cilantro, sobre un colchón de arroz blanco con aceite de sésamo.",
                price: "$20.000",
                flags: ["Picante"],
                options: [],
                category: "sushi",
                subcategory: "Platos",
                pieces: "",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ========== ROLLS ==========
            {
                name: "Rolls clásicos",
                secondname: "New York / New York phila / Lango cheese / Salmón grille / Avocado tuna / Spicy tuna",
                type: "Roll clásico",
                contents: "Rolls clásicos de sushi.",
                price: "$8.500",
                flags: ["Picante"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Rolls clásicos",
                pieces: "5 piezas",
                variants: [
                    { label: "New York", price: "$8.500" },
                    { label: "New York phila", price: "$8.500" },
                    { label: "Lango cheese", price: "$8.500" },
                    { label: "Salmón grille", price: "$8.500" },
                    { label: "Avocado tuna", price: "$8.500" },
                    { label: "Spicy tuna", price: "$8.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Rolls veggie",
                secondname: "Zen / Praga / Wasabi",
                type: "Roll veggie",
                contents: "Rolls vegetarianos.",
                price: "$8.500",
                flags: ["Opción Veggie"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Rolls veggie",
                pieces: "5 piezas",
                variants: [
                    { label: "Zen", price: "$8.500" },
                    { label: "Praga", price: "$8.500" },
                    { label: "Wasabi", price: "$8.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Tamago rolls",
                secondname: "Cheese / Sweet palmi / Chill",
                type: "Tamago Roll",
                contents: "Sin arroz ni alga; roll envuelto en huevo dulce.",
                price: "$9.500",
                flags: ["Picante"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Tamago rolls",
                pieces: "5 piezas",
                variants: [
                    { label: "Cheese", price: "$9.500" },
                    { label: "Sweet palmi", price: "$9.500" },
                    { label: "Chill", price: "$9.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Rolls Premium",
                secondname: "Senda / Amai / Flameado / Tori / Umi / Crunchy / Nach / Palmi / Tataki",
                type: "Roll premium",
                contents: "Rolls premium con ingredientes seleccionados.",
                price: "$9.500",
                flags: ["Picante", "Tempura", "Flameado"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Rolls Premium",
                pieces: "5 piezas",
                variants: [
                    { label: "Senda", price: "$9.500" },
                    { label: "Amai", price: "$9.500" },
                    { label: "Flameado", price: "$9.500" },
                    { label: "Tori", price: "$9.500" },
                    { label: "Umi", price: "$9.500" },
                    { label: "Crunchy", price: "$9.500" },
                    { label: "Nach", price: "$9.500" },
                    { label: "Palmi", price: "$9.500" },
                    { label: "Tataki", price: "$9.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Rolls Supreme",
                secondname: "Ahumado / Acevichado / Caviar / Octopus / Red hot / Golden",
                type: "Roll supreme",
                contents: "Rolls supremos con toppings especiales.",
                price: "$10.500",
                flags: ["Picante", "Tempura", "Flameado"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Rolls Supreme",
                pieces: "5 piezas",
                variants: [
                    { label: "Ahumado", price: "$10.500" },
                    { label: "Acevichado", price: "$10.500" },
                    { label: "Caviar", price: "$10.500" },
                    { label: "Octopus", price: "$10.500" },
                    { label: "Red hot", price: "$10.500" },
                    { label: "Golden", price: "$10.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Hot rolls",
                secondname: "Mystic / Tokio / Mex",
                type: "Hot Roll",
                contents: "Roll relleno, apanado en panko frito.",
                price: "$10.000",
                flags: ["Empanado", "Tempura"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Hot rolls",
                pieces: "5 piezas",
                variants: [
                    { label: "Mystic", price: "$10.000" },
                    { label: "Tokio", price: "$10.000" },
                    { label: "Mex", price: "$10.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Hot rolls sin arroz",
                secondname: "Azteca / Bs As / Italia",
                type: "Hot Roll sin arroz",
                contents: "Apanado en panko, frito.",
                price: "$10.000",
                flags: ["Empanado", "Tempura"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Hot rolls sin arroz",
                pieces: "5 piezas",
                variants: [
                    { label: "Azteca", price: "$10.000" },
                    { label: "Bs As", price: "$10.000" },
                    { label: "Italia", price: "$10.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ========== TABLAS ==========
            {
                name: "Camino Simple",
                secondname: "x15 / x30",
                type: "Tabla",
                contents: "Combinación de piezas seleccionadas.",
                price: "$23.000",
                flags: ["Picante"],
                options: ["15 piezas", "30 piezas"],
                category: "tablas",
                subcategory: "Tablas",
                pieces: "15/30 piezas",
                variants: [
                    { label: "x15", price: "$23.000" },
                    { label: "x30", price: "$43.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Doble Paso",
                secondname: "x15 / x30",
                type: "Tabla",
                contents: "Combinación de piezas seleccionadas.",
                price: "$26.000",
                flags: ["Picante", "Empanado"],
                options: ["15 piezas", "30 piezas"],
                category: "tablas",
                subcategory: "Tablas",
                pieces: "15/30 piezas",
                variants: [
                    { label: "x15", price: "$26.000" },
                    { label: "x30", price: "$54.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Gran Paso",
                secondname: "x15 / x30",
                type: "Tabla",
                contents: "Combinación de piezas seleccionadas.",
                price: "$29.000",
                flags: ["Picante", "Empanado"],
                options: ["15 piezas", "30 piezas"],
                category: "tablas",
                subcategory: "Tablas",
                pieces: "15/30 piezas",
                variants: [
                    { label: "x15", price: "$29.000" },
                    { label: "x30", price: "$56.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ========== EXTRAS (Salsas) ==========
            {
                name: "Salsas",
                secondname: "Senda / Acevichada / Agridulce / Mayo spicy / Mango / Teriyaki / Bs As",
                type: "Salsa",
                contents: "Salsas para acompañar tu pedido.",
                price: "$1.500",
                flags: ["Picante"],
                options: ["1 porción"],
                category: "extras",
                subcategory: "Salsas",
                pieces: "1 porción",
                variants: [
                    { label: "Senda", price: "$1.500" },
                    { label: "Acevichada", price: "$1.500" },
                    { label: "Agridulce", price: "$1.500" },
                    { label: "Mayo spicy", price: "$1.500" },
                    { label: "Mango", price: "$1.500" },
                    { label: "Teriyaki", price: "$1.500" },
                    { label: "Bs As", price: "$1.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Extras",
                secondname: "Palitos chinos / Wasabi / Gari",
                type: "Extra",
                contents: "Extras para acompañar el pedido.",
                price: "$1.500",
                flags: [],
                options: ["1 unidad"],
                category: "extras",
                subcategory: "Extras",
                pieces: "1 unidad",
                variants: [
                    { label: "Palitos chinos", price: "$1.500" },
                    { label: "Wasabi", price: "$1.500" },
                    { label: "Gari", price: "$1.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            }
        ]);

        const schedules = ref([
            { day: 'Almuerzo:', hours: 'Miércoles a Sábados de 12 a 15:30hs' },
            { day: 'Cena:', hours: 'Martes a Domingos de 19 a 23hs' }
        ]);

        const socialLinks = ref([
            { icon: 'fab fa-instagram', link: 'https://www.instagram.com/sendasushi' },
            { icon: 'fab fa-facebook', link: 'https://www.facebook.com/share/1EiV5XMfN6/' }
        ]);

        // Flags disponibles según segmentación
        const availableFlags = computed(() => {
            const flagsMap = {
                'Veggie': '🥬 Veggie',
                'Picante': '🌶️ Picante',
                'Tempura': '🍤 Tempura',
                'Empanado': '🍘 Empanado',
                'Sin TACC': '🌾 Sin TACC',
                'Opción Veggie': '🌱 Opción Veggie'
            };
            
            const flags = [...new Set(
                menuItems.value.flatMap(item => item.flags || [])
            )];
            
            return flags.filter(flag => flagsMap[flag]);
        });

        const normalizedSearch = computed(() =>
            menuSearch.value.trim().toLowerCase()
        );

        const matchesMenuFilters = (item) => {
            const categoryMatches =
                selectedCategory.value === 'all' ||
                item.category === selectedCategory.value;

            const searchText = [
                item.name,
                item.secondname,
                item.type,
                item.contents,
                item.subcategory,
                item.pieces,
                ...(item.flags || [])
            ].join(' ').toLowerCase();

            const searchMatches = !normalizedSearch.value ||
                searchText.includes(normalizedSearch.value);

            const featureMatches =
                activeFeatureFilters.value.length === 0 ||
                activeFeatureFilters.value.every(flag =>
                    (item.flags || []).includes(flag)
                );

            return categoryMatches && searchMatches && featureMatches;
        };

        const menuGroups = computed(() => {
            return menuCategories.value.map(category => {
                const items = menuItems.value.filter(item =>
                    item.category === category.id &&
                    matchesMenuFilters(item)
                );

                return {
                    ...category,
                    items
                };
            }).filter(group => group.items.length > 0);
        });

        const visibleCategoryGroups = computed(() => {
            return menuGroups.value.map(group => {
                const isExpanded = expandedCategories.value.includes(group.id);
                const shouldShowAll = !!normalizedSearch.value ||
                    activeFeatureFilters.value.length > 0 ||
                    isExpanded;
                const validItems = group.items.filter(item => item && typeof item === 'object' && item.name);
                return {
                    ...group,
                    visibleItems: shouldShowAll ? validItems : validItems.slice(0, productPreviewLimit)
                };
            });
        });

        const totalVisibleProducts = computed(() =>
            menuGroups.value.reduce((total, group) => total + group.items.length, 0)
        );

        const searchResultCount = computed(() => totalVisibleProducts.value);

        const productPreviewLimit = 5;

        const selectedVariant = computed(() => {
            if (!selectedProduct.value || !selectedProduct.value.variants?.length) return null;
            return selectedProduct.value.variants.find(v => v.label === selectedVariantLabel.value) ||
                selectedProduct.value.variants[0];
        });

        const selectedProductPrice = computed(() =>
            selectedVariant.value?.price || selectedProduct.value?.price || ''
        );

        const productWhatsappLink = computed(() => {
            if (!selectedProduct.value) return '#';

            const option = selectedVariant.value ?
                ` - ${selectedVariant.value.label}` :
                (selectedOption.value ? ` - ${selectedOption.value}` : '');

            const text = encodeURIComponent(
                `Hola SENDA, quiero pedir ${selectedProduct.value.name}${option}. Precio: ${selectedProductPrice.value}`
            );

            return `https://wa.me/541140587888?text=${text}`;
        });

        const selectVariant = (variant) => {
            selectedVariantLabel.value = variant.label;
        };

        const selectCategory = (categoryId) => {
            selectedCategory.value = categoryId;

            if (categoryId !== 'all' && !openAccordions.value.includes(categoryId)) {
                openAccordions.value = [categoryId];
            }

            if (categoryId === 'all' && !openAccordions.value.length) {
                openAccordions.value = ['entradas'];
            }
        };

        const toggleAccordion = (categoryId) => {
            if (openAccordions.value.includes(categoryId)) {
                openAccordions.value = openAccordions.value.filter(
                    id => id !== categoryId
                );
            } else {
                openAccordions.value = [categoryId];
            }
        };

        const toggleCategoryExpanded = (categoryId) => {
            if (expandedCategories.value.includes(categoryId)) {
                expandedCategories.value = expandedCategories.value.filter(
                    id => id !== categoryId
                );
            } else {
                expandedCategories.value = [
                    ...expandedCategories.value,
                    categoryId
                ];
            }
        };

        const toggleFeatureFilter = (flag) => {
            if (activeFeatureFilters.value.includes(flag)) {
                activeFeatureFilters.value =
                    activeFeatureFilters.value.filter(item => item !== flag);
            } else {
                activeFeatureFilters.value = [
                    ...activeFeatureFilters.value,
                    flag
                ];
            }

            const firstGroup = menuGroups.value[0];
            if (firstGroup) {
                openAccordions.value = [firstGroup.id];
            }
        };

        const clearMenuSearch = () => {
            menuSearch.value = '';
        };

        const clearAllFilters = () => {
            menuSearch.value = '';
            selectedCategory.value = 'all';
            activeFeatureFilters.value = [];
            expandedCategories.value = [];
            showFilterPanel.value = false;
            openAccordions.value = ['entradas'];
        };

        const openProduct = (item) => {
            if (!item || typeof item !== 'object' || !item.name) {
                console.warn('⚠️ openProduct recibió un item inválido:', item);
                return;
            }

            console.log('✅ Abriendo producto:', item.name);
            isModalOpen.value = true;
            selectedProduct.value = item;
            selectedOption.value = item.options && item.options.length ? item.options[0] : '';
            selectedVariantLabel.value = item.variants && item.variants.length ? item.variants[0].label : '';
            document.body.classList.add('menu-lock-scroll');
        };

        const closeProduct = () => {
            isModalOpen.value = false;
            selectedProduct.value = null;
            selectedOption.value = '';
            selectedVariantLabel.value = '';
            document.body.classList.remove('menu-lock-scroll');
        };

        const getFlagClass = (flag) => {
            const classes = {
                'Picante': 'bg-red-100 text-red-800',
                'Veggie': 'bg-green-100 text-green-800',
                'Tempura': 'bg-orange-200 text-orange-700',
                'Flameado': 'bg-amber-800 text-white',
                'Empanado': 'bg-yellow-200 text-yellow-800',
                'Sin TACC': 'bg-purple-100 text-purple-800',
                'Opción Veggie': 'bg-emerald-100 text-emerald-800'
            };

            return classes[flag] || 'bg-gray-200 text-gray-700';
        };

        const toggleMobileMenu = () => {
            mobileMenuOpen.value = !mobileMenuOpen.value;
            if (!mobileMenuOpen.value) {
                mobileMenuDropdownOpen.value = false;
            }
        };

        const toggleMobileMenuDropdown = () => {
            mobileMenuDropdownOpen.value = !mobileMenuDropdownOpen.value;
        };

        const closeMobileMenu = () => {
            mobileMenuOpen.value = false;
            mobileMenuDropdownOpen.value = false;
        };

        const scrollToCategory = (categoryId) => {
            closeMobileMenu();
            selectCategory(categoryId);

            const menuSection = document.getElementById('menu');
            if (menuSection) {
                menuSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        };

        // Carousel functions
        const nextSlide = () => {
            currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length;
            resetAutoplay();
        };

        const prevSlide = () => {
            currentSlide.value = (currentSlide.value - 1 + carouselImages.value.length) % carouselImages.value.length;
            resetAutoplay();
        };

        const goToSlide = (index) => {
            currentSlide.value = index;
            resetAutoplay();
        };

        const startAutoplay = () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
            autoplayInterval = setInterval(() => {
                currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length;
            }, 4000);
        };

        const resetAutoplay = () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                startAutoplay();
            }
        };

        onMounted(() => {
            console.log('🚀 onMounted - selectedProduct inicial:', selectedProduct.value);
            console.log('🚀 onMounted - isModalOpen inicial:', isModalOpen.value);

            window.addEventListener('scroll', () => {
                scrolled.value = window.scrollY > 50;
            });
            startAutoplay();

            selectedProduct.value = null;
            isModalOpen.value = false;
            console.log('✅ Forzado selectedProduct a null:', selectedProduct.value);
            console.log('✅ Forzado isModalOpen a false:', isModalOpen.value);
        });

        onUnmounted(() => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        });

        return {
            scrolled,

            // Menu redesign
            selectedCategory,
            menuSearch,
            showFilterPanel,
            activeFeatureFilters,
            openAccordions,
            expandedCategories,
            selectedProduct,
            isModalOpen,
            selectedOption,
            categories,
            availableFlags,
            visibleCategoryGroups,
            totalVisibleProducts,
            searchResultCount,
            productPreviewLimit,
            productWhatsappLink,
            selectedProductPrice,
            selectedVariantLabel,
            selectVariant,
            selectCategory,
            toggleAccordion,
            toggleCategoryExpanded,
            toggleFeatureFilter,
            clearMenuSearch,
            clearAllFilters,
            openProduct,
            closeProduct,
            getFlagClass,

            // Existing site state
            menuCategories,
            carouselImages,
            menuItems,
            schedules,
            socialLinks,
            mobileMenuOpen,
            mobileMenuDropdownOpen,
            currentSlide,
            toggleMobileMenu,
            toggleMobileMenuDropdown,
            closeMobileMenu,
            scrollToCategory,
            nextSlide,
            prevSlide,
            goToSlide
        };
    }
});

// Montar la aplicación
app.mount('#app');