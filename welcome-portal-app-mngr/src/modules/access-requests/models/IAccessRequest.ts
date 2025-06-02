export enum RequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
  }
  
export interface IAccessRequest {
  id: string;
  userId: string;
  requestedAccess: string[];
  team: string;
  status: RequestStatus;
  createdAt: Date;
} 

export interface IAccessRequestResponse {
  id: string;
  userId: string;
  email: string;
  requestedAccess: string[];
  team: string;
  status: RequestStatus;
  createdAt: Date;
} 