// seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SignUp = require('./Schema/Signup');
require("dotenv").config()

const mongoURI = process.env.MONGODB_URI

async function seed() {
  // Connect to the MongoDB database
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Check if the default user already exists
    const defaultUser = await SignUp.findOne({ email: 'mentorsacademia.com' });

    if (!defaultUser) {
      // Create the default user with specific credentials
      const hashedPassword = await bcrypt.hash('Mentors@@234', 10); // Replace with a strong password

      await SignUp.create({
        email: 'mentorsacademia.com',
        password: hashedPassword
      });

      console.log('Default user created');
    } else {
      console.log('Default user already exists');
    }
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from the MongoDB database
    await mongoose.disconnect();
  }
}

