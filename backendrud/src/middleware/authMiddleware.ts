import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
	user?: string | JwtPayload;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1]; 

	if (!token) {
		res.status(401).json({ message: 'Token missing' });
		return;
	}

	const secret = process.env.JWT_SECRET;
	if (!secret) {
		res.status(500).json({ message: 'JWT secret not configured' });
		return;
	}

	jwt.verify(token, secret, (err, decoded) => {
		if (err) {
			res.status(403).json({ message: 'Token is not valid' });
			return;
		}

		req.user = decoded;
		next();
	});
};

export default authenticateToken;
