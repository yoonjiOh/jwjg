import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  // eslint-disable-next-line prettier/prettier
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    nickname?: string;
    intro?: string;
    profileImageUrl?: string;
  }
}
