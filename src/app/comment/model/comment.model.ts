
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
    articleDTOCom: {
      id: number;
     
      user: {
        id: number;
        username: string;
        photo: string;
      
      }
    }
  }
  