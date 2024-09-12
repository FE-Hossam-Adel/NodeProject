// routes/userRoutes.js
import express from 'express';
import User from '../../../DB/models/User.js';
import { userSchema } from './ex-prod.joi.js';
import Joi from 'joi';
import { validation } from '../../middlewares/validator.mw.js';

const router = express.Router();


router.post('/test', validation(userSchema), async (req, res) => {
    try { 
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
