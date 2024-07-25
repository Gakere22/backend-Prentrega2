
import express from 'express'
import fs from 'fs'
import {saveProductsOnFile, updateProduct, getNextId, ruta  } from '../../gestion-archivos/productos.js'
import { getDataFromFile} from '../../gestion-archivos/general.js'




//const express = require("express")

const routerProducts = express.Router()


//const archivoProductos = require("../../gestion-archivos/productos.js")

//const archivoGeneral =require ("../../gestion-archivos/general.js")











routerProducts.put ("/products/:pid", (req,res)=>{
    const id = parseInt(req.params.pid)
    const data = req.body
    const products = getDataFromFile(ruta)
   
    
    const index = products.findIndex((pro)=> pro.id === id)
    if (index !== -1){
         
       
        if (data.title){
            products[index].name = data.title
        }
        if(data.description){
            products[index].description = data.description
        }
        if(data.code){
            products[index].code = data.code
        }
        if(data.price){
            products[index].price = parseFloat(data.price)
        }
        if(data.status){
            products[index].status = data.status === "false"? false: true
        }
        if(data.stock){
            products[index].stock = parseInt(data.stock)
        }
        if(data.category){
            products[index].category = data.category
        }    
        
        saveProductsOnFile(products)
        
        res.json({
        message: "se actualizo el producto"
        })
    }else{
        res.json({
        message: "El producto no existe"
    })
    }                         
    
})



/*
routerProducts.get("/products", (req,res)=>{
     
    let {limit} = req.query;
    const products = getDataFromFile(ruta)
    
    if(products.length !== 0){
        
        if(limit){
            limit = parseInt(limit)
            if(limit < products.length) {
                let productosFiltrados = products.slice(limit)
                res.json({...productosFiltrados})
            }else{
                res.json({message:" el parametro pasado como limiete supera la cantidad de productos exitentes"})
            }          
        }else{
            res.json({...products})
        }
    }else{
        res.send({status:"error", message:"No hay productos "})
    }
    
})
    */



routerProducts.get("/products", (req,res)=>{
     
    let {limit} = req.query;
    const products = getDataFromFile(ruta)
    
    if(products.length !== 0){
        
        if(limit){
            limit = parseInt(limit)
            if(limit < products.length) {
                let productosFiltrados = products.slice(limit)
                res.json({...productosFiltrados})
            }else{
                res.json({message:" el parametro pasado como limiete supera la cantidad de productos exitentes"})
            }          
        }else{
            //let producto = [{nombre: "tomate", precio: 10}, {nombre: "pera", precio: 20}]
            res.render("products", {products})
        }
    }else{
        res.send({status:"error", message:"No hay productos "})
    }
    
})



routerProducts.get("/products/:pid", (req,res)=>{
    let id = parseInt(req.params.pid)

    const products = getDataFromFile(ruta)

    const product = products.find((pro)=> (pro.id===id));
    if ( product !== undefined){       
        res.json({
           product
        })
    }else{
        res.json({
            mensaje:" No existe producto con el ID"
        })
    }
})


routerProducts.post("/products", (req,res)=>{
            
            const data = req.body
            let product= {};
            let nextId = getNextId()
            if (data.title){
                if(data.description){
                    if(data.code){
                        if(data.price){
                            if(data.status){
                                if(data.stock){
                                    if(data.category){
                                         product = {
                                            id: nextId,
                                            name: data.title,
                                            description: data.description,
                                            price: parseFloat(data.price),
                                            status: data.status === "false"? false: true, 
                                            stock: parseInt(data.stock),
                                            category: data.category,
                                            thumbnalis:  Boolean(data.thumbnalis)? data.thumbnalis : null 
                                        }
                                     
                                       
                                    }else{
                                        res.send({status: "error", mensaje:"El campo category es obligatorio"})
                                    }
                                }else{
                                    res.send({status: "error", mensaje:"El campo Stock es obligatorio"})
                                }
                            }else{
                                res.send({status: "error", mensaje:"El campo Status es obligatorio"})
                            }
                        }else{
                            res.send({status: "error", mensaje:"El campo Price es obligatorio"})
                        }
                    }else{
                        res.send({status: "error", mensaje:"El campo Code es obligatorio"})
                    }
                }else{
                    res.send({status: "error", mensaje:"El campo Description es obligatorio"})
                }

            }else{
                res.send({status: "error", mensaje:"El campo Name es obligatorio"})
            }

          updateProduct (product, ruta);
          nextId++
          
          res.send({status: "succes", mensaje:"Se dio de alta el producto"})
        
            
})




routerProducts.delete("/products/:pid",(req,res)=>{
    const id = parseInt(req.params.pid)
    let products = getDataFromFile(ruta)
    products =  products.filter((pro)=> pro.id !== id)
    saveProductsOnFile(products)

    res.json({ message:" se borro producto"})
})



export default routerProducts
