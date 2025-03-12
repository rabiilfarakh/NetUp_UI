
export interface CommentDTOReq {
    description: string;
    date?: string; 
    article_id: number; 
}

export interface CommentDTORes {
    id: number;
    description: string;
    date: string;
}