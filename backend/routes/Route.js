import express from 'express';
import { deleteUser, editUser, registerUser, showAllUser, userLogin } from '../controller/userController.js';

const router = express.Router();

router.get("/users", showAllUser);

router.post("/login", userLogin);
router.post("/register", registerUser);

router.put("/user/:id", editUser);

router.delete("/user/:id", deleteUser);

export default router;