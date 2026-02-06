require('dotenv').config();
const app = require('./app');
app.use('/api', require('./routes'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
