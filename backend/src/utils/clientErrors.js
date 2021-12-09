export class ClientError extends Error {
  constructor(message = 'Bad request', status = 400) {
    super(message);
    this.status = status;
  }
}

export const ErrorMessages = {
  WRONG_CRED: 'You provided wrong credentials',
  INTERNAL: 'Something went wrong, try again later',
  NO_USER: 'No user with that id',
  NO_PRODUCT: 'No product with that id',
  NO_ORDER: 'No order',
};
