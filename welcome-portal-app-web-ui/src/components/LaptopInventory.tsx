'use client';
import React, { useEffect, useState } from 'react';
import { AssingLaptopService } from '@services/assingLaptop.service';
import { COL_LAPTOP_INVENTORY } from '@utils/constants';

export const LaptopInventory: React.FC = () => {
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
            const response = await AssingLaptopService.getLaptopInventory();
            setRows(response);
            } catch (error) {
                console.error('Error al obtener el inventario:', error);
            }
        };
        fetchInventoryData();
    }, []);

    return (
        <div style={{ paddingBottom:'120px', paddingTop:'45px' }}>
            <div className="container-form">
                <sp-ml-dynamic-table
                    column-table={JSON.stringify(COL_LAPTOP_INVENTORY)}
                    row-table={JSON.stringify(rows)}
                ></sp-ml-dynamic-table>
            </div>
        </div>
    );
};