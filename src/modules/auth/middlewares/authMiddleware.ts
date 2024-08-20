import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../../config/data-source';
import { User } from '../interfaces';



const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  // console.log(token)

  if (!token) {
    return res.status(401).send('Access token is missing or invalid');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string; tenant: string };
    res.locals.userId = decoded.userId;
    res.locals.tenant = decoded.tenant;
    // console.log(decoded)
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
};
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['user-id']; // O cualquier otra forma de obtener el ID del usuario
  if (!userId) return res.status(401).json({ message: 'User ID required' });

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { id: userId.toString() },
    relations: ['roles', 'roles.permissions'],
  });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  req.user = user;
  next();
};