import express from "express";
import rotas from "./rotas.js";

const app = express();
const port = process.env.PORT || 3000;

app 
    .use(express.json())
    .use('/contato', rotas)

app.listen(port, () => {
    console.log(`Escutando a porta ${port}`);
});

export default app;