import UserModel from "../models/UserModel.js";
import { getUserByEmail, getUserById } from "./UserController.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js'
import RefreshTokenModel from "../models/RefreshTokenModel.js";

export const register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const createdUser = await UserModel.create({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            role: 'user'
        })

        const accessToken = jwt.sign({id: createdUser.id}, config.ACCESS_TOKEN_SECRET, {
            expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME
        })

        const refreshToken = jwt.sign({id: user.id}, config.REFRESH_TOKEN_SECRET, {
            expiresIn: config.REFRESH_TOKEN_EXPIRE_TIME
        })

        await RefreshTokenModel.create({ token: refreshToken })

        return res.status(200).json({
            message: 'User added correctly!',
            accessToken,
            refreshToken
        })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
        // 1. Find typed email in database
        const user = await getUserByEmail(req.body.email)

        if(!user) return res.status(400).json({
            message: 'User not found'
        })

        // 2. Compare passwords
        const passwordsCompared = await bcrypt.compare(req.body.password, user.password);
        
        if(!passwordsCompared) {
            return res.status(401).json({ message: 'Email found but password is wrong'})
        }
        
        // 3. Create Access token & Refresh token
        const accessToken = jwt.sign(user, config.ACCESS_TOKEN_SECRET, {
            expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME
        });
        
        const refreshToken = jwt.sign({id: user.id}, config.REFRESH_TOKEN_SECRET, {
            expiresIn: config.REFRESH_TOKEN_EXPIRE_TIME
        })

        res.cookie('refresh_token', refreshToken, { httpOnly: true })

        // 4. Store refresh token in the database
        await RefreshTokenModel.create({ token: refreshToken })

        return res.status(200).json({
            message: 'Successful login!',
            accessToken
        });

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
    
}

export const validateRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies['refresh_token'];

        if(refreshToken == null) return res.status(400).json({ message: 'Refresh token not provided'})

        const tokenInDb = await RefreshTokenModel.findOne({ where: { token: refreshToken } })

        if(!(tokenInDb)) return res.status(400).json({ message: 'Refresh token not found in DB'})

        jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, async (error, decodedToken) => {
            if(error) return res.status(403).json('Error validating refresh token')

            const user = await getUserById(decodedToken.id)
        
            const accessToken = jwt.sign(user, config.ACCESS_TOKEN_SECRET, {
                expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME
            });
    
            return res.status(200).json({accessToken});
        })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const deleteRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies['refresh_token'];

        console.log('logout: ', req.cookies)

        if(refreshToken == null) return res.status(400).json({ message: 'Refresh token not provided'})

        const deletedRows = await RefreshTokenModel.destroy({ where: { token: refreshToken } })

        if(deletedRows < 1) return res.status(400).json({ message: 'Refresh token not found or not deleted'})

        res.status(200).json({
            message: 'Logout successful.'
        })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}