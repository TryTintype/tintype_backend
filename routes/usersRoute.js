const router = require("express").Router()
const { register, login, setAvatar, getAllUsers, getUser } = require("../controller/usersController")


router.post("/auth/register", register)
router.post("/auth/login", login)
router.post("/setAvatar/:id", setAvatar)
router.get("/getAllUsers", getAllUsers)
router.post("/getUser/:email", getUser)

module.exports = router