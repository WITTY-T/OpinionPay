// Production configuration for OpinionPay
console.log('🔧 Loading app configuration...');

const CONFIG = {
  // Use your Render backend URL
  API_BASE_URL: 'https://opinionpay.onrender.com',
  ENVIRONMENT: 'production'
};

// Make it globally available
window.APP_CONFIG = CONFIG;
console.log('🚀 App configured for:', CONFIG.API_BASE_URL);