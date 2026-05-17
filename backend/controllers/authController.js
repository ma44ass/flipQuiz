const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function: Generate a secure JWT Token packed with user information
const generateToken = (id,role) => {
    // embed the user's ID and role directly inside the token payload
    /*
   jwt.sign takes an object (payload) and a secret key, mathematically signing it so it cannot be altered by a user without invalidating the token.
    */
    return jwt.sign({id,role}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

exports.register = async (req, res) => {
    try{
        const{username, email, password, role } = req.body;

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                message: 'User already exists with this email'
            });
        }

        const user = await User.create({
            username,
            email,
            password,
            role
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });

    } catch (error){
        res.status(500).json({
            message: 'Server Error during registration',
            error: error.message
        })
    };
};

exports.login = async (req, res) => {
    try {
    //Find user in DB and explicitly tell Mongoose to include the hidden password field Because we set select: false in our model for security
        const user = await User.findOne({email}).select('+password');
        if (!user){
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
        //Use matchPasswords method to check if the password matches the hash
        const isMatch = await user.matchPasswords(password);
        if(!isMatch){
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
        //Response: Success! Send back profile info and a fresh token
        res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role)
            });

        } catch (error){
            res.status(500).json({
                message: 'Server Error during login',
                error: error.message
            })
        };
};
