import express from 'express';

const app = express();
const PORT = 5000;

app.use(express.json());


let items = [];
let nextId = 1;


app.post('/items', (req, res) => {
    const { name, quantity, type } = req.body;


    if (!name || quantity === undefined || !type) {
        return res.status(422).json({ error: 'Nome, quantidade e tipo são obrigatórios' });
    }
    
    // Validar se quantity é um número inteiro
    if (!Number.isInteger(quantity)) {
        return res.status(422).json({ error: 'Quantidade deve ser um número inteiro' });
    }
    
    // Verificar se já existe um item com o mesmo nome
    const existingItem = items.find(item => item.name === name);
    if (existingItem) {
        return res.status(409).json({ error: 'Item com este nome já existe' });
    }
    
    // Criar novo item
    const newItem = {
        id: nextId++,
        name,
        quantity,
        type
    };

    items.push(newItem);
    res.status(201).json(newItem);
});


app.get('/items', (req, res) => {
    const { type } = req.query;
    
    if (type) {
        const filteredItems = items.filter(item => {
            return item.type.toLowerCase().includes(type.toLowerCase());
        })
        return res.send(filteredItems);
    }
    
    res.send(items);
});

app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID deve ser um número inteiro positivo' });
    }
    
    
    const item = items.find(item => item.id === id);
    
    if (!item) {
        return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json(item);
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
