import axios from 'axios';
import { IUser } from '@utils/models/IUser';
import FormatData from '@utils/formatData';

export class UserService {
    static async postUser(body: IUser, rquuid: string): Promise<any> {
        const path = process.env.NEXT_PUBLIC_API_URL;
        const headers = {
            'X-RqUID': rquuid,
            'Content-Type': 'application/json'
        }
        const formattedBody: IUser = {
            name: FormatData.formatTitleCase(body.name),
            email: body.email.toLowerCase(),
            area: FormatData.formatTitleCase(body.area),
            role: body.role
        }
        try {
            const response = await axios.post(`${path}v1/user-requests`, formattedBody, {
                headers
            });
            return response;
        } catch (error: any) {
            throw error;
        }
    }

    static async getUser(): Promise<any> {
        const path = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await axios.get<IUser[]>(`${path}v1/users`);
            const data = response.data;

            const user = data.map(item => ({
                'text': item.email,
                'value': item.id,
                'shortText': item.role
            }));

            return user;
        } catch (error: any) {
            throw error;
        }
    }
}
