import { CommentDTORes } from "../../comment/model/comment.model";

export interface ArticleDTOReq {
  title: string;
  description: string;
  date: string; 
}

export interface ArticleDTORes {
  id: number;
  title: string;
  description: string;
  date: string;
  photo?: string | null; 
  user: {
    id: string;
    username: string;
    email: string;
    birthday: string;
    address: string;
    experience: number;
    location: string;
    photo: string;
    role: string;
    community: {
      id: number;
      name: string;
      description: string;
      quantity: number | null;
    };
  } | null;
  comments: CommentDTORes[]; 
}


