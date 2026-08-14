const API_BASE = process.env.NODE_ENV === 'development' 
  ? '' 
  : (process.env.REACT_APP_API_URL || 'https://easycart-new.onrender.com');

export default API_BASE;


