import jwt from 'jsonwebtoken';

const getTokenFromHeader = (authorization) => {
    if (!authorization) return null;
    return authorization.startsWith('Bearer ') ? authorization.slice(7) : authorization;
};

const userAuth = (req, res, next) => {
    const token = getTokenFromHeader(req.headers.authorization);

    try {
        if (!token) {
            return res.status(401).json({ success: false, message: "Please login to continue" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'user' || !decoded.userId) {
            return res.status(403).json({ success: false, message: "User access required" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Please login to continue" });
    }
};

export default userAuth;
