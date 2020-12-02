export class User {
  id = 0;
  name = '';
  created_at = '';
  rank?: string;

  get nameWithRank(): string {
    return this.rank || '';
  }
}