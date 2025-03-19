import { UserRes } from "../../users/model/user.model";

export interface Rencontre {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    creator: UserRes;
    participants: Participant[];
}

export interface Participant {
    id: number;
    user: UserRes;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
  
  export interface RencontreRequest {
    creatorId: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  }