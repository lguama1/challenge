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

export interface GetAllComputerUsersOptions {
    team: string;
  }
  
export interface ComputerAssignmentResult {
  owner: string;
  serialNumber: string;
  system: string;
  deliveryDate: Date | null;
}