const express = require('express');
const app = express();
const path = require('path')
const port = 5000;
const db = require('./db');
const {Product, Company, Offering} = db.models

app.get('/', (req,res,next)=>{
  res.sendFile(path.join(__dirname,'./index.html'))
})

app.get('/api/products', async(req,res,next)=>{
  res.send(await Product.findAll())
})

app.get('/api/companies', async(req,res,next)=>{
  res.send(await Company.findAll())
})

app.get('/api/offerings', async(req,res,next)=>{
  res.send(await Offering.findAll())
})

db.syncAndSeed()
  .then(app.listen(port, ()=> console.log('success')))