import config from '../config.js';
import UserModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];

        if(!token) return res.status(403).json({ message: 'No token provided.' })

        const decodedToken = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

        req.userId = decodedToken.id;

        const user = await UserModel.findOne({ where: { id: req.userId } });

        if(!user) return res.status(404).json({ message: 'User not found '})

        next()
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ where: { id: req.userId } });

        if (user.role !== 'admin') return res.status(401).json({ message: 'User role not authorized '})

        next()
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const checkDuplicateEmail = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ where: { email: req.body.email } });

        if(user) return res.status(400).json({ message: 'An user with that email exists already. '})

        next()
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}