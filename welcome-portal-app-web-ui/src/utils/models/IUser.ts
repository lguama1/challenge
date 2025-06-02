export interface IUser {
  id?: string;
  name: string;
  email: string;
  area: string;
  role: string;
  team?: string;
  status?: string;
  createdAt?: string;
}

export interface IUserAccess {
  email: string;
  requestedAccess: string[];
}

export interface IUserOptionAccess {
  label: string;
  value: string;
  isChecked: string;
}
