const router = require("express").Router()
const {
    createRoom,
    addMemberToProject,
    removeMemberFromProject,
    inviteUsersToRoom,
    getAllMembersOfGroup
} = require("../controller/chatRoomController")

router.post('/chat-room', createRoom);
// router.get('/chat-room/:id', getRoom);
router.get('/chat-room/:id/members', getAllMembersOfGroup);
router.put('/chat-room/:id/add-member', addMemberToProject);
router.post('/chat-room/:id/invite-users', inviteUsersToRoom);
router.put('/chat-room/:id/remove-member', removeMemberFromProject);
