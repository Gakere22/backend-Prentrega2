import express from 'express'
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import fs from 'fs'
import routerCarts from "./api/carts/api-carts.js"
import routerProducts from './api/products/api-products.js'
import { routerRealTime } from './api/realTime/realTimeProducts.js'
import { Server } from 'socket.io'
import {createInitialBaseCarts} from './gestion-archivos/carts.js'
import{createInitialBaseProducts} from './gestion-archivos/productos.js'
import { Socket } from 'socket.io'
import socketProductsServer from './listeners/socketProductsServer.js'
import { socketRealTimePro } from './api/realTime/realTimeProducts.js'

// cuando levantava express con cmmon js 
//const express = require('express');

//const productsRouter = require ("./api/products/api-products.js")
//const cartsRouter = require ("./api/carts/api-carts.js");

//const archivoGeneral = require("./gestion-archivos/general.js");

//const archivoProductos = require ("./gestion-archivos/productos.js");

//const archivoCarts = require("./gestion-archivos/carts.js")

//const { error } = require("console");

//const rutePro = archivoProductos.ruta


//const ruteCart = archivoCarts.ruta


createInitialBaseProducts()

createInitialBaseCarts()


//console.log("levanto la data de productos ")

//console.log("esta es la ruta")

//console.log(rutePro)


//const productos = archivoGeneral.getDataFromFile(rutePro)

//console.log(productos)

//console.log("levanto la data de cart ")

//console.log("esta es la ruta")

//console.log(ruteCart)

//const carts = archivoGeneral.getDataFromFile(ruteCart)

//console.log(carts)

/*
const datos = [
    {name:"nahuel",
     last:"varas"

    },
    {name:"Toro",
    last:"varas"
   
    },
    {name:"Suri",
        last:"varas"
       
        }
]

//const ruta = "C:\archivos bckp\documentos\CODERHOUSE\BACKEND I\PREENTREGA1\src\archivos\productos.json"
const datosJson = JSON.stringify(datos)


//console.log(ruta)

console.log(rute)

const escribir = async (data)=>{
    
    await fs.promises.writeFile(rute, data, "utf8", 0o666,"w")
    console.log("guarde los datos del productos")
    
}



let nro = 0
    while(nro <= 3 ){
        escribir (datosJson)  
        nro++      
    }
*/
/*
const dameData = async (rute)=>{
     const data = await fs.promises.readFile(rute, "utf8","r")
     console.log(data)
     return  JSON.parse(data)
        /*
        if(err){
            console.error(err)
        }else{
            console.log(data)
            return JSON.parse(data)
        }

    }

dameData(rute)
*/

/*
const eliminarArchivo = (ruta)=>{

    fs.unlink(ruta,(err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("se elimino el archivo ")
        }

    })
}

eliminarArchivo(rute)
*/

const app = express();
app.use(express.json()) // esta linea es para poder enviar inpormacion en el body de la request
app.use(express.urlencoded({extended: true}))  // esta linea es para que la aplicacion entienda los parametros que viajan por la url



app.engine('handlebars', handlebars.engine());
app.set('views',__dirname +'/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname +'/public'))


let testUser = {
    name: "estela",
    apellido: 'varas'

}
  

let arreglo = [{
        nombre1: "nahuel",
        apellido1:"varas",
        edad: 11
    },
    {
        nombre1: "Suria",
        apellido1:"varas",
        edad: 4        
    },
    {
        nombre1: "toro",
        apellido1:"varas",
        edad: 0.8        
    }]

  

app.get('/prueba',(req,res)=> {

    
    res.render("home", {testUser, arreglo}) 
})
    

app.post("/prueba",(req,res)=> {
    console.log("entre al post con lo cual al info se envio")
    let dato = req.body;
    
    console.log(dato)
    testUser.name = dato.nombre
    
    res.render("home", {testUser})

})

const PORT = 8080;



app.use("/", routerProducts);
app.use("/", routerCarts);
app.use("/", routerRealTime);



const httpServer = app.listen(PORT, ()=>(console.log("levanto el servidor")))
console.log("donde estoy")

const io = new Server(httpServer)


socketProductsServer(io)
socketRealTimePro(io)





