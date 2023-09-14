const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const Product=require("../../models/product");
const { verifyToken, verifyAdminToken } = require('../../middleware');
const generateToken = require('../../tokenUtils');

const routes = function(app){
	app.get('/',function(req,res){
		res.json({msg:"This is my user index route"})
	})

	app.get('/users', async function(req,res){
		try{
			let users = await User.find().lean()
			res.json(users)
		}catch(err){
			res.status(500).send(err.message)
		}
	})

	app.get('/users/:id', async function(req,res){
		try{
			let {id} = req.params
			let user = await User.findById(id)
		
			if(!user) return res.status(404).json({msg:"User does not exit",code:404})
			
			res.json(user)
		}catch(err){
			res.status(500).send(err.message)
		}
	})

	app.post("/users", async function(req,res){
        try{
            const {name, email, phoneNumber, password, membershipNumber, role,} = req.body
            const user = new User({
                name,
                email:email.toLowerCase(),
                phoneNumber,
                password,  
				membershipNumber,
                role: "user",
            })
    
			await user.save()
           
                res.json(user)
		}catch(err){
			res.status(500).send(err.message)
		}
    })

	app.post("/admin-users", async function(req,res){
        try{
            const {name, email, phoneNumber, password, membershipNumber, role,} = req.body
            const user = new User({
                name,
                email:email.toLowerCase(),
                phoneNumber,
                password,  
				membershipNumber,
                role: "admin", 
            })
    
			await user.save()
           
                res.json(user)
		}catch(err){
			res.status(500).send(err.message)
		}
    })

	app.put('/users/:id', async function(req,res){
		try{
			let {id} = req.params
			let user = await User.findById(id)
			let new_data = {};

			if(!user) return res.status(404).json({msg:"User does not exit",code:404})
		
			new_data = {...user._doc,...req.body}
		
			user.overwrite(new_data)
			await user.save()

			res.json(user)
		}catch(err){
			res.status(500).send(err.message)
		}
	})

	app.delete('/user/:id', async function(req, res) {
		try {
		  let { id } = req.params;
		  let user = await User.findOneAndDelete({ _id: id }); 
	  
		  if (!user) {
			return res.status(404).json({ msg: "User does not exist", code: 404 });
		  }
	  
		  res.json({ msg: "User deleted" });
		} catch (err) {
		  res.status(500).send(err.message);
		}
	  });

	app.get('/users-with-products', async function(req, res) {
		try {
			let usersWithProducts = await User.find().populate('product').lean();
			res.json(usersWithProducts);
		} catch (err) {
			res.status(500).send(err.message);
		}
	});

	app.post('/login', async function(req, res) {
		try {
			const { email, password } = req.body;

			let user = await User.findOne({ email, password });
	
			if (!user) {
				return res.status(404).json({ msg: "Invalid user", code: 404 });
			}
			user.lastLogin = new Date();
			await user.save();
	
			let data = {
				name: user.name,
				phoneNumber: user.phoneNumber,
				email: user.email,
				id: user._id,
				active: true,
				lastLogin: user.lastLogin.toISOString(),
			};
	
			res.json({ msg: "Login successful", data });
		} catch (err) {
			console.error(err);
			res.status(500).json({ msg: "Internal server error occurred", error: err.message });
		}
	});

	// app.post('/admin-login', async (req, res) => {
	// 	try {
	// 	  const { email, password } = req.body;
	// 	  const user = await User.findOne({ email });
	  
	// 	  if (!user || !user.isAdmin) {
	// 		return res.status(401).json({ message: 'Unauthorized' });
	// 	  }
	  
	// 	  if (user.password !== password) {
	// 		return res.status(401).json({ message: 'Invalid credentials' });
	// 	  }
	  
	// 	  const token = generateToken(user);
	// 	  res.json({ token });
	// 	} catch (error) {
	// 	  console.error(error);
	// 	  res.status(500).json({ message: 'Internal Server Error' });
	// 	}
	//   });
	  
	
	app.post('/admin-login', async (req, res) => {
		const userID = req.userid; 
		try {
		  const { email, password } = req.body;
		  const user = await User.findOne({ email, password });
	  
		  if (!user) {
			return res.status(401).json({ message: 'Invalid user' });
		  }
	  
		  if (user.role !== "admin") {
			return res.status(401).json({ message: 'Unauthorized' });
		  }
	  
		  if (user.password !== password) {
			return res.status(401).json({ message: 'Invalid credentials' });
		  }
	  
		  const token = generateToken(user);
		  res.json({ token });
		} catch (error) {
		  console.error(error);
		  res.status(500).json({ message: 'Internal Server Error' });
		}
	  });
	  
}

module.exports = routes