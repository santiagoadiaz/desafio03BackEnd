import fs from 'fs';

export default class ProductManager {
    constructor() {
        this.pathProducts = './JSON/products.json';
    }
    generateId() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < 10; i++) {
            id += chars[Math.floor(Math.random() * chars.length)];
        }
        return id;
    }
    async getProducts() {
        try {
            if (fs.existsSync(this.pathProducts)) {
                const productsJSON = await fs.promises.readFile(this.pathProducts, 'utf-8');
                const products = JSON.parse(productsJSON);
                return products
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }
    async createProducts(product) {
        try {
            const productsFile = await this.getProducts();
            let findCode = await this.repeatedCode(product.code, productsFile)
            if (findCode) {
                console.log("ya existe un producto con este code")
            } else {
                product.id = this.generateId(),
                    productsFile.push(product);
                await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));
            }
        } catch (error) {
            console.log(error);
        }
    }
    async repeatedCode(code, productsFile) {
        try {
            const findCode = productsFile.find((prodIterated) => prodIterated.code === code);
            return findCode
        } catch (error) {
            console.log(error)
        }
    }
    async upDateProduct(id, upDateKey, upDateValue) {
        try {
            if (upDateKey === 'name' || upDateKey === 'price' || upDateKey === 'description' || upDateKey === 'thumbnail' || upDateKey === 'code' || upDateKey === 'stock') {
                let productsFile = await this.getProducts();
                let productFind = await this.findProductById(id, this.getProducts());
                productsFile = productsFile.filter((product) => product.id !== id);
                productFind[upDateKey] = upDateValue
                productsFile.push(productFind)
                await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));
            } else {
                console.log('Error: upDateKey debe ser una propieda valida');
            }
        } catch (error) {
            console.log(error);
        }
    }
    async deleteProduct(id) {
        const productFind = await this.findProductById(id, this.getProducts())
        let productsFile = await this.getProducts();
        if (productFind === null) {
            console.log("El producto que intentas eliminar no existe")
        } else {
            productsFile = productsFile.filter((product) => product.id !== productFind.id);
            await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));
        }
    }
    async deleteAll(path) {
        try {
            if (fs.existsSync(path)) {
                await fs.promises.unlink(path)
            }
        } catch (error) {
            console.log(error);
        }
    }
    async findProductById(searchedId) {
        try {
            const products = await this.getProducts();
            const find = products.find((prodIterated) => prodIterated.id === searchedId);
            if (find) {
                return find;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error)
        }
    }
}



