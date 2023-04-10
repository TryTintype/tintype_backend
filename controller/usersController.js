const User = require("../models/userModels")
const bcrypt = require("bcrypt")

module.exports.register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body

        const userNameCheck = await User.findOne({username})
        const emailCheck = await User.findOne({email})

        if (userNameCheck) 
            return res.json({message: "username already exists", status: false})

        

        if (emailCheck) 
            return res.json({message: "email already exists", status: false})

        

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({email, username, password: hashedPassword})

        delete User.password
        res.status(201).json({status: true, user})
    } catch (err) {
        console.log({err})
        next(err)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const {username, password} = req.body

        const user = await User.findOne({username})
        const isPasswordValid = bcrypt.compare(password, user.password)

        if (! user) 
            return res.json({message: "incorrect username or password", status: false})

        if (! isPasswordValid) 
            return res.json({message: "incorrect username or password", status: false})
  

        delete user.password
        res.status(200).json({status: true, user})
    } catch (err) {
        next(err)
    }
}

module.exports.setAvatar = async (req, res, next) => {

    try {
        const userId = req.params.id
        const avatarImage = req.body.image

        if (!userId) 
            return res.json({message: "please login", status: false})      

        if (!avatarImage) 
            return res.json({ message: "please select an image", status: false })
        
        const updateUserData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })

        return await res.status(200).json({isSet: updateUserData.isAvatarImageSet, image: updateUserData.avatarImage})

    } catch (err) {
        next(err)
    }
}


module.exports.getAllUsers = async (req, res, next) => {
    try {    
        const allUsers = (await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ]));

        return res.status(200).json(allUsers)
        
    } catch (err) {
        next(err)
    }
}