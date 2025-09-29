module.exports = (req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Permitir origens locais para desenvolvimento e produção
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];
  
  // Adicionar URL do frontend da variável de ambiente
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  
  if (isDevelopment) {
    res.header("Access-Control-Allow-Origin", "*");
  } else {
    // Em produção, verificar se a origem está na lista permitida
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    } else {
      // Fallback para a URL configurada no ambiente
      const allowedOrigin = process.env.FRONTEND_URL;
      res.header("Access-Control-Allow-Origin", allowedOrigin);
    }
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true"); 

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
};
