export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface IUserRequest {
  id: string;
  name: string;
  email: string;
  area: string;
  role: string;
  team: string;
  status: RequestStatus;
  createdAt: Date;
}

export interface CreateUserRequestDTO {
  name: string;
  email: string;
  area: string;
  role: string;
  team: string;
}

export interface GetAllUserRequestsOptions {
  team: string;
}

export interface UpdateUserRequestStatusDTO {
  id: string;
  status: 'approved' | 'rejected';
}