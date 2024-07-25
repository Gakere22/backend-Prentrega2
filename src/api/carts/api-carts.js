import express from 'express'

import fs from 'fs'

import { ruta, getNextId, saveCartsOnFile,} from '../../gestion-archivos/carts.js'

import { getDataFromFile} from '../../gestion-archivos/general.js'


//const express = require("express")


const routerCarts = express.Router() 


//const archivoCarts = require("../../gestion-archivos/carts.js")

//const archivoGeneral = require("../..//gestion-archivos/general.js")






routerCarts.post("/carts", (req,res)=>{
    
    const carts = getDataFromFile(ruta) 
    let index = getNextId()
    const products = []
    const cart = {id:index, products}
    carts.push(cart)  
    saveCartsOnFile(carts)
    res.json({message:" se dio de alta"}) //devoverl con estatus

})

routerCarts.post("/carts/:cid/products/:pid",(req,res)=>{
    const cId = parseInt(req.params.cid);
    const id = parseInt(req.params.pid);
    const carts = getDataFromFile(ruta)
   
    
    if (carts.length !== 0){    
        let cartIndex = carts.findIndex((carro)=> carro.id === cId)
        
        if (cartIndex !== -1){
            const cart = carts[cartIndex] //se referencia al mimo objeto
            let productIndex = cart.products.findIndex((pro)=> pro.id === id )
            
            if (productIndex !== -1){
                cart.products[productIndex].quantity++ 
               
                res.json({status: "success", message:"se modifico la cantidad el producto"})
            }else{
                let product = {id, quantity: 1}
                cart.products.push(product)
                
                res.json({status: "success", message:"se agrego el producto al carrito"})
            }
            saveCartsOnFile(carts)
        }else{
            res.json({message: "el id del carrito no exixte"})
        }
    }else{
        res.json({message:"no hay carritos generados"})
    }


})

routerCarts.get("/carts", (req,res)=> {
    const carts = getDataFromFile(ruta)
   
     res.json({carts})
})

routerCarts.get("/carts/:cid", (req,res)=>{
    const cId = parseInt(req.params.cid)
    const carts = getDataFromFile(ruta)
    if (carts.length !== 0){    
        let cart = carts.find((carro)=> carro.id === cId)
        if (cart !== undefined){
            res.json({...cart.products})
        }else{
            res.json({message: "el id del carrito no exixte"})
        }
    }
})



/*
router.get("/carts", (req,res)=>{


})
    */
   
export default routerCarts