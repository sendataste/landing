// config.js
// ============================================================
// CONFIGURACIÓN GLOBAL - SENDA SUSHI
// ============================================================

// Número de teléfono (formato internacional sin +, espacios ni guiones)
// Ejemplo: 5491161123904  (54 = Argentina, 9 = móvil, 11 = Buenos Aires, resto = número)
window.SENDA_CONFIG = {
    // Número para wa.me (sin +, sin espacios)
    whatsappNumber: '5491161123904',

    // Número formateado para mostrar en el sitio
    whatsappDisplay: '+54 9 11 6112 3904 ',

    // Links de redes sociales
    socialLinks: {
        instagram: 'https://www.instagram.com/sendasushi',
        facebook: 'https://www.facebook.com/share/1EiV5XMfN6/'
    },

    // Link de Google Maps
    googleMapsLink: 'https://www.google.com/maps/place/Senda+Sushi/@-34.5886408,-58.508417,17z'
};

// Helper global para generar links de WhatsApp
window.SENDA_CONFIG.getWhatsappLink = function(text) {
    const base = `https://wa.me/${this.whatsappNumber}`;
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};