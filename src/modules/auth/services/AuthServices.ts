import { AppDataSource } from "../../../config";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';


type AuthServiceType = {
    singIn: (emailAndUser:string,password:string, tenant: string) => Promise<string>,
    singUp: () => void,
    forgotePassword : () => void,
    token : () => void

}


let AuthService:AuthServiceType = {
    singIn: async function (emailAndUser: string, password: string, tenant: string): Promise<string> {
        const queryRunner = AppDataSource.createQueryRunner();
  
        try {
            await queryRunner.connect();
            const result = await queryRunner.query(`SELECT * FROM "${tenant}".users WHERE username = $1 OR email = $1 `, [emailAndUser]);
        
            if (result.length === 0) {
             throw new Error('Invalid credentials user not found');
            }
        
            const user = result[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
        
            if (!passwordMatch) {
              throw new Error('Invalid credentials password mismatch');
            }
            const token = jwt.sign({ userId: user.id, tenant }, SECRET_KEY, { expiresIn: '1h' });
           return  token
        } catch (error) {
            throw new Error('Invalid credentials password mismatch');
        }
    },
    singUp: function (): void {
        throw new Error("Function not implemented.");
    },
    forgotePassword: function (): void {
        throw new Error("Function not implemented.");
    },
    token: function (): void {
        throw new Error("Function not implemented.");
    }
} 





export default AuthService