import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
     const token = req.cookies.token
     if (!token) {
          return res.status(401).json({ message: "No token provided" });
     }
     try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
          next();
     } catch (err) {
          return res.status(401).json({ message: "Invalid token" });
     }
}

export const authorizeAdmin = (req, res, next) => {
     if (req.user?.role !== 'admin') {
          return res.status(403).json({ message: "Admin access required" });
     }
     next();
}

export const authorizeOwnerOrAdmin = (req, res, next) => {
     if (req.user?.role === 'admin' || req.user?.id === req.params.userId) {
          next();
     } else {
          return res.status(403).json({ message: "Access denied" });
     }
};

