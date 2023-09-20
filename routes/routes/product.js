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
    app.get('/products', async function(req,res){
		try{
			let product = await Product.find().populate("category").populate('user').lean();
			res.json(product)
			
		}catch(err){
			res.status(500).send(err.message)
		}
	});

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

    // app.post('/product', productimage.any(), async function(req, res) {
    // try {
    //     console.log('received request', req.body);
    //     console.log('received files', req.files);

    //     const { name, description, category, price, quantity, user } = req.body;

    //     let product = new Product({
    //         name,
    //         description,
    //         category,
	// 		price,
	// 		quantity,
    //         user: user, 
    //         image: FILE_PATH + req.files[0].filename, 
    //     });

    //     console.log('product created:', product);
    //     await product.save();

    //     await User.findByIdAndUpdate(user, { $push: { product: product._id } });

	// 	await Category.findByIdAndUpdate(category, { $push: { product: product._id } });

    //     res.json({ msg: "product created", code: 200 });
    // } catch (err) {
    //     res.status(500).send(err.message);
    // }
    // });
	
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
	  
	app.get('/product/category/:categoryId', async (req, res) => {
		try {
		  const categoryId = req.params.categoryId;
		  const product = await Product.find({ category: categoryId });
		  res.json(product);
		} catch (error) {
		  res.status(500).json({ error: 'Internal server error' });
		}
	  });	

	  app.post('/product', verifyToken, verifyAdminToken, productimage.any(), async function(req, res) {
		try {
			// Verify the token
			const token = req.headers['authorization'];
			jwt.verify(token, 'p3A#8WmTbD$9S@yK!qXg*1&r^7z%j@2L', async (err, decoded) => {
				if (err) {
					return res.status(401).json({ message: 'Failed to authenticate token' });
				}
	
				const { name, description, category, price, quantity } = req.body;
				const user = decoded.id; // Extract userID from the token
	
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
	
				await User.findByIdAndUpdate(user, { $push: { product: product._id } });
	
				await Category.findByIdAndUpdate(category, { $push: { product: product._id } });
	
				res.json({ msg: "product created", code: 200 });
			});
		} catch (err) {
			res.status(500).send(err.message);
		}
	});
	
	
}

module.exports = routes