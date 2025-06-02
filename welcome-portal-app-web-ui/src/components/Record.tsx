'use client';
import React, { useEffect, useState } from 'react';
import { RecordService } from '@services/record.service';
import { COL_RECORD } from '@utils/constants';


export const Record: React.FC = () => {
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        const fetchRecordData = async () => {
            try {
            const response = await RecordService.getRecords();
            setRows(response);
            } catch (error) {
                console.error('Error al obtener el historial de las transacciones:', error);
            }
        };
        fetchRecordData();
    }, []);

    return (
        <div style={{ paddingBottom:'120px' }}>
            <div className='sp-text-heading-5 title-form'>
                Historial de transacciones
            </div>
            <div className="container-form">
                <sp-ml-dynamic-table
                    column-table={JSON.stringify(COL_RECORD)}
                    row-table={JSON.stringify(rows)}
                ></sp-ml-dynamic-table>
            </div>
        </div>
    );
};
