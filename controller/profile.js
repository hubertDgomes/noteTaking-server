import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userSchema from '../model/user.js';

const signUpController = async (req, res) => {
    const { name, email, password, interests } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const exists = await userSchema.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'The email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userSchema.create({
            name,
            email,
            password: hashedPassword,
            interests: interests || [],
            role: 'user'
        });

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        return res.status(201).json({
            message: 'Signup completed successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                interests: newUser.interests
            }
        });
    } catch (err) {
        console.error('LOGIN_ERROR:', err);
        return res.status(500).json({ message: err.message });
    }
};

const logInController = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing' });
        }

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );

        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                interests: user.interests
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getProfileController = async (req, res) => {
    try {
        const user = await userSchema.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Profile fetched successfully',
            user
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export {
    signUpController,
    logInController,
    getProfileController
};