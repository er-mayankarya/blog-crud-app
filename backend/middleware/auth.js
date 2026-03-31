import jwt from 'jsonwebtoken';

const getTokenFromHeader = (authorization) => {
    if (!authorization) return null;
    return authorization.startsWith('Bearer ') ? authorization.slice(7) : authorization;
};

const auth = (req, res, next) => {
    const token = getTokenFromHeader(req.headers.authorization);

    try {
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'writer' || !decoded.writerId) {
            return res.status(403).json({ success: false, message: "Writer access required" });
        }

        req.writer = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Unauthorized access" });
    }
}

export default auth;
