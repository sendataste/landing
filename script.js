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
            { id: 'platos', name: 'Platos', icon: '🍜' },
            { id: 'cortes', name: 'Cortes', icon: '🔪' },
            { id: 'sushi', name: 'Sushi', icon: '🍣' },
            { id: 'fusion', name: 'Fusión', icon: '🌶️' },
            { id: 'rolls', name: 'Rolls', icon: '🍱' },
            { id: 'tablas', name: 'Tablas', icon: '🎎' },
            { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
            { id: 'postres', name: 'Postres y Café', icon: '🍰' },
            { id: 'extras', name: 'Salsas y Extras', icon: '🥢' }
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
            // ============================================================
            // ========== ENTRADAS ==========
            // ============================================================
            {
                name: "Harumakis",
                secondname: "Carne o verdura con salsa",
                type: "Entrada",
                contents: "Harumakis de carne o verdura con salsa.",
                price: "$9.000",
                flags: [],
                options: ["3 unidades"],
                category: "entradas",
                subcategory: "Entradas",
                pieces: "3 unidades",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Gyozas",
                secondname: "De cerdo y verduras",
                type: "Entrada",
                contents: "Gyozas rellenas de cerdo y verduras.",
                price: "$12.000",
                flags: [],
                options: ["5 unidades"],
                category: "entradas",
                subcategory: "Entradas",
                pieces: "5 unidades",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Langostino Crunchy",
                secondname: "Con salsa",
                type: "Entrada",
                contents: "Langostinos crocantes con salsa.",
                price: "$13.000",
                flags: ["Tempura"],
                options: ["6 unidades"],
                category: "entradas",
                subcategory: "Entradas",
                pieces: "6 unidades",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Tempura",
                secondname: "Salmón con salsa Bs As / Langostino con salsa teriyaki / Mixto",
                type: "Entrada",
                contents: "Salmón con salsa Bs As / Langostino con salsa teriyaki / Mixto salmón y langostino.",
                price: "$15.000",
                flags: ["Tempura"],
                options: ["5 unidades"],
                category: "entradas",
                subcategory: "Entradas",
                pieces: "5 unidades",
                variants: [
                    { label: "Salmón", price: "$15.000" },
                    { label: "Langostino", price: "$15.000" },
                    { label: "Mixto", price: "$15.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Colchón de arroz frito",
                secondname: "Topping de tartar de salmón y salsa Senda",
                type: "Entrada",
                contents: "Colchón de arroz frito con topping de tartar de salmón y salsa Senda.",
                price: "$14.000",
                flags: [],
                options: ["4 unidades"],
                category: "entradas",
                subcategory: "Entradas",
                pieces: "4 unidades",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ============================================================
            // ========== PLATOS ==========
            // ============================================================
            {
                name: "Sushi burrito",
                secondname: "Crunchy / Tokyo / Veggie",
                type: "Sushi Burrito",
                contents: "Crunchy: langostino apanado, kanikama y hongo en aceite de sésamo, palta, ciboulette con salsa acevichada / Tokyo: salmón, palta, philadelphia, pepino con salsa teriyaki / Veggie: zanahoria, pepino, palta, huevo, philadelphia y sésamo tostado.",
                price: "$18.000",
                flags: ["Opción Veggie"],
                options: ["1 unidad"],
                category: "platos",
                subcategory: "Platos",
                pieces: "1 unidad",
                variants: [
                    { label: "Crunchy", price: "$18.000" },
                    { label: "Tokyo", price: "$18.000" },
                    { label: "Veggie", price: "$18.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Chow Fan",
                secondname: "Pollo / Vegetales / Cerdo / Langostinos / Lomo / Veggie",
                type: "Chow Fan",
                contents: "Arroz sofrito, huevo, zanahoria, arvejas y verdeo. Pollo o Vegetales + 2 harumakis (carne o verdura). Fideos de huevo, morrón, cebolla, zanahoria, brote de soja y salsa roja.",
                price: "$18.000",
                flags: ["Opción Veggie"],
                options: [],
                category: "platos",
                subcategory: "Platos",
                pieces: "",
                variants: [
                    { label: "Pollo", price: "$18.000" },
                    { label: "Vegetales", price: "$18.000" },
                    { label: "Cerdo", price: "$18.000" },
                    { label: "Langostinos", price: "$18.000" },
                    { label: "Lomo", price: "$18.000" },
                    { label: "Veggie", price: "$18.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Wok",
                secondname: "Pollo teriyaki / Langostinos / Salmón grille / Vegetales / Lomo / Mixto",
                type: "Wok",
                contents: "Zanahoria, brote de soja, huevo, verdeo y salsa de soja. Mixto: salmón grille y langostinos.",
                price: "$20.000",
                flags: ["Picante", "Opción Veggie"],
                options: [],
                category: "platos",
                subcategory: "Platos",
                pieces: "",
                variants: [
                    { label: "Pollo teriyaki", price: "$20.000" },
                    { label: "Langostinos", price: "$20.000" },
                    { label: "Salmón grille", price: "$20.000" },
                    { label: "Vegetales", price: "$20.000" },
                    { label: "Lomo", price: "$20.000" },
                    { label: "Mixto", price: "$22.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Cerdo Tonkatsu",
                secondname: "",
                type: "Plato",
                contents: "Apanado en panko, frito con salsa tonkatsu y arroz con huevo.",
                price: "$18.000",
                flags: ["Tempura"],
                options: [],
                category: "platos",
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
                category: "platos",
                subcategory: "Platos",
                pieces: "",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ============================================================
            // ========== CORTES ==========
            // ============================================================
            {
                name: "Temakis",
                secondname: "Salmón / Langostino / Atún rojo / Pulpo",
                type: "Temaki",
                contents: "Salmón, philadelphia y palta / Langostino sellado en soja, palta, philadelphia y verdeo / Atún rojo, philadelphia picante, negui y pepino / Pulpo, palta, cremoso de ají amarillo, cilantro.",
                price: "$10.000",
                flags: ["Sin TACC", "Opción Veggie"],
                options: ["1 unidad"],
                category: "cortes",
                subcategory: "Cortes",
                pieces: "1 unidad",
                variants: [
                    { label: "Salmón", price: "$10.000" },
                    { label: "Langostino", price: "$10.000" },
                    { label: "Atún rojo", price: "$10.000" },
                    { label: "Pulpo", price: "$10.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Nigiris",
                secondname: "Atún rojo / Salmón / Salmón flameado / Salmón ahumado / Langostino / Palta flameada",
                type: "Nigiri",
                contents: "Atún rojo cremoso de ají amarillo con ralladura de lima / Salmón / Salmón flameado con mayonesa acevichada y hondashi / Salmón ahumado / Langostino / Palta flameada con salsa thai.",
                price: "$12.000",
                flags: ["Sin TACC", "Opción Veggie"],
                options: ["5 unidades"],
                category: "cortes",
                subcategory: "Cortes",
                pieces: "5 unidades",
                variants: [
                    { label: "Atún rojo", price: "$12.000" },
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
                secondname: "Salmón / Atún rojo / Pulpo / SENDA",
                type: "Sashimi",
                contents: "Salmón / Atún rojo / Pulpo / SENDA: salmón, atún, pulpo, salmón flameado.",
                price: "$15.000",
                flags: ["Sin TACC"],
                options: ["4 unidades"],
                category: "cortes",
                subcategory: "Cortes",
                pieces: "4 unidades",
                variants: [
                    { label: "Salmón", price: "$15.000" },
                    { label: "Atún rojo", price: "$15.000" },
                    { label: "Pulpo", price: "$15.000" },
                    { label: "SENDA", price: "$15.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Geishas",
                secondname: "Atún rojo / Pulpo / Salmón / Langostino crunchy",
                type: "Geisha",
                contents: "Atún rojo, palta, philadelphia y ciboulette / Pulpo, palta con teriyaki flameado / Salmón, palta y philadelphia / Langostino crunchy, palta, philadelphia envuelto en salmón.",
                price: "$13.000",
                flags: ["Sin TACC"],
                options: ["5 unidades"],
                category: "cortes",
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
                contents: "Salmón: jugo de lima y mango, cremoso de ají amarillo y palta flameada / Atún rojo: en salsa de soja alimonada, mirin, con cebolla morada en pluma / Pulpo: espuma de aceituna, ralladura de lima y aceite de oliva.",
                price: "$16.000",
                flags: [],
                options: ["6 unidades"],
                category: "cortes",
                subcategory: "Cortes",
                pieces: "6 unidades",
                variants: [
                    { label: "Salmón", price: "$16.000" },
                    { label: "Atún rojo", price: "$16.000" },
                    { label: "Pulpo", price: "$16.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ============================================================
            // ========== SUSHI ==========
            // ============================================================
            {
                name: "Hot dogs",
                secondname: "Salmón / Langostino crunchy / Atún rojo / Kani",
                type: "Hot Dog",
                contents: "Media alga, roll de arroz en panko, frito, relleno de palta y philadelphia. Salmón fresco o grille con lluvia de ciboulette / Langostino crunchy con lluvia de batata frita / Atún rojo con lluvia de pepino y teriyaki / Kani, champignon, salsa acevichada y lluvia de batata frita.",
                price: "$13.000",
                flags: ["Tempura", "Picante"],
                options: ["1 unidad"],
                category: "sushi",
                subcategory: "Sushi",
                pieces: "1 unidad",
                variants: [
                    { label: "Salmón", price: "$13.000" },
                    { label: "Langostino crunchy", price: "$13.000" },
                    { label: "Atún rojo", price: "$13.000" },
                    { label: "Kani", price: "$13.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Super Dog",
                secondname: "Salmón / Langostino crunchy / Atún rojo / Kani",
                type: "Super Dog",
                contents: "Alga completa, roll de arroz en panko, frito, relleno de palta y philadelphia. Salmón fresco o grille y negui / Langostino crunchy con lluvia de batata frita / Atún rojo con lluvia de pepino y teriyaki / Kani, champignon, salsa acevichada y sésamo.",
                price: "$19.000",
                flags: ["Tempura", "Picante"],
                options: ["1 unidad"],
                category: "sushi",
                subcategory: "Sushi",
                pieces: "1 unidad",
                variants: [
                    { label: "Salmón", price: "$19.000" },
                    { label: "Langostino crunchy", price: "$19.000" },
                    { label: "Atún rojo", price: "$19.000" },
                    { label: "Kani", price: "$19.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Sushi Burger",
                secondname: "Salmón / Langostino / Mixto / Kanikama / Veggie",
                type: "Sushi Burger",
                contents: "Todas las burger vienen con chips de pepino. Salmón: salmón crudo y ahumado con palta alimonada / Langostino: philadelphia hashi, negui y chips de pepino / Mixto: salmón y lango, philadelphia hashi, champignon y negui / Kanikama: kani en finos hilos, langostino crunch y palta / Veggie: palta alimonada, champignon, tomate asado.",
                price: "$20.000",
                flags: ["Opción Veggie"],
                options: ["1 unidad"],
                category: "sushi",
                subcategory: "Sushi",
                pieces: "1 unidad",
                variants: [
                    { label: "Salmón", price: "$20.000" },
                    { label: "Langostino", price: "$20.000" },
                    { label: "Mixto", price: "$20.000" },
                    { label: "Kanikama", price: "$20.000" },
                    { label: "Veggie", price: "$18.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Sushi bowls",
                secondname: "Tropical / Salmón / Langostino crunchy / Atún rojo / Vegetariano",
                type: "Sushi Bowl",
                contents: "Tropical: arroz dulce, palta, philadelphia, salmón fresco, mango e hilos de batata frita / Salmón: arroz dulce, palta, philadelphia, salmón grille y negui / Langostino crunchy: arroz dulce, palta, philadelphia, langostino crunchy, zanahoria tare y lluvia de batata frita / Atún rojo: arroz dulce, palta, philadelphia, atún rojo, pepino y salsa de ostras / Vegetariano: arroz dulce, palta, philadelphia, zanahoria tare, hongo rehogado en aceite de sésamo.",
                price: "$20.000",
                flags: ["Opción Veggie"],
                options: [],
                category: "sushi",
                subcategory: "Sushi",
                pieces: "",
                variants: [
                    { label: "Tropical", price: "$20.000" },
                    { label: "Salmón", price: "$20.000" },
                    { label: "Langostino crunchy", price: "$20.000" },
                    { label: "Atún rojo", price: "$20.000" },
                    { label: "Vegetariano", price: "$20.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ============================================================
            // ========== FUSIÓN ==========
            // ============================================================
            {
                name: "Tartares",
                secondname: "Salmón / Atún rojo / Pulpo",
                type: "Tartar",
                contents: "Salmón: colchón de palta, salmón crudo, ahumado, aceite de oliva, soja y ciboulette con ralladura de lima / Atún rojo: colchón de palta, atún marinado en aceite de sésamo y jengibre, con sésamo / Pulpo: colchón de palta, marinado en cremoso picante de ají amarillo coronado con brunoise de pepino.",
                price: "$23.000",
                flags: [],
                options: [],
                category: "fusion",
                subcategory: "Fusión",
                pieces: "",
                variants: [
                    { label: "Salmón", price: "$23.000" },
                    { label: "Atún rojo", price: "$23.000" },
                    { label: "Pulpo", price: "$23.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Ceviches",
                secondname: "Salmón o mixto / Pulpo o atún rojo",
                type: "Ceviche",
                contents: "Salmón o mixto con langostino: cebolla morada en pluma, palta, ají dulce, jugo de limón, cilantro y cancha / Pulpo o atún rojo: cebolla morada en pluma, palta, cilantro, jugo de limón, ají dulce, rodajas de boniato y cancha.",
                price: "$23.000",
                flags: ["Picante"],
                options: [],
                category: "fusion",
                subcategory: "Fusión",
                pieces: "",
                variants: [
                    { label: "Salmón o mixto", price: "$23.000" },
                    { label: "Pulpo o atún rojo", price: "$23.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Baos",
                secondname: "Pulled Pork / Lango fusion",
                type: "Bao",
                contents: "Pulled Pork occidental: bondiola de cerdo desmenuzada, braseada en cerveza, verduras, con tiritas de pepino / Lango fusion: langostinos y champignon a la plancha con aceite de sésamo con chips de pepino.",
                price: "$16.000",
                flags: ["Picante"],
                options: ["2 unidades"],
                category: "fusion",
                subcategory: "Fusión",
                pieces: "2 unidades",
                variants: [
                    { label: "Pulled Pork", price: "$16.000" },
                    { label: "Lango fusion", price: "$16.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ============================================================
            // ========== ROLLS ==========
            // ============================================================
            {
                name: "Rolls clásicos",
                secondname: "New York / Philadelphia / New York phila / California / Lango cheese / Salmón grille / Avocado tuna / Spicy tuna",
                type: "Roll clásico",
                contents: "New York: salmón y palta / Philadelphia: salmón y philadelphia / New York phila: salmón, palta y philadelphia / California: kanikama y palta / Lango cheese: langostino y philadelphia con sésamo / Salmón grille con cobertura de palta / Avocado tuna: atún, verdeo, jugo de limón, con cobertura de palta / Spicy tuna: atún, verdeo, jugo de limón, con cobertura de palta y salsa spicy.",
                price: "$9.500",
                flags: ["Picante"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Rolls clásicos",
                pieces: "5 piezas",
                variants: [
                    { label: "New York", price: "$9.500" },
                    { label: "Philadelphia", price: "$9.500" },
                    { label: "New York phila", price: "$9.500" },
                    { label: "California", price: "$9.500" },
                    { label: "Lango cheese", price: "$9.500" },
                    { label: "Salmón grille", price: "$9.500" },
                    { label: "Avocado tuna", price: "$9.500" },
                    { label: "Spicy tuna", price: "$9.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Rolls veggie",
                secondname: "Zen / Praga / Wasabi",
                type: "Roll veggie",
                contents: "Zen: zanahoria tare, philadelphia, con cobertura de palta flameada en salsa thai / Praga: palta, philadelphia, cobertura de mango, salsa mango y lluvia de batata / Wasabi: tomate asado, philadelphia, ciboulette, cobertura de palta y mayo wasabi.",
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
                contents: "Sin arroz ni alga, roll envuelto en huevo sweet. Cheese: salmón, philadelphia, verdeo / Sweet palmi: salmón, palmito, mango, con lluvia de almendras y salsa teriyaki / Chill: atún rojo, philadelphia picante y tira de pepino.",
                price: "$10.500",
                flags: ["Picante"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Tamago rolls",
                pieces: "5 piezas",
                variants: [
                    { label: "Cheese", price: "$10.500" },
                    { label: "Sweet palmi", price: "$10.500" },
                    { label: "Chill", price: "$10.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Rolls Premium",
                secondname: "Senda / Amai / Flameado / Tori / Umi / Crunchy / Maracuyá / Palmi / Tataki / Nach",
                type: "Roll premium",
                contents: "Senda: langostino, palta, philadelphia, con cobertura de salmón y salsa teriyaki / Amai: langostino crunchy, philadelphia, cobertura de salmón y salsa acevichada / Flameado: langostino, philadelphia, con cobertura de salmón flameado con mayo wasabi / Tori: salmón, philadelphia con lluvia de verdeo / Umi: salmón, philadelphia con cobertura de mango, salsa teriyaki y almendras picadas / Crunchy: salmón crunchy, palta con salsa acevichada y lluvia de batata frita / Maracuyá: langostino crunchy, palta, pepino, philadelphia hashi, envuelto en salmón y palta con salsa de maracuyá / Palmi: salmón, palmito, envuelto en palta / Tataki: hongo, philadelphia, coronado con kanikama spicy / Nach: salmón, palta coronado de salsa curry y diamante de langostino.",
                price: "$10.500",
                flags: ["Picante", "Tempura", "Flameado"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Rolls Premium",
                pieces: "5 piezas",
                variants: [
                    { label: "Senda", price: "$10.500" },
                    { label: "Amai", price: "$10.500" },
                    { label: "Flameado", price: "$10.500" },
                    { label: "Tori", price: "$10.500" },
                    { label: "Umi", price: "$10.500" },
                    { label: "Crunchy", price: "$10.500" },
                    { label: "Maracuyá", price: "$10.500" },
                    { label: "Palmi", price: "$10.500" },
                    { label: "Tataki", price: "$10.500" },
                    { label: "Nach", price: "$10.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Rolls Supreme",
                secondname: "Ahumado / Fusión / Caviar / Octopus / Red hot / Golden",
                type: "Roll supreme",
                contents: "Ahumado: palta, pepino con cobertura de salmón ahumado / Fusión: salmón, palta, con topping de pulpo con cremoso de ají y cancha / Caviar: philadelphia, palta con topping de tartar de salmón y caviar / Octopus: pulpo, con cobertura de palta flameada con salsa thai y teriyaki / Red hot: palta, kanikama, con topping spicy de tartar de atún / Golden: langostino, palta, cubierto de salmón flameado, jalapeño en tempura y caviar.",
                price: "$12.000",
                flags: ["Picante", "Tempura", "Flameado"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Rolls Supreme",
                pieces: "5 piezas",
                variants: [
                    { label: "Ahumado", price: "$12.000" },
                    { label: "Fusión", price: "$12.000" },
                    { label: "Caviar", price: "$12.000" },
                    { label: "Octopus", price: "$12.000" },
                    { label: "Red hot", price: "$12.000" },
                    { label: "Golden", price: "$12.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Hot rolls",
                secondname: "Mystic / Tokio / Furai",
                type: "Hot Roll",
                contents: "Roll relleno, apanado en panko frito. Mystic: salmón crunchy con philadelphia / Tokio: langostino, palta y philadelphia / Furai: kanikama, philadelphia con topping de guacamole.",
                price: "$10.500",
                flags: ["Empanado", "Tempura"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Hot rolls",
                pieces: "5 piezas",
                variants: [
                    { label: "Mystic", price: "$10.500" },
                    { label: "Tokio", price: "$10.500" },
                    { label: "Furai", price: "$10.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Hot rolls sin arroz",
                secondname: "Mex / Bs As / Italian",
                type: "Hot Roll sin arroz",
                contents: "Apanado en panko, frito. Mex: tiras de salmón, palta, con topping de salmón ahumado alimonado y maíz cancha / Bs As: tiras de salmón, palta, philadelphia, coronado con ciboulette y salsa Bs As / Italian: tiras de salmón, philadelphia, albahaca, coronado de tomate asado.",
                price: "$12.000",
                flags: ["Empanado", "Tempura"],
                options: ["5 piezas"],
                category: "rolls",
                subcategory: "Hot rolls sin arroz",
                pieces: "5 piezas",
                variants: [
                    { label: "Mex", price: "$12.000" },
                    { label: "Bs As", price: "$12.000" },
                    { label: "Italian", price: "$12.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ============================================================
            // ========== TABLAS ==========
            // ============================================================
            {
                name: "Camino Simple",
                secondname: "x15 / x30 / x50",
                type: "Tabla",
                contents: "x15: 2 Nigiris lango, 5 lango cheese, 4 california, 4 tuna spicy / x30: 3 Nigiri lango, 2 nigiri salmon, 5 california, 5 zen, 5 lango cheese, 5 avocado tuna y 5 makis grille / x50: 5 langostinos crunchy, 5 lango cheese, 5 california, 5 makis langostino, 5 new york, 5 grille, 5 zen, 5 avocado tuna, 5 new york phila, hot dog a elección.",
                price: "$25.000",
                flags: ["Picante", "Empanado"],
                options: ["15 piezas", "30 piezas", "50 piezas"],
                category: "tablas",
                subcategory: "Tablas",
                pieces: "15/30/50 piezas",
                variants: [
                    { label: "x15", price: "$25.000" },
                    { label: "x30", price: "$46.000" },
                    { label: "x50", price: "$80.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Doble Paso",
                secondname: "x15 / x30 / x50",
                type: "Tabla",
                contents: "x15: 2 Nigiri salmon, 2 geishas, 5 New York phila, 4 Umi, 2 Maki / x30: 2 Nigiri salmon, 3 geishas, 5 senda, 5 New York phila, 5 New York, 5 maki grille, 5 hot mystic / x50: 4 Nigiris salmon, 3 geishas de salmon, 3 sashimis, 5 salmon grille, 5 new york, 5 new york phila, 5 tamago cheese, 5 senda, 5 makis salmon, hot mystic, hot dog a elección.",
                price: "$28.000",
                flags: ["Picante", "Empanado"],
                options: ["15 piezas", "30 piezas", "50 piezas"],
                category: "tablas",
                subcategory: "Tablas",
                pieces: "15/30/50 piezas",
                variants: [
                    { label: "x15", price: "$28.000" },
                    { label: "x30", price: "$55.000" },
                    { label: "x50", price: "$89.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Gran Paso",
                secondname: "x15 / x30 / x60",
                type: "Tabla",
                contents: "x15: 2 Nigiris salmon ahumado, 5 tori, 5 octopus, 3 maki de atún rojo / x30: 2 Nigiris salmon, 3 geishas, 5 tori, 5 octopus, 5 maki atún rojo, 5 golden, 5 New York phila / x60: 5 octopus, 5 amai, 5 makis de atún rojo, 5 new york, 5 tori, 3 geishas, 4 sashimis de salmon, 3 nigiris de salmon ahumado, 5 crunchy, hot tokyo, hot dog a elección.",
                price: "$30.000",
                flags: ["Picante", "Empanado"],
                options: ["15 piezas", "30 piezas", "60 piezas"],
                category: "tablas",
                subcategory: "Tablas",
                pieces: "15/30/60 piezas",
                variants: [
                    { label: "x15", price: "$30.000" },
                    { label: "x30", price: "$60.000" },
                    { label: "x60", price: "$105.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ============================================================
            // ========== BEBIDAS ==========
            // ============================================================
            {
                name: "Gaseosas",
                secondname: "Coca / Coca Zero / Sprite / Fanta / Paso de los Toros Pomelo / Agua Tónica",
                type: "Bebida",
                contents: "Gaseosas en lata o botella.",
                price: "$3.500",
                flags: [],
                options: [],
                category: "bebidas",
                subcategory: "Bebidas sin alcohol",
                pieces: "",
                variants: [
                    { label: "Coca", price: "$3.500" },
                    { label: "Coca Zero", price: "$3.500" },
                    { label: "Sprite", price: "$3.500" },
                    { label: "Fanta", price: "$3.500" },
                    { label: "Paso de los Toros Pomelo", price: "$3.500" },
                    { label: "Agua Tónica", price: "$3.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Agua",
                secondname: "Sin gas / Con gas",
                type: "Bebida",
                contents: "Agua mineral.",
                price: "$3.000",
                flags: [],
                options: [],
                category: "bebidas",
                subcategory: "Bebidas sin alcohol",
                pieces: "",
                variants: [
                    { label: "Sin gas", price: "$3.000" },
                    { label: "Con gas", price: "$3.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Agua saborizada",
                secondname: "Pomelo / Manzana",
                type: "Bebida",
                contents: "Agua saborizada.",
                price: "$3.000",
                flags: [],
                options: [],
                category: "bebidas",
                subcategory: "Bebidas sin alcohol",
                pieces: "",
                variants: [
                    { label: "Pomelo", price: "$3.000" },
                    { label: "Manzana", price: "$3.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Cerveza",
                secondname: "Asahi japonesa / Corona",
                type: "Bebida",
                contents: "Cerveza importada.",
                price: "$5.000",
                flags: [],
                options: [],
                category: "bebidas",
                subcategory: "Bebidas con alcohol",
                pieces: "",
                variants: [
                    { label: "Asahi japonesa", price: "$5.000" },
                    { label: "Corona", price: "$6.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Vino Blanco",
                secondname: "Bodega Putruele 500ml / Cordero con piel de lobo 750ml / Lola Torrontés 750ml / Puerta Alta Torrontés 750ml",
                type: "Bebida",
                contents: "Vinos blancos.",
                price: "$10.000",
                flags: [],
                options: [],
                category: "bebidas",
                subcategory: "Bebidas con alcohol",
                pieces: "",
                variants: [
                    { label: "Bodega Putruele 500ml", price: "$10.000" },
                    { label: "Cordero con piel de lobo 750ml", price: "$13.000" },
                    { label: "Lola Torrontés 750ml", price: "$13.000" },
                    { label: "Puerta Alta Torrontés 750ml", price: "$13.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Vino Rosa",
                secondname: "Bodega Putruele 500ml",
                type: "Bebida",
                contents: "Vino rosado.",
                price: "$10.000",
                flags: [],
                options: [],
                category: "bebidas",
                subcategory: "Bebidas con alcohol",
                pieces: "",
                variants: [
                    { label: "Bodega Putruele 500ml", price: "$10.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Vino Malbec",
                secondname: "Malbicho 750ml / Aristides 750ml / Puerta Alta Malbec 750ml / Puerta Alta Malbec Reserva 750ml",
                type: "Bebida",
                contents: "Vinos Malbec.",
                price: "$12.000",
                flags: [],
                options: [],
                category: "bebidas",
                subcategory: "Bebidas con alcohol",
                pieces: "",
                variants: [
                    { label: "Malbicho 750ml", price: "$12.000" },
                    { label: "Aristides 750ml", price: "$15.000" },
                    { label: "Puerta Alta Malbec 750ml", price: "$17.000" },
                    { label: "Puerta Alta Malbec Reserva 750ml", price: "$20.000" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ============================================================
            // ========== POSTRES Y CAFÉ ==========
            // ============================================================
            {
                name: "Cheesecake japonés",
                secondname: "",
                type: "Postre",
                contents: "Cheesecake estilo japonés.",
                price: "$3.700",
                flags: [],
                options: [],
                category: "postres",
                subcategory: "Postres",
                pieces: "",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Brownie chocolate",
                secondname: "",
                type: "Postre",
                contents: "Brownie de chocolate.",
                price: "$3.000",
                flags: [],
                options: [],
                category: "postres",
                subcategory: "Postres",
                pieces: "",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Cookie vainilla & chips chocolate",
                secondname: "",
                type: "Postre",
                contents: "Cookie de vainilla con chips de chocolate.",
                price: "$2.500",
                flags: [],
                options: [],
                category: "postres",
                subcategory: "Postres",
                pieces: "",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Café",
                secondname: "",
                type: "Café",
                contents: "Café.",
                price: "$4.000",
                flags: [],
                options: [],
                category: "postres",
                subcategory: "Café",
                pieces: "",
                variants: [],
                whatsappLink: "https://wa.me/+541140587888"
            },

            // ============================================================
            // ========== SALSAS Y EXTRAS ==========
            // ============================================================
            {
                name: "Salsas",
                secondname: "Senda / Acevichada / Agridulce / Mayo spicy / Mango / Teriyaki / Maracuyá / Bs As",
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
                    { label: "Maracuyá", price: "$1.500" },
                    { label: "Bs As", price: "$1.500" }
                ],
                whatsappLink: "https://wa.me/+541140587888"
            },
            {
                name: "Extras",
                secondname: "Palitos chinos / Wasabi / Gari / Soja / Galleta de la fortuna",
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
                    { label: "Gari (gengibre)", price: "$1.500" },
                    { label: "Soja", price: "$1.500" },
                    { label: "Galleta de la fortuna", price: "$1.500" }
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
            const flags = [...new Set(
                menuItems.value.flatMap(item => item.flags || [])
            )];
            // Ordenar alfabéticamente para mostrarlas de forma consistente
            return flags.sort();
        });
        // const availableFlags = computed(() => {
        //     const flagsMap = {
        //         'Veggie': '🥬 Veggie',
        //         'Picante': '🌶️ Picante',
        //         'Tempura': '🍤 Tempura',
        //         'Empanado': '🍘 Empanado',
        //         'Sin TACC': '🌾 Sin TACC',
        //         'Opción Veggie': '🌱 Opción Veggie'
        //     };
            
        //     const flags = [...new Set(
        //         menuItems.value.flatMap(item => item.flags || [])
        //     )];
            
        //     return flags.filter(flag => flagsMap[flag]);
        // });

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

        // ========== REVIEWS ==========
        const reviews = ref([]);
        const reviewsLoaded = ref(false);
        const reviewPage = ref(0);
        const reviewsPerView = ref(1); 
         
        let reviewAutoplay = null;
        let reviewAutoplayResume = null;
        const reviewAutoplayInterval = 5000; // 5 segundos

        const updateReviewsPerView = () => {
            if (window.innerWidth >= 1024) reviewsPerView.value = 3;
            else if (window.innerWidth >= 640) reviewsPerView.value = 2;
            else reviewsPerView.value = 1;
            // Al cambiar el tamaño, reseteamos a la primera página
            reviewPage.value = 0;
        };

        // Solo reviews >= 4 estrellas
        const filteredReviews = computed(() => {
            return reviews.value.filter(r => r.starsNumber >= 4);
        });

        const averageRating = computed(() => {
            if (!filteredReviews.value.length) return 0;
            const total = filteredReviews.value.reduce((s, r) => s + r.starsNumber, 0);
            return total / filteredReviews.value.length;
        });

        // Agrupar las reviews en páginas de N cards
        const reviewPages = computed(() => {
            const perView = reviewsPerView.value;
            const pages = [];
            const list = filteredReviews.value;
            for (let i = 0; i < list.length; i += perView) {
                pages.push(list.slice(i, i + perView));
            }
            return pages;
        });

        const totalReviewPages = computed(() => reviewPages.value.length);

        // Dots inteligentes para mobile: siempre 5 como máximo (incluye flechas)
        // Muestra: [1] […] [actual] […] [última]
        const mobileDots = computed(() => {
            const total = totalReviewPages.value;
            const current = reviewPage.value;
            if (total <= 5) {
                // Si hay pocas páginas, mostrarlas todas
                return Array.from({ length: total }, (_, i) => ({
                    label: String(i + 1),
                    page: i,
                    active: i === current,
                    ellipsis: false
                }));
            }

            const dots = [];
            const first = 0;
            const last = total - 1;

            // Siempre mostramos la primera
            dots.push({
                label: '1',
                page: first,
                active: current === first,
                ellipsis: false
            });

            // Rango alrededor del actual
            let start = Math.max(1, current - 1);
            let end = Math.min(last - 1, current + 1);

            // Si estamos cerca del inicio
            if (current <= 1) {
                start = 1;
                end = 3;
            }
            // Si estamos cerca del final
            if (current >= last - 1) {
                start = last - 3;
                end = last - 1;
            }

            // Elipsis antes
            if (start > 1) {
                dots.push({ label: '…', page: null, active: false, ellipsis: true });
            }

            // Páginas del medio
            for (let i = start; i <= end; i++) {
                dots.push({
                    label: String(i + 1),
                    page: i,
                    active: i === current,
                    ellipsis: false
                });
            }

            // Elipsis después
            if (end < last - 1) {
                dots.push({ label: '…', page: null, active: false, ellipsis: true });
            }

            // Siempre mostramos la última
            dots.push({
                label: String(last + 1),
                page: last,
                active: current === last,
                ellipsis: false
            });

            return dots;
        });

        const nextReviewPage = () => {
            const max = totalReviewPages.value - 1;
            if (max < 0) return;
            reviewPage.value = reviewPage.value >= max ? 0 : reviewPage.value + 1;
            pauseReviewAutoplayTemporarily();
        };

        const prevReviewPage = () => {
            const max = totalReviewPages.value - 1;
            if (max < 0) return;
            reviewPage.value = reviewPage.value <= 0 ? max : reviewPage.value - 1;
            pauseReviewAutoplayTemporarily();
        };

        const goToReviewPage = (index) => {
            if (index === reviewPage.value) return;
            reviewPage.value = index;
            pauseReviewAutoplayTemporarily();
        };
        // ----- Autoplay del carrusel de reviews -----
        const stopReviewAutoplay = () => {
            if (reviewAutoplay) {
                clearInterval(reviewAutoplay);
                reviewAutoplay = null;
            }
        };

        let reviewAutoplayTicking = false;

        const startReviewAutoplay = () => {
            stopReviewAutoplay();
            if (totalReviewPages.value <= 1) return;
            reviewAutoplay = setInterval(() => {
                reviewAutoplayTicking = true;
                const max = totalReviewPages.value - 1;
                reviewPage.value = reviewPage.value >= max ? 0 : reviewPage.value + 1;
                reviewAutoplayTicking = false;
            }, reviewAutoplayInterval);
        };

        const pauseReviewAutoplayTemporarily = () => {
            if (reviewAutoplayTicking) return; // ignorar si viene del propio autoplay
            stopReviewAutoplay();
            if (reviewAutoplayResume) clearTimeout(reviewAutoplayResume);
            reviewAutoplayResume = setTimeout(() => {
                startReviewAutoplay();
            }, 8000);
        };

        const truncateText = (text, max) => {
            if (!text) return '';
            const clean = text.replace(/\s+/g, ' ').trim();
            if (clean.length <= max) return clean;
            return clean.slice(0, max).trim() + '…';
        };

        const loadReviews = async () => {
            try {
                if (window.SENDA_REVIEWS) {
                    reviews.value = window.SENDA_REVIEWS.reviews.map(r => ({
                        ...r,
                        starsNumber: parseInt((r.stars || '').replace(/\D/g, ''), 10) || 0
                    }));
                    reviewsLoaded.value = true;
                    updateReviewsPerView();
                    setTimeout(startReviewAutoplay, 300); // 👈 nuevo
                    return;
                }

                const res = await fetch('senda-sushi-reviews-full.json');
                if (!res.ok) throw new Error('No se pudo cargar el JSON');
                const data = await res.json();
                reviews.value = (data.reviews || []).map(r => ({
                    ...r,
                    starsNumber: parseInt((r.stars || '').replace(/\D/g, ''), 10) || 0
                }));
                reviewsLoaded.value = true;
                updateReviewsPerView();
                setTimeout(startReviewAutoplay, 300); // 👈 nuevo
            } catch (err) {
                console.error('Error cargando reviews:', err);
                reviewsLoaded.value = true;
            }
        };

        onMounted(() => {
            loadReviews();
            updateReviewsPerView();
            window.addEventListener('resize', updateReviewsPerView);

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

            // Arrancar autoplay de reviews cuando terminen de cargarse
            watch(totalReviewPages, (n) => {
                if (n > 1) {
                    startReviewAutoplay();
                } else {
                    stopReviewAutoplay();
                }
            });
        });

        onUnmounted(() => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }

            window.removeEventListener('resize', updateReviewsPerView);

            stopReviewAutoplay();
            if (reviewAutoplayResume) clearTimeout(reviewAutoplayResume);
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
            goToSlide, 

            // Reviews
            reviews,
            reviewsLoaded,
            reviewPage,
            reviewPages,
            totalReviewPages,
            filteredReviews,
            averageRating,
            nextReviewPage,
            prevReviewPage,
            goToReviewPage,
            truncateText,
            mobileDots,
            startReviewAutoplay,
            stopReviewAutoplay,
        };
    }
});

// Montar la aplicación
app.mount('#app');