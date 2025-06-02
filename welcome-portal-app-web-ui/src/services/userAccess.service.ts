import axios from 'axios';
import { IUserAccess } from '@utils/models/IUser';

export class UserAccessService {
    static async postUserAccess(body: IUserAccess, rquuid: string): Promise<any> {
        const path = process.env.NEXT_PUBLIC_API_URL;
        const headers = {
            'X-RqUID': rquuid,
            'Content-Type': 'application/json'
        }
        try {
            const response = await axios.post(`${path}v1/access-requests`, body, {
                headers
            });
            return response;
        } catch (error: any) {
            throw error;
        }
    }
}