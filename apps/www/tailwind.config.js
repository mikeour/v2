/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            // Disable typography plugin's default styles to use base layer styles
            color: null,
            a: {
              color: null,
              textDecoration: null,
              fontWeight: null,
            },
            strong: {
              color: null,
            },
            img: {
              marginTop: null,
              marginBottom: null,
            },
            picture: {
              marginTop: null,
              marginBottom: null,
            },
          },
        },
      },
    },
  },
};
