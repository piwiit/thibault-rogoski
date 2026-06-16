import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./public/**/*.svg"
    ],
    theme: {
        extend: {
            colors: {
                // 🎯 Palette principale
                primary: {
                    DEFAULT: '#FFD33A', // Jaune doré (éléments clés, CTA, icônes)
                    light: '#FFE066',   // Variante claire (hover, survols)
                    dark: '#E6C02E',    // Variante plus ocre (titres secondaires)
                },
                neutral: {
                    50: '#FFFFFF',      // Blanc pur (texte sur fond sombre)
                    100: '#F5F5F5',     // Gris très clair
                    200: '#E0E0E0',     // Gris clair
                    700: '#2A2A2A',     // Gris anthracite (zones neutres)
                    900: '#111111',     // Noir profond (fond principal)
                },

                // ⚙️ Couleurs fonctionnelles
                success: '#9ACD32',   // Vert olive (états validés)
                warning: '#FFB400',   // Jaune signal (attention)
                error: '#E63946',     // Rouge terre cuite (erreur)
            },
        },
    },
};

export default config;

