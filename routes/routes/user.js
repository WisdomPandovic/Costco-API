const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const Product=require("../../models/product");
const Notification =require("../../models/notification");
const { verifyToken, verifyAdminToken } = require('../../middleware');
const generateToken = require('../../tokenUtils');

const multer = require("multer");
const PORT = 3008;
const FILE_PATH = `http://localhost:${PORT}/productimage/`;

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

const routes = function(app){
	app.get('/',function(req,res){
		res.json({msg:"This is my user index route"})
	})

	// Retrieves a list of users from the database.
	app.get('/users', async function(req,res){
		try{
			let users = await User.find().lean()
			res.json(users)
		}catch(err){
			res.status(500).send(err.message)
		}
	})

	// Retrieves a specific user by their unique ID.
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

	// Creates a new user with the provided information. Also generates a notification indicating that a new user has been created
	app.post("/users", async function(req,res){
        try{
            const {name, email, phoneNumber, password, membershipNumber, role, avatar} = req.body
            const user = new User({
                name,
                email:email.toLowerCase(),
                phoneNumber,
                password,  
				membershipNumber,
                role,
            })
    
			await user.save()

			// Generate a notification
            const notification = new Notification({
                message: `Admin ${req.user.name} created a new user: ${user.name}`,
                type: 'user_creation',
            });
            await notification.save();
           
                res.json(user)
		}catch(err){
			res.status(500).send(err.message)
		}
    })

	 // Updates an existing user's information based on their unique ID. Also generates a notification indicating that a user has been updated.
	app.put('/users/:id', async function(req,res){
		try{
			let {id} = req.params
			let user = await User.findById(id)
			let new_data = {};

			if(!user) return res.status(404).json({msg:"User does not exit",code:404})
		
			new_data = {...user._doc,...req.body}
		
			user.overwrite(new_data)
			await user.save()

			  // Generate a notification
			  const notification = new Notification({
				message: `Admin updated a user: ${user.name}`,
				type: 'user_creation',
			});
			await notification.save();

			res.json(user)
		}catch(err){
			res.status(500).send(err.message)
		}
	})

	// Deletes a user with the specified ID. Also generates a notification indicating that a user has been deleted.
	app.delete('/user/:id', async function(req, res) {
		try {
		  let { id } = req.params;
		  let user = await User.findOneAndDelete({ _id: id }); 
	  
		  if (!user) {
			return res.status(404).json({ msg: "User does not exist", code: 404 });
		  }

		    // Generate a notification
			const notification = new Notification({
				message: `Admin  deleted a user: ${user.name}`,
				type: 'user_creation',
			});
			await notification.save();
	  
		  res.json({ msg: "User deleted" });

		
		} catch (err) {
		  res.status(500).send(err.message);
		}
	  });

	  // Retrieves a list of users along with their associated products.
	app.get('/users-with-products', async function(req, res) {
		try {
			let usersWithProducts = await User.find().populate('product').lean();
			res.json(usersWithProducts);
		} catch (err) {
			res.status(500).send(err.message);
		}
	});

	// Handles user login authentication and returns a JSON response with user information if successful.
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
	  
	// Handles admin login authentication and returns a JSON response with a token if successful.
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
		  user.lastLogin = new Date();
		  await user.save();
		  
		  const token = generateToken(user);
		  res.json({ token});
		} catch (error) {
		  console.error(error);
		  res.status(500).json({ message: 'Internal Server Error' });
		}
	  });
	  
	  // Retrieves a list of admin users along with their associated products.
	  app.get('/admin-users-with-products', async function(req, res) {
		try {
			let adminUsersWithProducts = await User.find({ role: 'admin' }).populate('product').lean();
			console.log(adminUsersWithProducts);
			res.json(adminUsersWithProducts);
		} catch (err) {
			res.status(500).send(err.message);
		}
	});

	// Retrieves a list of admin users along with their associated products.
    app.get("/user-avatar/:id", async function(req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ avatarUrl: user.avatar });
    } catch(err) {
        res.status(500).send(err.message);
    }
    });

 
	// Creates a new admin user with the provided information, including an avatar image. Also generates a notification indicating that a new admin user has been created.
	app.post("/admin-users", productimage.array('avatar', 1), async function(req,res){
		try {
			const { name, email, phoneNumber, password, membershipNumber, role } = req.body;
			let avatarPath = null;
	
			// Check if req.files is defined and contains files
			if (req.files && req.files[0]) {
				avatarPath = FILE_PATH + req.files[0].filename;
			}
	
			const user = new User({
				avatar: avatarPath,
				name,
				email: email.toLowerCase(),
				phoneNumber,
				password,
				membershipNumber,
				role: "admin"
			});
	
			await user.save();
	
			// Generate a notification
			const notification = new Notification({
				message: `Admin created a new admin user: ${user.name}`,
				type: 'user_creation',
			});
			await notification.save();
	
			res.json(user);
		} catch(err) {
			res.status(500).send(err.message);
		}
	});
}

module.exports = routes