// Dependencies: express
const express = require('express');
const logger = require('./middleware/logger');
const requestTime = require('./middleware/request-time');
const { routes } = require('./routes/api');

// Initialize express
const app = express();

// Custom middlewares
app.use(logger);
app.use(requestTime);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API endpoints
routes.forEach(route => {
    app.use(`/api/${route}`, require(`./routes/api/endpoints.js`));
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));