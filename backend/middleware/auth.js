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

        if (!decoded.userId || decoded.accountType !== 'author') {
            return res.status(403).json({ success: false, message: "Author access required" });
        }

        req.writer = decoded;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Unauthorized access" });
    }
}

export default auth;
