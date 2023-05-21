import fs from 'fs';



export default class ProductManager {
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


//////////////////////////////////////////////////////////agregar un producto nuevo///////////////////////////////////////////////

// prod.addProduct('riñonera', 'riñonera de jean', 2000, 14, 55)

// //Mostrar todos los productos

console.log(await prod.getProduct())

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
