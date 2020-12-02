import { User } from './User';

export class Post {
  id = 0;
  owner_id = 0;
  title = '';
  content = '';
  read_count = 0;
  comment_count = 0;
  created_at = '';
  owner: User = new User();
}