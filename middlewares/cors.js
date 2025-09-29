module.exports = (req, res, next) => {
  const environment = process.env.NODE_ENV;
  const frontendUrl = process.env.FRONTEND_URL;
  const requestOrigin = req.headers.origin;

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  if (environment === 'production') {
    if (frontendUrl && requestOrigin === frontendUrl) {
      res.header("Access-Control-Allow-Origin", frontendUrl);
    }
    setDefaultHeaders(res);
    return next();
  }

  if (environment === 'staging') {
    const stagingOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ];
    
    if (frontendUrl) {
      stagingOrigins.push(frontendUrl);
    }
    
    if (stagingOrigins.includes(requestOrigin)) {
      res.header("Access-Control-Allow-Origin", requestOrigin);
    }
    setDefaultHeaders(res);
    return next();
  }


  setDefaultHeaders(res);
  next();
};

function setDefaultHeaders(res) {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
}