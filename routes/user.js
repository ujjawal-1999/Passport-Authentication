const express = require("express");
const router = express.Router();
const User = require("../config/models/Users");
const bcrypt = require("bcryptjs");
const passport = require('passport');

router.get('/login',(req,res)=>{
    res.render("login");
})

router.get('/register',(req,res)=>{
    res.render("register");
})

//Register Handle
router.post('/register',(req,res)=>{
    const { email, name, password, password2 } = req.body;
    let errors = [];

    //Check Required Fields
    if(!name || !email || !password || !password2)
        errors.push({message:'Please Fill in all fields'});
    //Check passwords match
    if(password !== password2)
        errors.push({message:'Passwords do not match'});
    //Check Password Length
    if(password.length < 6)
        errors.push({message:'Password should be atleast 6 characters'});
    
    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        //Validation Passed
        User.findOne({email:email})
            .then(user=>{
                if(user){
                    //User exists
                    errors.push({ message : "Email already registered"});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    //Hash Password
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err)
                                throw new Error(err);
                            //Set Password to Hashed Password
                            newUser.password = hash;
                            newUser.save()
                                .then(user=>{
                                    req.flash('success_msg','You are now registered and can login')
                                    res.redirect('/users/login');
                                })
                                .catch(err=>console.error(err));
                        });
                    });
                }
            });
    }
});

//Login Route

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

//Logout Handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});

module.exports = router;