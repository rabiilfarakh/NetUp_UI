export interface CommentDTOReq {
    description: string;
    date: string;
    articleId: number;
  }

  export interface CommentDTORes {
  id: number;        
  description: string; 
  date: string;       
  article: {          
    id: number;
    photo: string; 
    title: string;
  };
  user: {             
    id: string;
    username: string;
    photo: string;    
  };
}

