import express from 'express'
import { User } from '../DB/Entities/User.js';
import jwt from 'jsonwebtoken'
import ableToReset from '../middleware/validation/resetPwd.js';

const router = express.Router();

router.get('/forgot-password', (req,res) => {
    res.render('forgot-password');
});

router.post("/forgot-password", async(req, res) => {
    const { email } = req.body;
//make sure user exist in database
const user = await User.findOneBy({email: email});
if(user === null)
{
    res.send("user not registered");
    return;
}

//user exist and now create one time link valid for 15 m
const secret = process.env.JWT_SECRET + user.password;
const payload = {
    email: user.email,
    id: user.id
};
const token = jwt.sign(payload, secret, {expiresIn: '5m'});;
const link = `http://localhost:3000/reset-password/${user.id}/${token}`;
//send the email using ses
console.log(link);
res.send('Password reset link has been sent to your email...');
});

router.get("/reset-password/:id/:token", async(req, res) => {
    const {id, token} = req.params;
    //check if this id in the database
    const user = await User.findOneBy({id: Number(id)});
    if(user === null)
    {
        res.send('invalid id...');
        return;
    }
    
//we have a valid id , and we have a valid user with this id
const secret = process.env.JWT_SECRET + user.password;
try {
    const payload = jwt.verify(token, secret)
    res.render('reset-password', {email: user.email})
    
} catch (error) {
    console.log(error);
    res.send(error);
    
}

});
router.post("/reset-password/:id/:token", async(req, res) => {
    const {id, token} = req.params;
    const {password, password2} = req.body
    //check if this id in the database
    const user = await User.findOneBy({id: Number(id)});
    if(user === null)
    {
        res.send('invalid id...');
        return;
    }
    const secret = process.env.JWT_SECRET + user.password
    try {
        const payload = jwt.verify(token, secret);
        if(ableToReset(password, password2) === true)
        {
            user.password = password;
            res.send(password);
        }
        //validate password and password 2 should match express validator
        //we can simply find the user with the payload email and id and finally update with new password
        //hash the password
        user.password = password;
        await user.save();
        res.send("Your password has been reset");

    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

export default router;