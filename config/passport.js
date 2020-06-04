const localStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose");
const User = require("./models/Users");
const bcrypt = require("bcryptjs");

module.exports = function(passport){
    passport.use(
        new localStrategy({usernameField:'email'},(email,password,done)=>{
            //Match User
            User.findOne({email:email})
                .then((user)=>{
                    if(!user){
                        return done(null,false,{message:'Email is not registered'});
                    }

                    //Match Password
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(err) throw err;
                        if(isMatch){
                            return done(null,user);
                        }
                        else{
                            return done(null,false,{message:'Wrong Credentials'});
                        }
                    });
                })
                .catch(err=>console.error(err));
        })
    );

    //Serialize User
    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user)=> {
          done(err, user);
        });
      });
}