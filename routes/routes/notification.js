const Notification = require('../../models/notification')
const bcrypt = require('bcryptjs')
const Product=require("../../models/product");

const routes = function(app){
	app.get('/api/notifications', async (req, res) => {
		try {
		  const notifications = await Notification.find().sort({ timestamp: -1 });
		  res.json(notifications);
		} catch (error) {
		  res.status(500).json({ error: 'Internal Server Error' });
		}
	  });

	  
}

module.exports = routes