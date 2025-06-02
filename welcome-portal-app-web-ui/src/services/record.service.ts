import axios from 'axios';
import { IRecord } from '@utils/models/IRecord';
import FormatData from '@utils/formatData';

export class RecordService {
    static async getRecords() {
        const path = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await axios.get<IRecord[]>(`${path}v1/history/requests`);
            const data = response.data;

            const formattedRows = data.map(item => ({
                'Fecha de solicitud': FormatData.formatDate(item.createdAt),
                'Colaborador': item.owner.split('@')[0],
                'Solicitud': FormatData.requestTypeMapping(item.typeOfRequest),
                'Estado': FormatData.statusMapping(item.status),
                'Detalles': 'Ver más ›'
            }));

            return formattedRows;
        } catch (error: any) {
            throw error;
        }
    }
}