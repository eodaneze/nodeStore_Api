const express = require('express');

const app = express();

app.use(express.json());

const PORT = 9000;

app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);
})