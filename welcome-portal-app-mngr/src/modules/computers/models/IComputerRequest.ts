export enum RequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
  }
  
export interface IComputerRequest {
  id: string;
  userId: string;
  requestedSystem: string;
  team: string;
  status: RequestStatus;
  createdAt: Date;
} 

export interface IComputerRequestResponse {
    id: string;
    userId: string;
    email:string;
    requestedSystem: string;
    team: string;
    status: RequestStatus;
    createdAt: Date;
  } 