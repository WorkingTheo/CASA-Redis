import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    encrypted?: any;
  }
}
