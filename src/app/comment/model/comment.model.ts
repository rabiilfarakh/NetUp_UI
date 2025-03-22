import { User, UserRes } from "../../users/model/user.model";

export interface CommentDTOReq {
    description: string;
    date?: string; 
    article_id: number; 
    user_id: string;
}


export interface CommentDTORes {
    id: number;
    description: string;
    date: string;
    user: User
    
  }
  