export interface IHistoryResponse {
  owner: string;
  typeOfRequest: string;
  createdAt: Date;
  status: string;
  userId: string;
  id: string;
}

export interface GetAllHistoryOptions {
  team: string;
}
