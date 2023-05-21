import express from "express";
import ProductManager from "./ProductManager.js";

const app = express(); //ejecucion de la libreria
const port = 8080;

const prod = new ProductManager("./products.json");

// app.get('/productos', async (req, res) =>{
   
// })

app.get("/productos", async (req, res) =>{ 
    const id = req.query.id;
    const limit= req.query.limit;


    

    if(id){
        const products = await prod.getProduct();
        console.log("se envian con id")
        const idProduct = products.find((item) => item.id === parseInt(id));
        res.send(idProduct ? idProduct : "No se encontró ningún producto con el ID especificado"); // Corrección: res en lugar de response
    
    }else if (limit) {
        console.log("OK de envío con límite:");
        const products = await prod.getProduct();
        const limiteNumerico = parseInt(limit);
        
        const limitedProducts = !isNaN(limiteNumerico) && limiteNumerico <= products.length
          ? products.slice(0, limiteNumerico)
          : "El límite es superior a la cantidad de objetos";
        
        res.send({product:limitedProducts});

    }else{
        const products = await prod.getProduct();
        console.log("se envian todos los productos")
        res.send(products);
    }
     
    
});








app.listen(8080, () => console.log("Server Up"));