export interface ResearchDto{
    _id:string,
    title: string;
    abstract: string;
    description: string;
    author: string;
    image: string;
    rating:number,
    source: string;
    createdAt:Date,
    isRating?:boolean
}
