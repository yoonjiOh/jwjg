// Auth related errors
export class EmailAlreadyExistError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmailAlreadyExistError';
  }
}

export class WrongEmailError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WrongEmailError';
  }
}

export class WrongPasswordFormatError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WrongPasswordFormatError';
  }
}
