import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, updateRole, deleteUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.patch('/:id/role', updateRole);
router.delete('/:id', deleteUser);

export default router;
