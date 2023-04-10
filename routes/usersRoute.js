const { register, login, setAvatar, getAllUsers } = require("../controller/usersController")

const router = require("express").Router()

router.post("/auth/register", register)
router.post("/auth/login", login)
router.post("/setAvatar/:id", setAvatar)
router.get("/getAllUsers", getAllUsers)

module.exports = router