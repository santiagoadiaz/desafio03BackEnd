import express from 'express';
import ProductManager from './2daEntrega.js'

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productsManager = new ProductManager()

app.get('/products', async (req, res) => {
    try {
        const productsFile = await productsManager.getProducts()
        const limit = req.query.limit ? parseInt(req.query.limit) : 0;
        if (limit > 0) {
            const limitedProducts = productsFile.slice(0, limit);
            const remainingProducts = productsFile.slice(limit);
            res.status(200).json({ limitedProducts, remainingProducts })
        } else {
            res.status(200).json(productsFile)
        }
    } catch (error) {
        res.status(404).json({ error })
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productFound = await productsManager.findProductById(id)
        if (productFound) {
            res.status(200).json({ productFound })
        } else {
            res.status(404).send('product not found')
        }
    } catch (error) {
        res.status(404).json({ error })
    }
});

app.post('/products', async (req, res) => {
    try {
        const product = req.body
        const addedProduct = await productsManager.createProducts(product)
        res.status(200).json(addedProduct)
    } catch (error) {
        res.status(404).json({ error })
    }
});

app.listen(port, () => {
    console.log("server ok in", port + " port")
});