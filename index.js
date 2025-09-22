require('dotenv').config({ path: '.inv' });
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const miscRoutes = require('./routes/miscRoutes');
const aiRoutes = require('./backend/routes/ai');
const aiFoodAnalysisRoutes = require('./backend/routes/ai-food-analysis');

app.use('/api/users', userRoutes);
app.use('/api', miscRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai', aiFoodAnalysisRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the SafeBit REST API!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://192.168.100.128:${PORT}`);
});
