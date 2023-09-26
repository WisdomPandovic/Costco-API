const Category = require("../../models/category");
const multer = require("multer");
const path = require("path");
const PORT = 3008;
const FILE_PATH  = `http://127.0.0.1:${PORT}/productimage/`;

const routes = function (app) {
	// This route retrieves a list of categories.
    app.get('/category', async function(req,res){
		try{
			let category = await Category.find().lean()
			console.log('Populated categories with posts:', category);
			res.json(category)
		}catch(err){
			res.status(500).send(err.message)
		}
	});
	  
	// This route retrieves a specific category by its unique ID, along with the products associated with it.
	app.get('/category/:id', async function(req,res){
		try{
		 let {id} = req.params
		 let category = await Category.findById(id).populate('product');

		 if (!category) {
			return res.status(404).json({ msg: 'Category not found' });
		  }
	  
		//   console.log('Fetched category:', category);

		 let data = {
			 title: category.title,
			 id:category.id,
			 product: category.post
		 }
		 // console.log(category)
		 res.json(data)
		}catch(err){
			console.error('Error fetching category:', err);
		    res.status(500).send({msg:"server error"})
		}
	 })

	 // This route updates an existing category's information based on its unique ID.
	app.put('/category/:id', async function(req,res){
		try{
			let {id} = req.params
			let category = await Category.findById(id)
            let new_data = {}

            if (!category)
            return res.status(404).json({msg: "category does not exist", code:404});

            new_data = {...category._doc, ...req.body};

            category.overwrite(new_data);
            await category.save();

            res.json(category)
		}catch(err){
			res.status(500).send(err.message)
		}
	});
    
	// Deletes a category with the specified ID.
    app.delete('/category/:id', async function(req,res){
		try{
			let {id} = req.params
			let category = await Category.findOneAndDelete({ _id: id })

			if (!category) {
				return res.status(404).json({ msg: "Category does not exist", code: 404 });
			  }
		  
			  res.json({ msg: "Category deleted" });
			} catch (err) {
			  res.status(500).send(err.message);
			}
	});

	// Creates a new category with the provided information.
	app.post('/category', async function(req,res){
		try{
			let category = new Category(req.body)
			category.post = req.body.post;
			// console.log(category.post)
			await category.save()
			res.json(category)
		}catch(err){
			res.status(500).send(err.message)
		}
	})
 
}
module.exports = routes