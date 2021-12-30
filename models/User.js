const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, "Vous devez faire entre un email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Votre email n'est pas dans la bonne forme"]
    },
    password: {
        type: String,
    }
})

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const pw = await bcrypt.compare(password, user.password)
        if (pw) {
            return user
        }
        throw Error('password error')
    }
    throw Error('user error')
}

// Sécurise le mot de passe
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

module.exports = mongoose.model('User', userSchema)