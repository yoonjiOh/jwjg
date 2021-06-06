// Auth related errors
export class EmailAlreadyExistError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmailAlreadyExistError';
  }
}

export class WeakPasswordError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WeakPasswordError';
  }
}
