import { UserRes } from "../../users/model/user.model";

export interface Rencontre {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    creator: UserRes;
    participants: UserRes[];
  }
  
  export interface RencontreRequest {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  }