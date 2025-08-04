const mongoose = require('mongoose');

exports.connectDB = async() => {
    mongoose
	.connect(process.env.CONN_STR)
	.then((succes) => {
		console.log("DB connected");
	})
	.catch((err) => {
		console.log(`Error connecting to DB: ${err}`);
	});

}