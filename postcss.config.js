module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Add cssnano for production optimization (minification)
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
