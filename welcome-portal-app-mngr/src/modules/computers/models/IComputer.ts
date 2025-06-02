export interface IComputer {
    id: string
    serialNumber: string
    operatingSystem: string
    createdAt: Date
} 

export interface IComputerAssignment {
    id: string
    computerId: string
    deliveredAt?: Date
    userId: string
}