const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

//Connection à la base de données avec MongoDB
const uri = 'mongodb+srv://admin123:admin123@cluster0.lvcet.mongodb.net/FinalReactEcommerce';

async function connectDB() {
    try {
      await mongoose.connect(uri); 
      console.log('Connexion à MongoDB réussie');
    } catch (error) {
      console.error('Erreur lors de la connexion à MongoDB :', error);
    }
  }
  
  connectDB();

//Création de l'API

app.get("/",(req,res)=>{
res.send("l'Application Express est en cours")
})

//Image storage Engine

const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Creating Upload Enpoint for images( not working )

app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
res.json({
    success:1,
    image_url:`http://localhost:${port}/images/${req.file.filename}`
})
})

//Schema pour Créer un Produit

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },

})
//Ajouter un produit dans la base de données

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else{
        id = 1;
    }
const product = new Product({
    id:id,
    id:req.body.id,
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,
});
console.log(product);
await product.save();
console.log("produit enregistré");
res.json({
    success:true,
    name:req.body.name,
})
})

//API pour supprimer un produit

app.post('/removeproduct',async (req,res)=>{
await Product.findOneAndDelete({id:req.body.id});
console.log(" Produit supprimé");
res.json({
    success:true,
    name:req.body.name
})
})

//API pour afficher tous les produits

app.get('/allproducts',async (req,res)=>{
let products = await Product.find({});
console.log("All products fetched");
res.send(products);
})

app.listen(port,(error)=>{
if(!error){
    console.log("Serveur connecté sur le port "+port);
}
else{
    console.log("Erreur de connexion au serveur"+error);
}
})