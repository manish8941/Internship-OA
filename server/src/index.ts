import { app, bootstrap } from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

bootstrap()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✨ Agentic Dating Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
