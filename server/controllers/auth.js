import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';



const generateToken =(id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

export const register = async (req, res) =>{
    try{

        const {username, email, password} = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username, 
            email,
            password: passwordHash
        });

        const user = await newUser.save();

        // generate jwt token using function we defined at top of the page
        const token = generateToken(user._id);

        const userData = {_id: user._id, username: user.username, email:user.email};
        res.status(200).json({token, user:userData});

    }catch(err){
        res.status(500).json({error: err.message});
    }
};

export const login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user) return res.status(400).json({msg: "User does not exist"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg: "Invalid credentials"});

        // generate jwt token using function we defined at top of the page
        const token = generateToken(user._id);
        delete user.password;
        const userData = {_id: user._id, username: user.username, email:user.email};
        res.status(200).json({token, user:userData});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};


