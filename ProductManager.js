import fs from "fs";
import express from "express";

const app = express();

class ProductManager {
  constructor(path) {
    this.path = path;
    this.format = "utf-8";
  }
  //agregar prod
  addProduct = async (title, description, price, code, stock) => {
    const products = await this.getProduct();
    const newProduct = {
      id: this.generateId(products),
      title,
      description,
      price,
      code,
      stock,
    };
    products.push(newProduct);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
    return newProduct;
  };
  generateId = (products) => {
    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
  };

  //obt todos los prod
  getProduct = async () => {
    return JSON.parse(await fs.promises.readFile(this.path, this.format));
  };

  //obt los prod por ID
  getProductById = async (id) => {
    const products = await this.getProduct();
    return products.find((product) => product.id === id);
  };

  //borrar prod por id
  deleteProductById = async (id) => {
    const products = await this.getProduct();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products.splice(index, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return true;
    } else {
      console.log("Producto no encontrado");
      return false;
    }
  };

  //Actualizar productos
  updateProductById = async (id, updatedProduct) => {
    const products = await this.getProduct();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return true;
    } else {
      console.log("Producto no encontrado");
      return false;
    }
  };
}
//ALTA, BAJA Y MODIFICACION

const prod = new ProductManager("./products.json");



//////////////////////////////////////////(http://http://localhost:8080/productos?limite=1....10?id=1.....10)//////////////////////////////
const Product = express(); //ejecucion de la libreria
Product.get("/productos", async ({ query }, response) => {
  try {
    const { limite, id } = query;
    //localhost:8080/productos?id=1....10
    if (id) {
      console.log("Búsqueda de producto por ID:", id);
      const products = await prod.getProduct();
      const idProduct = products.find((item) => item.id === parseInt(id));
      response.send(idProduct ? idProduct : "No se encontró ningún producto con el ID especificado");
    }
    //localhost:8080/productos?limite=1....10
    else if (limite) {
      console.log("OK de envío con límite:", limite);
      const products = await prod.getProduct();
      const limiteNumerico = parseInt(limite);

      const limitedProducts = !isNaN(limiteNumerico) && limiteNumerico <= products.length
        ? products.slice(0, limiteNumerico)
        : "El límite es superior a la cantidad de objetos";

      response.send(limitedProducts);
    } else {
      //(!id !limite, muestra todos los productos)
      console.log("OK de envío de todos los productos");
      const products = await prod.getProduct();
      response.send(products);
    }
  } catch (error) {
    response.send("Error al procesar la solicitud");
  }
});

Product.listen(8080, () => console.log("Server Up"));


//////////////////////////////////////////////////////////agregar un producto nuevo///////////////////////////////////////////////

// prod.addProduct('riñonera', 'riñonera de jean', 2000, 14, 55)

// //Mostrar todos los productos

// console.log(await prod.getProduct())

///////////////////////////////////////////////////////////buscar un producto por su id////////////////////////////////////////////

// const buscid=2
// const product = await prod.getProductById(buscid)
// console.log(product)

/////////////////////////////////////////////////////////////borrar producto por su id/////////////////////////////////////////////////

// const id=1
// const eliminar = await prod.deleteProductById(id)
// console.log(eliminar ? `El producto con ID ${id} ha sido eliminado` : `No se ha encontrado ningún producto con ID ${id}`);

////////////////////////////////////////////////////////////modificar productos desde su id/////////////////////////////////////////
// const actId = 2
// const updatedProduct = { title: 'Campera Verano', description: 'Campera de Verano delgada', price: 50000, code: 28, stock: 5 }
// const isUpdated = await prod.updateProductById(actId, updatedProduct)
// console.log(isUpdated ? `El producto con ID ${actId} ha sido actualizado` : `No se ha encontrado ningún producto con ID ${actId}`)
