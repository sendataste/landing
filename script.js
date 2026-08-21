// app.js
const { createApp, ref, watch, computed, onMounted, onUnmounted } = Vue;

const app = createApp({
    setup() {
        const scrolled = ref(false);

        // Menu UX state · Alternative 2
        const selectedCategory = ref('all');
        const menuSearch = ref('');
        const showFilterPanel = ref(false);
        const activeFeatureFilters = ref([]);
        const openAccordions = ref([]);
        const expandedCategories = ref([]);
        const selectedProduct = ref(null);

        watch(selectedProduct, (newVal, oldVal) => {
    console.log('🔄 selectedProduct cambió:');
    console.log('  Antes:', oldVal);
    console.log('  Ahora:', newVal);
    if (newVal !== null) {
        console.trace('📌 Stack trace de dónde se asignó:');
    }
}, { immediate: true, deep: true });

        const selectedOption = ref('');
        const selectedVariantLabel = ref('');

        const mobileMenuOpen = ref(false);
        const mobileMenuDropdownOpen = ref(false);
        const currentSlide = ref(0);
        let autoplayInterval = null;

        const menuCategories = ref([
            { id: 'entradas', name: 'Entradas', icon: '🥟' },
            { id: 'sushi', name: 'Sushi', icon: '🍣' },
            { id: 'cocina', name: 'Cocina', icon: '🍜' },
            { id: 'rolls', name: 'Rolls', icon: '🍱' },
            { id: 'combos', name: 'Combos', icon: '🎎' },
            { id: 'extras', name: 'Salsas y extras', icon: '🥢' }
        ]);

        const categories = ref([
            { id: 'all', name: 'Todo', icon: '●' },
            ...menuCategories.value
        ]);

        const carouselImages = ref([
            {
                src: 'assets/carrousel/16.59.36.jpeg',
                alt: 'SENDA Sushi - Imagen 1'
            },
            {
                src: 'assets/carrousel/17.13.13.jpeg',
                alt: 'SENDA Sushi - Imagen 2'
            },
            {
                src: 'assets/carrousel/17.13.56.jpeg',
                alt: 'SENDA Sushi - Imagen 3'
            },
            {
                src: 'assets/carrousel/17.14.31.jpeg',
                alt: 'SENDA Sushi - Imagen 4'
            },
            {
                src: 'assets/carrousel/17.17.27.jpeg',
                alt: 'SENDA Sushi - Imagen 5'
            }
        ]);

const menuItems = ref([
    // ========== ENTRADAS ==========
    {
        "name": "Harumakis x3",
        "secondname": "Carne o verdura",
        "type": "Entrada",
        "contents": "Harumakis de carne o verdura.",
        "price": "$8.000",
        "flags": [],
        "options": ["3 unidades"],
        "category": "entradas",
        "subcategory": "Entradas",
        "pieces": "3 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Gyozas x5",
        "secondname": "De cerdo",
        "type": "Entrada",
        "contents": "Gyozas rellenas de cerdo.",
        "price": "$11.000",
        "flags": [],
        "options": ["5 unidades"],
        "category": "entradas",
        "subcategory": "Entradas",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Langostino crunchy x6",
        "secondname": "Con guacamole",
        "type": "Entrada",
        "contents": "Langostinos crocantes acompañados de guacamole.",
        "price": "$13.000",
        "flags": ["Tempura"],
        "options": ["6 unidades"],
        "category": "entradas",
        "subcategory": "Entradas",
        "pieces": "6 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Tempura x5",
        "secondname": "Salmón con salsa Bs As",
        "type": "Entrada",
        "contents": "Salmón en tempura con salsa Bs As.",
        "price": "$14.000",
        "flags": ["Tempura"],
        "options": ["5 unidades"],
        "category": "entradas",
        "subcategory": "Entradas",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Tempura x5",
        "secondname": "Langostino con salsa teriyaki",
        "type": "Entrada",
        "contents": "Langostino en tempura con salsa teriyaki.",
        "price": "$14.000",
        "flags": ["Tempura"],
        "options": ["5 unidades"],
        "category": "entradas",
        "subcategory": "Entradas",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Colchón de arroz frito x4",
        "secondname": "Topping de tartar de salmón y salsa Senda",
        "type": "Entrada",
        "contents": "Colchón de arroz frito con topping de tartar de salmón y salsa Senda.",
        "price": "$14.000",
        "flags": [],
        "options": ["4 unidades"],
        "category": "entradas",
        "subcategory": "Entradas",
        "pieces": "4 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },

    // ========== SUSHI ==========
    {
        "name": "Sashimi x3",
        "secondname": "Salmón",
        "type": "Corte",
        "contents": "Cortes de salmón fresco.",
        "price": "$10.000",
        "flags": [],
        "options": ["3 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "3 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Sashimi x3",
        "secondname": "Atún rojo",
        "type": "Corte",
        "contents": "Cortes de atún rojo fresco.",
        "price": "$10.000",
        "flags": [],
        "options": ["3 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "3 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Sashimi x3",
        "secondname": "Pulpo",
        "type": "Corte",
        "contents": "Cortes de pulpo.",
        "price": "$10.000",
        "flags": [],
        "options": ["3 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "3 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Sashimi DELUXE",
        "secondname": "Salmón, atún, pulpo, flameado y langostino",
        "type": "Corte",
        "contents": "Selección deluxe de salmón, atún, pulpo, flameado y langostino.",
        "price": "$15.000",
        "flags": ["Flameado"],
        "options": ["3 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "3 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Nigiris x5",
        "secondname": "Atún rojo con ralladura de lima",
        "type": "Nigiri",
        "contents": "Atún rojo con ralladura de lima.",
        "price": "$12.000",
        "flags": [],
        "options": ["5 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Nigiris x5",
        "secondname": "Pulpo",
        "type": "Nigiri",
        "contents": "Nigiri de pulpo.",
        "price": "$12.000",
        "flags": [],
        "options": ["5 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Nigiris x5",
        "secondname": "Salmón",
        "type": "Nigiri",
        "contents": "Nigiri de salmón.",
        "price": "$12.000",
        "flags": [],
        "options": ["5 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Nigiris x5",
        "secondname": "Salmón flameado con salsa acevichada y batata frita",
        "type": "Nigiri",
        "contents": "Salmón flameado con salsa acevichada y batata frita.",
        "price": "$12.000",
        "flags": ["Flameado"],
        "options": ["5 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Nigiris x5",
        "secondname": "Salmón ahumado",
        "type": "Nigiri",
        "contents": "Nigiri de salmón ahumado.",
        "price": "$12.000",
        "flags": [],
        "options": ["5 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Nigiris x5",
        "secondname": "Langostino",
        "type": "Nigiri",
        "contents": "Nigiri de langostino.",
        "price": "$12.000",
        "flags": [],
        "options": ["5 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Nigiris x5",
        "secondname": "Palta flameada con salsa thai",
        "type": "Nigiri",
        "contents": "Palta flameada con salsa thai.",
        "price": "$12.000",
        "flags": ["Veggie", "Flameado"],
        "options": ["5 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Geishas",
        "secondname": "Atún rojo, palta, philadelphia y ciboulette",
        "type": "Geisha",
        "contents": "Atún rojo, palta, philadelphia y ciboulette.",
        "price": "$13.000",
        "flags": [],
        "options": ["5 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Geishas",
        "secondname": "Pulpo, palta con teriyaki flameado",
        "type": "Geisha",
        "contents": "Pulpo y palta con teriyaki flameado.",
        "price": "$13.000",
        "flags": ["Flameado"],
        "options": ["5 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Geishas",
        "secondname": "Salmón, palta y philadelphia",
        "type": "Geisha",
        "contents": "Salmón, palta y philadelphia.",
        "price": "$13.000",
        "flags": [],
        "options": ["5 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Geishas",
        "secondname": "Langostino crunchy, palta y philadelphia envuelto en salmón",
        "type": "Geisha",
        "contents": "Langostino crunchy, palta y philadelphia envuelto en salmón.",
        "price": "$13.000",
        "flags": ["Tempura"],
        "options": ["5 unidades"],
        "category": "sushi",
        "subcategory": "Cortes",
        "pieces": "5 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Tokyo",
        "secondname": "Salmón, palta, philadelphia, pepino con salsa teriyaki",
        "type": "Sushi Burrito",
        "contents": "Salmón, palta, philadelphia y pepino con salsa teriyaki.",
        "price": "$15.000",
        "flags": [],
        "options": ["1 unidad"],
        "category": "sushi",
        "subcategory": "Sushi Burrito",
        "pieces": "1 unidad",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Crunchy",
        "secondname": "Langostino apanado, kanikama y hongo cocinados, palta, ciboulette con salsa acevichada",
        "type": "Sushi Burrito",
        "contents": "Langostino apanado, kanikama y hongo cocinados, palta, ciboulette con salsa acevichada.",
        "price": "$15.000",
        "flags": ["Tempura"],
        "options": ["1 unidad"],
        "category": "sushi",
        "subcategory": "Sushi Burrito",
        "pieces": "1 unidad",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Veggie",
        "secondname": "Zanahoria, pepino, palta, huevo, philadelphia y sésamo tostado",
        "type": "Sushi Burrito",
        "contents": "Zanahoria, pepino, palta, huevo, philadelphia y sésamo tostado.",
        "price": "$15.000",
        "flags": ["Veggie"],
        "options": ["1 unidad"],
        "category": "sushi",
        "subcategory": "Sushi Burrito",
        "pieces": "1 unidad",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Temaki",
        "secondname": "Atún rojo, philadelphia picante, pepino y ciboulette",
        "type": "Temaki",
        "contents": "Atún rojo, philadelphia picante, pepino y ciboulette.",
        "price": "$10.000",
        "flags": ["Picante"],
        "options": ["1 unidad"],
        "category": "sushi",
        "subcategory": "Temaki",
        "pieces": "1 unidad",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Temaki",
        "secondname": "Salmón, philadelphia y palta",
        "type": "Temaki",
        "contents": "Salmón, philadelphia y palta.",
        "price": "$10.000",
        "flags": [],
        "options": ["1 unidad"],
        "category": "sushi",
        "subcategory": "Temaki",
        "pieces": "1 unidad",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Temaki",
        "secondname": "Pulpo, palta, pasta de ají amarillo con limón y cilantro",
        "type": "Temaki",
        "contents": "Pulpo, palta, pasta de ají amarillo con limón y cilantro.",
        "price": "$10.000",
        "flags": ["Picante"],
        "options": ["1 unidad"],
        "category": "sushi",
        "subcategory": "Temaki",
        "pieces": "1 unidad",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Tiradito",
        "secondname": "Salmón",
        "type": "Tiradito",
        "contents": "Salmón con jugo de lima y mango, pasta de ají amarillo y palta flameada.",
        "price": "$15.000",
        "flags": ["Flameado", "Picante"],
        "options": ["6 unidades"],
        "category": "sushi",
        "subcategory": "Tiradito",
        "pieces": "6 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Tiradito",
        "secondname": "Atún rojo",
        "type": "Tiradito",
        "contents": "Atún rojo en salsa de soja alimonada y miso, con láminas de pepino y ciboulette.",
        "price": "$17.000",
        "flags": [],
        "options": ["6 unidades"],
        "category": "sushi",
        "subcategory": "Tiradito",
        "pieces": "6 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Tiradito",
        "secondname": "Pulpo",
        "type": "Tiradito",
        "contents": "Pulpo con espuma de aceituna, limón y aceite de oliva.",
        "price": "$17.000",
        "flags": [],
        "options": ["6 unidades"],
        "category": "sushi",
        "subcategory": "Tiradito",
        "pieces": "6 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Ceviche",
        "secondname": "Salmón",
        "type": "Ceviche",
        "contents": "Cebolla morada en pluma, palta, ají dulce, jugo de limón, cilantro y lluvia de batatas fritas.",
        "price": "$17.000",
        "flags": [],
        "options": [],
        "category": "sushi",
        "subcategory": "Ceviche",
        "pieces": "",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Ceviche",
        "secondname": "Atún rojo",
        "type": "Ceviche",
        "contents": "Cebolla morada en pluma, boniato, palta, ají dulce, pepino y cilantro.",
        "price": "$17.000",
        "flags": [],
        "options": [],
        "category": "sushi",
        "subcategory": "Ceviche",
        "pieces": "",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Ceviche",
        "secondname": "Pulpo",
        "type": "Ceviche",
        "contents": "Cebolla morada en pluma, boniato, palta, ají dulce, pepino y cilantro.",
        "price": "$18.000",
        "flags": [],
        "options": [],
        "category": "sushi",
        "subcategory": "Ceviche",
        "pieces": "",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Tartar",
        "secondname": "Atún rojo",
        "type": "Tartar",
        "contents": "Colchón de palta y atún marinado, coronado con ciboulette.",
        "price": "$17.000",
        "flags": [],
        "options": [],
        "category": "sushi",
        "subcategory": "Tartar",
        "pieces": "",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Tartar",
        "secondname": "Salmón",
        "type": "Tartar",
        "contents": "Colchón de palta, salmón crudo y ahumado, ciboulette, coronado con ralladura de lima.",
        "price": "$17.000",
        "flags": [],
        "options": [],
        "category": "sushi",
        "subcategory": "Tartar",
        "pieces": "",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    // ✅ CORREGIDO: Tartar - Pulpo
    {
        "name": "Tartar",
        "secondname": "Pulpo",
        "type": "Tartar",
        "contents": "Colchón de palta, pulpo marinado en soja, pizca de sriracha, ciboulette, coronado con pepino.",
        "price": "$17.000",
        "flags": ["Picante"],
        "options": ["Picante"],
        "category": "sushi",
        "subcategory": "Tartar",
        "pieces": "Picante",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Sushi Bowl",
        "secondname": "Salmón",
        "type": "Sushi Bowl",
        "contents": "Arroz dulce, palta, philadelphia, salmón grille, ciboulette y salsa acevichada.",
        "price": "$18.000",
        "flags": [],
        "options": [],
        "category": "sushi",
        "subcategory": "Sushi Bowl",
        "pieces": "",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Sushi Bowl",
        "secondname": "Tropical",
        "type": "Sushi Bowl",
        "contents": "Arroz dulce, palta, philadelphia, salmón fresco, mango e hilos de batata frita.",
        "price": "$18.000",
        "flags": [],
        "options": [],
        "category": "sushi",
        "subcategory": "Sushi Bowl",
        "pieces": "",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    // ✅ CORREGIDO: Sushi Bowl - Langostino crunchy
    {
        "name": "Sushi Bowl",
        "secondname": "Langostino crunchy",
        "type": "Sushi Bowl",
        "contents": "Arroz dulce, palta, philadelphia, langostino crunchy, zanahoria tare y lluvia de batata frita.",
        "price": "$18.000",
        "flags": ["Tempura"],
        "options": ["Tempura"],
        "category": "sushi",
        "subcategory": "Sushi Bowl",
        "pieces": "Tempura",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Sushi Bowl",
        "secondname": "Atún rojo",
        "type": "Sushi Bowl",
        "contents": "Arroz dulce, palta, philadelphia, atún rojo, pepino y salsa de ostras.",
        "price": "$18.000",
        "flags": [],
        "options": [],
        "category": "sushi",
        "subcategory": "Sushi Bowl",
        "pieces": "",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    // ✅ CORREGIDO: Sushi Bowl - Vegetariano
    {
        "name": "Sushi Bowl",
        "secondname": "Vegetariano",
        "type": "Sushi Bowl",
        "contents": "Arroz dulce, palta, philadelphia, zanahoria tare, hongo rehogado en aceite de sésamo y arvejas.",
        "price": "$18.000",
        "flags": ["Veggie"],
        "options": ["Veggie"],
        "category": "sushi",
        "subcategory": "Sushi Bowl",
        "pieces": "Veggie",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },

    // ========== COCINA ==========
    {
        "name": "Wok",
        "secondname": "Pollo teriyaki",
        "type": "Wok",
        "contents": "Zanahoria, brote de soja, huevo, verdeo y salsa de soja.",
        "price": "$18.000",
        "flags": [],
        "options": [],
        "category": "cocina",
        "subcategory": "Wok",
        "pieces": "",
        "variants": [
            { "label": "Pollo teriyaki", "price": "$18.000" }
        ],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Wok",
        "secondname": "Langostinos",
        "type": "Wok",
        "contents": "Zanahoria, brote de soja, huevo, verdeo y salsa de soja.",
        "price": "$18.000",
        "flags": [],
        "options": [],
        "category": "cocina",
        "subcategory": "Wok",
        "pieces": "",
        "variants": [
            { "label": "Langostinos", "price": "$18.000" }
        ],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Wok",
        "secondname": "Salmón grille",
        "type": "Wok",
        "contents": "Zanahoria, brote de soja, huevo, verdeo y salsa de soja.",
        "price": "$18.000",
        "flags": [],
        "options": [],
        "category": "cocina",
        "subcategory": "Wok",
        "pieces": "",
        "variants": [
            { "label": "Salmón grille", "price": "$18.000" }
        ],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Wok",
        "secondname": "Vegetales",
        "type": "Wok",
        "contents": "Zanahoria, brote de soja, huevo, verdeo y salsa de soja.",
        "price": "$18.000",
        "flags": ["Veggie"],
        "options": [],
        "category": "cocina",
        "subcategory": "Wok",
        "pieces": "",
        "variants": [
            { "label": "Vegetales", "price": "$18.000" }
        ],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Wok",
        "secondname": "Lomo",
        "type": "Wok",
        "contents": "Zanahoria, brote de soja, huevo, verdeo y salsa de soja.",
        "price": "$18.000",
        "flags": [],
        "options": [],
        "category": "cocina",
        "subcategory": "Wok",
        "pieces": "",
        "variants": [
            { "label": "Lomo", "price": "$18.000" }
        ],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Wok",
        "secondname": "Mixto: salmón grille y langostinos",
        "type": "Wok",
        "contents": "Zanahoria, brote de soja, huevo, verdeo y salsa de soja.",
        "price": "$20.000",
        "flags": [],
        "options": [],
        "category": "cocina",
        "subcategory": "Wok",
        "pieces": "",
        "variants": [
            { "label": "Mixto: salmón grille y langostinos", "price": "$20.000" }
        ],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Lomo salteado",
        "secondname": "",
        "type": "Cocina",
        "contents": "Lomo salteado con cebolla morada, morrón rojo y amarillo, y cilantro, sobre un colchón de arroz blanco con aceite de sésamo.",
        "price": "$20.000",
        "flags": [],
        "options": [],
        "category": "cocina",
        "subcategory": "Lomo salteado",
        "pieces": "",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Chow Fan",
        "secondname": "Pollo",
        "type": "Chow Fan",
        "contents": "Arroz sofrito, huevo, zanahoria, arvejas y verdeo.",
        "price": "$18.000",
        "flags": [],
        "options": [],
        "category": "cocina",
        "subcategory": "Chow Fan",
        "pieces": "",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    // ✅ CORREGIDO: Chow Fan - Vegetales
    {
        "name": "Chow Fan",
        "secondname": "Vegetales + 2 harumakis (carne o verdura)",
        "type": "Chow Fan",
        "contents": "Arroz sofrito, huevo, zanahoria, arvejas y verdeo, acompañado de 2 harumakis.",
        "price": "$18.000",
        "flags": ["Veggie"],
        "options": ["Veggie"],
        "category": "cocina",
        "subcategory": "Chow Fan",
        "pieces": "Veggie",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Cerdo Tonkatsu",
        "secondname": "",
        "type": "Cocina",
        "contents": "Apanado en panko, frito con salsa tonkatsu y arroz blanco.",
        "price": "$18.000",
        "flags": ["Tempura"],
        "options": [],
        "category": "cocina",
        "subcategory": "Cerdo Tonkatsu",
        "pieces": "",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    // ✅ CORREGIDO: Hot Dog - Salmón
    {
        "name": "Hot Dog",
        "secondname": "Salmón",
        "type": "Hot Dog",
        "contents": "Roll de arroz en panko, frito, relleno de palta y philadelphia. Fresco o grille, con lluvia de ciboulette.",
        "price": "$15.000",
        "flags": ["Tempura"],
        "options": ["Tempura"],
        "category": "cocina",
        "subcategory": "Hot Dog",
        "pieces": "Tempura",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    // ✅ CORREGIDO: Hot Dog - Langostino crunchy
    {
        "name": "Hot Dog",
        "secondname": "Langostino crunchy",
        "type": "Hot Dog",
        "contents": "Roll de arroz en panko, frito, relleno de palta y philadelphia, con lluvia de batata frita.",
        "price": "$15.000",
        "flags": ["Tempura"],
        "options": ["Tempura"],
        "category": "cocina",
        "subcategory": "Hot Dog",
        "pieces": "Tempura",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    // ✅ CORREGIDO: Hot Dog - Atún rojo
    {
        "name": "Hot Dog",
        "secondname": "Atún rojo",
        "type": "Hot Dog",
        "contents": "Roll de arroz en panko, frito, relleno de palta y philadelphia, con lluvia de pepino dulce.",
        "price": "$15.000",
        "flags": ["Tempura"],
        "options": ["Tempura"],
        "category": "cocina",
        "subcategory": "Hot Dog",
        "pieces": "Tempura",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    // ✅ CORREGIDO: Hot Dog - Kani
    {
        "name": "Hot Dog",
        "secondname": "Kani",
        "type": "Hot Dog",
        "contents": "Kanikama, champignon sofrito, salsa spicy y lluvia de batata frita.",
        "price": "$15.000",
        "flags": ["Tempura", "Picante"],
        "options": ["Tempura", "Picante"],
        "category": "cocina",
        "subcategory": "Hot Dog",
        "pieces": "Tempura, Picante",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Baos",
        "secondname": "Pulled Pork occidental",
        "type": "Bao",
        "contents": "Bondiola de cerdo desmenuzada, braseada con soja, verduras, con rodajas de pepino encurtido.",
        "price": "$16.000",
        "flags": [],
        "options": ["2 unidades"],
        "category": "cocina",
        "subcategory": "Baos",
        "pieces": "2 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Baos",
        "secondname": "Lango fusion",
        "type": "Bao",
        "contents": "Langostinos y champignon a la plancha con aceite de sésamo, con finas rodajas de rabanito.",
        "price": "$16.000",
        "flags": [],
        "options": ["2 unidades"],
        "category": "cocina",
        "subcategory": "Baos",
        "pieces": "2 unidades",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },

    // ========== ROLLS ==========
    {
        "name": "New York",
        "secondname": "Salmón y palta",
        "type": "Roll clásico",
        "contents": "Salmón y palta.",
        "price": "$8.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll clásicos",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "New York phila",
        "secondname": "Salmón, palta y philadelphia",
        "type": "Roll clásico",
        "contents": "Salmón, palta y philadelphia.",
        "price": "$8.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll clásicos",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Lango cheese",
        "secondname": "Langostino y philadelphia con sésamo",
        "type": "Roll clásico",
        "contents": "Langostino y philadelphia con sésamo.",
        "price": "$8.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll clásicos",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Salmón grille",
        "secondname": "Salmón grille con cobertura de palta",
        "type": "Roll clásico",
        "contents": "Salmón grille con cobertura de palta.",
        "price": "$8.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll clásicos",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Avocado tuna",
        "secondname": "Atún, verdeo, jugo de limón, con cobertura de palta",
        "type": "Roll clásico",
        "contents": "Atún, verdeo, jugo de limón, con cobertura de palta.",
        "price": "$8.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll clásicos",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Spicy tuna",
        "secondname": "Atún, verdeo, jugo de limón, con cobertura de palta y salsa spicy",
        "type": "Roll clásico",
        "contents": "Atún, verdeo, jugo de limón, con cobertura de palta y salsa spicy.",
        "price": "$8.500",
        "flags": ["Picante"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll clásicos",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Zen",
        "secondname": "Zanahoria tare, philadelphia, con cobertura de palta flameada en salsa thai",
        "type": "Roll veggie",
        "contents": "Zanahoria tare, philadelphia, con cobertura de palta flameada en salsa thai.",
        "price": "$8.500",
        "flags": ["Veggie", "Flameado"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll veggie",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Praga",
        "secondname": "Palta, philadelphia, cobertura de mango, salsa mango y lluvia de batata",
        "type": "Roll veggie",
        "contents": "Palta, philadelphia, cobertura de mango, salsa mango y lluvia de batata.",
        "price": "$8.500",
        "flags": ["Veggie"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll veggie",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Wasabi",
        "secondname": "Tomate asado, philadelphia, ciboulette, cobertura de palta y mayo wasabi",
        "type": "Roll veggie",
        "contents": "Tomate asado, philadelphia, ciboulette, cobertura de palta y mayo wasabi.",
        "price": "$8.500",
        "flags": ["Veggie"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll veggie",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Cheese",
        "secondname": "Salmón, philadelphia, verdeo",
        "type": "Tamago Roll",
        "contents": "Salmón, philadelphia y verdeo. Sin arroz ni alga; roll envuelto en huevo dulce.",
        "price": "$9.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Tamago Roll",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Sweet palmi",
        "secondname": "Salmón, palmito, mango, con lluvia de almendras y salsa teriyaki",
        "type": "Tamago Roll",
        "contents": "Salmón, palmito, mango, lluvia de almendras y salsa teriyaki. Sin arroz ni alga; roll envuelto en huevo dulce.",
        "price": "$9.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Tamago Roll",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "chill",
        "secondname": "Atún rojo, philadelphia picante y tira de pepino",
        "type": "Tamago Roll",
        "contents": "Atún rojo, philadelphia picante y tira de pepino. Sin arroz ni alga; roll envuelto en huevo dulce.",
        "price": "$9.500",
        "flags": ["Picante"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Tamago Roll",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Senda",
        "secondname": "Langostino, palta, philadelphia, con cobertura de salmón y salsa teriyaki",
        "type": "Roll premium",
        "contents": "Langostino, palta, philadelphia, con cobertura de salmón y salsa teriyaki",
        "price": "$9.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll premium",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Amai",
        "secondname": "Langostino crunchy, philadelphia, cobertura de salmón y salsa acevichada",
        "type": "Roll premium",
        "contents": "Langostino crunchy, philadelphia, cobertura de salmón y salsa acevichada",
        "price": "$9.500",
        "flags": ["Tempura"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll premium",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Flameado",
        "secondname": "Langostino, philadelphia, con cobertura de salmón flameado con mayo wasabi",
        "type": "Roll premium",
        "contents": "Langostino, philadelphia, con cobertura de salmón flameado con mayo wasabi",
        "price": "$9.500",
        "flags": ["Flameado"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll premium",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Tori",
        "secondname": "Salmón, philadelphia con lluvia de verdeo",
        "type": "Roll premium",
        "contents": "Salmón, philadelphia con lluvia de verdeo",
        "price": "$9.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll premium",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Umi",
        "secondname": "Salmón, philadelphia con cobertura de mango, salsa teriyaki y almendras picadas",
        "type": "Roll premium",
        "contents": "Salmón, philadelphia con cobertura de mango, salsa teriyaki y almendras picadas",
        "price": "$9.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll premium",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Crunchy",
        "secondname": "Salmón crunchy, palta con salsa acevichada y lluvia de batata frita",
        "type": "Roll premium",
        "contents": "Salmón crunchy, palta con salsa acevichada y lluvia de batata frita",
        "price": "$9.500",
        "flags": ["Tempura"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll premium",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Nach",
        "secondname": "Salmón, palta coronado de salsa curry y diamante de langostino",
        "type": "Roll premium",
        "contents": "Salmón, palta coronado de salsa curry y diamante de langostino",
        "price": "$9.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll premium",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Palmi",
        "secondname": "Salmón, palmito, envuelto en palta",
        "type": "Roll premium",
        "contents": "Salmón, palmito, envuelto en palta",
        "price": "$9.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll premium",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Tataki",
        "secondname": "Hongo, philadelphia, coronado con kanikama spicy",
        "type": "Roll premium",
        "contents": "Hongo, philadelphia, coronado con kanikama spicy",
        "price": "$9.500",
        "flags": ["Picante"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll premium",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Ahumado",
        "secondname": "Palta, pepino con cobertura de salmón ahumado",
        "type": "Roll supreme",
        "contents": "Palta, pepino con cobertura de salmón ahumado",
        "price": "$10.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll supreme",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Acevichado",
        "secondname": "Langostino tempura, palta, con topping de pulpo en salsa acevichada",
        "type": "Roll supreme",
        "contents": "Langostino tempura, palta, con topping de pulpo en salsa acevichada",
        "price": "$10.500",
        "flags": ["Tempura"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll supreme",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Caviar",
        "secondname": "Philadelphia, palta con topping de tartar de salmón y caviar",
        "type": "Roll supreme",
        "contents": "Philadelphia, palta con topping de tartar de salmón y caviar",
        "price": "$10.500",
        "flags": [],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll supreme",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Octopus",
        "secondname": "Pulpo, con cobertura de palta flameada con salsa thai y teriyaki",
        "type": "Roll supreme",
        "contents": "Pulpo, con cobertura de palta flameada con salsa thai y teriyaki",
        "price": "$10.500",
        "flags": ["Flameado"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll supreme",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Red hot",
        "secondname": "Palta, boniato, con topping spicy de tartar de atún",
        "type": "Roll supreme",
        "contents": "Palta, boniato, con topping spicy de tartar de atún",
        "price": "$10.500",
        "flags": ["Picante"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll supreme",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Golden",
        "secondname": "Langostino, palta, cubierto de salmón flameado, jalapeño en tempura y caviar",
        "type": "Roll supreme",
        "contents": "Langostino, palta, cubierto de salmón flameado, jalapeño en tempura y caviar",
        "price": "$10.500",
        "flags": ["Flameado", "Tempura", "Picante"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Roll supreme",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Mystic",
        "secondname": "Salmón crunchy con philadelphia",
        "type": "Hot Roll",
        "contents": "Roll relleno, apanado en panko frito.",
        "price": "$10.000",
        "flags": ["Tempura"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Hot Roll",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Tokio",
        "secondname": "Langostino, palta y philadelphia",
        "type": "Hot Roll",
        "contents": "Roll relleno, apanado en panko frito.",
        "price": "$10.000",
        "flags": ["Tempura"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Hot Roll",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Mex",
        "secondname": "Kanikama, philadelphia con topping de guacamole",
        "type": "Hot Roll",
        "contents": "Roll relleno, apanado en panko frito.",
        "price": "$10.000",
        "flags": ["Tempura"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Hot Roll",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Azteca",
        "secondname": "Tiras de salmón, salmón ahumado, philadelphia con topping guacamole y maíz cancha",
        "type": "Hot Roll sin arroz",
        "contents": "Apanado en panko, frito.",
        "price": "$10.000",
        "flags": ["Tempura", "Sin arroz"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Hot Roll sin arroz",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Bs As",
        "secondname": "Tiras de salmón, palta, philadelphia, coronado con ciboulette y salsa de ostras",
        "type": "Hot Roll sin arroz",
        "contents": "Apanado en panko, frito.",
        "price": "$10.000",
        "flags": ["Tempura", "Sin arroz"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Hot Roll sin arroz",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Italia",
        "secondname": "Tiras de salmón ahumado, muzzarella, albahaca, coronado de tomate asado",
        "type": "Hot Roll sin arroz",
        "contents": "Apanado en panko, frito.",
        "price": "$10.000",
        "flags": ["Tempura", "Sin arroz"],
        "options": ["5 piezas"],
        "category": "rolls",
        "subcategory": "Hot Roll sin arroz",
        "pieces": "5 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },

    // ========== COMBOS ==========
    {
        "name": "Camino simple x 15",
        "secondname": "",
        "type": "Combo",
        "contents": "2 Nigiris lango, 5 lango cheese, 4 california, 4 tuna spicy.",
        "price": "$23.000",
        "flags": ["Picante"],
        "options": ["15 piezas"],
        "category": "combos",
        "subcategory": "Combos",
        "pieces": "15 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Camino simple x 30",
        "secondname": "",
        "type": "Combo",
        "contents": "4 Nigiri lango, 2 nigiri salmón, 5 california, 5 zen, 5 lango cheese, 5 avocado tuna y 5 makis grille.",
        "price": "$43.000",
        "flags": ["Veggie"],
        "options": ["30 piezas"],
        "category": "combos",
        "subcategory": "Combos",
        "pieces": "30 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Doble paso x 15",
        "secondname": "",
        "type": "Combo",
        "contents": "2 Nigiri salmón, 3 geishas, 5 New York phila, 4 Umi, 2 Maki.",
        "price": "$26.000",
        "flags": [],
        "options": ["15 piezas"],
        "category": "combos",
        "subcategory": "Combos",
        "pieces": "15 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Doble paso x 30",
        "secondname": "",
        "type": "Combo",
        "contents": "2 Nigiri salmón, 3 geishas, 5 senda, 5 New York phila, 5 New York, 5 maki, 5 hot mystic.",
        "price": "$54.000",
        "flags": ["Tempura"],
        "options": ["30 piezas"],
        "category": "combos",
        "subcategory": "Combos",
        "pieces": "30 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Gran paso x15",
        "secondname": "",
        "type": "Combo",
        "contents": "2 Nigiris salmón ahumado, 5 tori, 5 octopus, 3 maki de atún rojo.",
        "price": "$29.000",
        "flags": [],
        "options": ["15 piezas"],
        "category": "combos",
        "subcategory": "Combos",
        "pieces": "15 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Gran paso x30",
        "secondname": "",
        "type": "Combo",
        "contents": "2 Nigiris salmón, 3 geishas, 5 tori, 5 octopus, 5 maki atún rojo, 5 golden, 5 New York phila.",
        "price": "$56.000",
        "flags": ["Flameado", "Tempura"],
        "options": ["30 piezas"],
        "category": "combos",
        "subcategory": "Combos",
        "pieces": "30 piezas",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },

    // ========== EXTRAS ==========
    {
        "name": "Senda",
        "secondname": "",
        "type": "Salsa",
        "contents": "Salsa Senda.",
        "price": "$1.500",
        "flags": [],
        "options": ["1 porción"],
        "category": "extras",
        "subcategory": "Salsas",
        "pieces": "1 porción",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Acevichada",
        "secondname": "",
        "type": "Salsa",
        "contents": "Salsa Senda.",
        "price": "$1.500",
        "flags": [],
        "options": ["1 porción"],
        "category": "extras",
        "subcategory": "Salsas",
        "pieces": "1 porción",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Agridulce",
        "secondname": "",
        "type": "Salsa",
        "contents": "Salsa Senda.",
        "price": "$1.500",
        "flags": [],
        "options": ["1 porción"],
        "category": "extras",
        "subcategory": "Salsas",
        "pieces": "1 porción",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Mayo spicy",
        "secondname": "",
        "type": "Salsa",
        "contents": "Salsa Senda.",
        "price": "$1.500",
        "flags": ["Picante"],
        "options": ["1 porción"],
        "category": "extras",
        "subcategory": "Salsas",
        "pieces": "1 porción",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Mango",
        "secondname": "",
        "type": "Salsa",
        "contents": "Salsa Senda.",
        "price": "$1.500",
        "flags": [],
        "options": ["1 porción"],
        "category": "extras",
        "subcategory": "Salsas",
        "pieces": "1 porción",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Teriyaki",
        "secondname": "",
        "type": "Salsa",
        "contents": "Salsa Senda.",
        "price": "$1.500",
        "flags": [],
        "options": ["1 porción"],
        "category": "extras",
        "subcategory": "Salsas",
        "pieces": "1 porción",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Bs As",
        "secondname": "",
        "type": "Salsa",
        "contents": "Salsa Senda.",
        "price": "$1.500",
        "flags": [],
        "options": ["1 porción"],
        "category": "extras",
        "subcategory": "Salsas",
        "pieces": "1 porción",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Palitos chinos",
        "secondname": "",
        "type": "Extra",
        "contents": "Extra para acompañar el pedido.",
        "price": "$1.500",
        "flags": [],
        "options": ["1 unidad"],
        "category": "extras",
        "subcategory": "Extras",
        "pieces": "1 unidad",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Wasabi",
        "secondname": "",
        "type": "Extra",
        "contents": "Extra para acompañar el pedido.",
        "price": "$1.500",
        "flags": [],
        "options": ["1 unidad"],
        "category": "extras",
        "subcategory": "Extras",
        "pieces": "1 unidad",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
    },
    {
        "name": "Gari (jengibre)",
        "secondname": "",
        "type": "Extra",
        "contents": "Extra para acompañar el pedido.",
        "price": "$1.500",
        "flags": [],
        "options": ["1 unidad"],
        "category": "extras",
        "subcategory": "Extras",
        "pieces": "1 unidad",
        "variants": [],
        "whatsappLink": "https://wa.me/+541140587888"
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

        const availableFlags = computed(() => {
            const priority = [
                'Veggie',
                'Picante',
                'Tempura',
                'Flameado',
                'Sin arroz'
            ];

            const flags = [...new Set(
                menuItems.value.flatMap(item => item.flags || [])
            )];

            return priority.filter(flag => flags.includes(flag));
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

            const searchMatches =
                !normalizedSearch.value ||
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
                const shouldShowAll =
                    !!normalizedSearch.value ||
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
            return selectedProduct.value.variants.find(v => v.label === selectedVariantLabel.value)
                || selectedProduct.value.variants[0];
        });

        const selectedProductPrice = computed(() =>
            selectedVariant.value?.price || selectedProduct.value?.price || ''
        );

        const productWhatsappLink = computed(() => {
            if (!selectedProduct.value) return '#';

            const option = selectedVariant.value
                ? ` - ${selectedVariant.value.label}`
                : (selectedOption.value ? ` - ${selectedOption.value}` : '');

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
                // One open category at a time for a cleaner mobile-first experience.
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

            // When filtering, open the first matching category.
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
    // Validar que item sea un objeto válido
    if (!item || typeof item !== 'object' || !item.name) {
        console.warn('⚠️ openProduct recibió un item inválido:', item);
        return;
    }
    
    console.log('✅ Abriendo producto:', item.name);
    selectedProduct.value = item;
    selectedOption.value = item.options && item.options.length ? item.options[0] : '';
    selectedVariantLabel.value = item.variants && item.variants.length ? item.variants[0].label : '';
    document.body.classList.add('menu-lock-scroll');
};
        const closeProduct = () => {
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
                menuSection.scrollIntoView({ behavior: 'smooth' });
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
            
            window.addEventListener('scroll', () => {
                scrolled.value = window.scrollY > 50;
            });
            startAutoplay();
            
            // FORZAR que selectedProduct sea null al cargar
            selectedProduct.value = null;
            console.log('✅ Forzado selectedProduct a null:', selectedProduct.value);
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