import { CommunityDTORes } from "../../community/model/community.model";

export interface User {
    id: number;
    username: string;
    email: string;
    birthday: string;
    password: string;
    address: string;
    experience: string;
    location: string;
    photo: string;
    community: CommunityDTORes; 
  }

  export interface UserRes {
    id: number;
    username: string;
    email: string;
    community: CommunityDTORes; 
  }
