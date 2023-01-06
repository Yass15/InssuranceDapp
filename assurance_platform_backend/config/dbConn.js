const mongoose = require('mongoose');
// process.env.DATABASE_URI
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/platform_users', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB