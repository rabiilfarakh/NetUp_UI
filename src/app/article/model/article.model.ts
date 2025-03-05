// DTO pour la requête (envoyée au serveur)
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
}