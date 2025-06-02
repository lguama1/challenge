import axios from 'axios';
import FormatData from '@utils/formatData';
import { IAssingLaptop, ILaptopInventory } from '@utils/models/ILaptop';

export class AssingLaptopService {
    static async assingLaptop(body: IAssingLaptop, rquuid: string): Promise<any> {
        const path = process.env.NEXT_PUBLIC_API_URL;
        const headers = {
            'X-RqUID': rquuid,
            'Content-Type': 'application/json'
        }
        try {
            const response = await axios.post(`${path}v1/computer-requests`, body, {
                headers
            });
            return response;
        } catch (error: any) {
            throw error;
        }
    }

    static async getLaptopInventory() {
        const path = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await axios.get<ILaptopInventory[]>(`${path}v1/computers/team`);
            const data = response.data;

            const formattedRows = data.map(item => ({
                'Colaborador': item.owner.split('@')[0],
                'Equipo': item.system,
                'Número de serie': item.serialNumber,
                'Fecha de entrega': FormatData.formatDate(item.deliveryDate)
            }));

            return formattedRows;
        } catch (error: any) {
            throw error;
        }
    }
}