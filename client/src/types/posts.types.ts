export interface CreatePostDTO {
  title: string;
  description: string;
}

export interface PostDTO {
  id: string;
  title: string;
  description: string;
  place_id: string;
  creator_id: string;
  is_liked_by_user: boolean;
  comments_count: number;
  like_count: number;
  creator_first_name: string;
  creator_last_name: string;
}
