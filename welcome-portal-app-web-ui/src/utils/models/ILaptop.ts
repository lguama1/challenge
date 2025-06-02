export interface IAssingLaptop {
    email: string;
    requestedSystem: string;
}

export interface  ILaptopInventory {
    deliveryDate: string | null;
    serialNumber: string;
    system: 'Windows' | 'macOS' | 'Linux';
    owner: string;
};
