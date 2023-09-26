const Product = require ("../../models/product");
const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const PORT = 3008;
const FILE_PATH = `http://localhost:${PORT}/productimage/`;
const User=require("../../models/user");
const Category=require("../../models/category");
const { verifyToken, verifyAdminToken } = require('../../middleware');
const jwt = require('jsonwebtoken');
const Notification =require("../../models/notification");

const storage = multer.diskStorage({
    destination: (reg, file, cb)=> {
		cb(null, "public/productimage")

    },
    filename: (reg, file, cb) =>{
        let filename = file.originalname.toLowerCase();
        cb(null, filename);
    },
});

const productimage = multer({storage: storage});

const routes = function (app) {
	// This routes retrieves a list of products with their associated category and user information.
    app.get('/products', async function(req,res){
		try{
			let product = await Product.find().populate("category").populate('user').lean();
			res.json(product)
			
		}catch(err){
			res.status(500).send(err.message)
		}
	});

	// This routes retrieves a specific product by its unique ID, along with its associated category and user information.
	app.get('/product/:id', async function(req,res){
		try{
			let {id} = req.params;
			let product = await Product.findById(id).populate('category').populate('user')
        	.lean();

			if (!product) {
			  return res.status(404).json({ message: 'Product not found' });
			};
			console.log('Product:', product);
            res.json(product);
		}catch(err){
			
			res.status(500).send(err.message)
		}
	});

	// This route creates a new product with the provided information, including an image. Also associates the product with a user and a category. Generates a notification indicating that a new product has been created.
    app.post('/product', productimage.any(), async function(req, res) {
    try {
        console.log('received request', req.body);
        console.log('received files', req.files);

        const { name, description, category, price, quantity, user } = req.body;

        let product = new Product({
            name,
            description,
            category,
			price,
			quantity,
            user, 
            image: FILE_PATH + req.files[0].filename, 
        });

        console.log('product created:', product);
        await product.save();

		// Generate a notification
		const notification = new Notification({
			message: `Admin created a new product: ${product.name}`,
			type: 'user_creation',
		});
		await notification.save();

        await User.findByIdAndUpdate(user, { $push: { product: product._id } });

		await Category.findByIdAndUpdate(category, { $push: { product: product._id } });

        res.json({ msg: "product created", code: 200 });
    } catch (err) {
        res.status(500).send(err.message);
    }
    });
	
	// This route updates an existing product's information based on its unique ID.
	app.put('/product/:id', async function(req,res){
		try{
			let {id} = req.params
			let product = await Product.findById(id)
            let new_data = {}

            if (!product)
            return res.status(404).json({msg: "product does not exist", code:404});

            new_data = {...product._doc, ...req.body};

            product.overwrite(new_data);
            await product.save();

            res.json(product)
		}catch(err){
			res.status(500).send(err.message)
		}
	});
    
	// Deletes a product with the specified ID. Also generates a notification indicating that a product has been deleted.
    app.delete('/product/:id', async function(req,res){
		try{
			let {id} = req.params
			let product = await Product.findOneAndDelete({ _id: id });

			if(!product) return res.status(404).json({msg:"product does not exit",code:404});
			res.json({msg:"Product deleted"})
			
		}catch(err){
			res.status(500).send(err.message)
		}
	});
	  
	// This route Retrieves a list of products belonging to a specific category based on the category's unique ID.
	app.get('/product/category/:categoryId', async (req, res) => {
		try {
		  const categoryId = req.params.categoryId;
		  const product = await Product.find({ category: categoryId });
		  res.json(product);
		} catch (error) {
		  res.status(500).json({ error: 'Internal server error' });
		}
	  });	
}

module.exports = routes