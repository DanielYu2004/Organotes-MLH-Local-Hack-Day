const bcrypt = require('bcryptjs')
let SALT = 10;

const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    }
});

userSchema.pre('save', function(next){
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(SALT, function(err, salt){
            if(err) return next(err);

            bcrypt.hash(user.password, salt , function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next()
    }
})

//comparing passwords 
userSchema.methods.comparePassword = function(candidatePassword, checkPassword){

    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return checkPassword(err)
        checkPassword(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }