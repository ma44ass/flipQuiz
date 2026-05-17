const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Blueprint Structure:
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please provide a username'],
        unique : true,
        trim: true,
        minlength : [3, 'Username must be at least 3 characters long']
    },
    email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // This hides the password by default when parsing users from the DB
  },
  role: {
    type: String,
    enum: ['player', 'creator', 'admin'],
    default: 'player'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//Pre-Save Middleware: Automatically hash the password before saving to MongoDB
userSchema.pre('save', async function (next){
    //Only run this password hashing engine if the password field was actually modified
    if(!this.isModified('password')){
        return
    }

    try {

        /*salt is a random string of unique cryptographic "noise" generated for each individual user. 
        The 10 represents the "salt rounds"the work factor. 
        10 rounds strikes the perfect balance between being incredibly secure and processing quickly.*/
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});

    
userSchema.methods.matchPasswords = async function (enteredPassword) {
    /*Safely compare entered passwords with the database hash: 
    take the password they typed into the login box, hash it using the exact same salt
    and see if the two resulting hashes match perfectly.*/
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
