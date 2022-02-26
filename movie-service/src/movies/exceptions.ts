import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";

import { BASIC_USER_MOVIE_ADD_LIMIT } from '../common';
import { AuthUser } from './../auth/interfaces';

export class MovieAddLimitReachedException extends ForbiddenException {
  constructor(user: AuthUser) {
    super(`${user.name} reached the monthly limit, ${user.role} users monthly limit: ${BASIC_USER_MOVIE_ADD_LIMIT}`);
  }
}

export class MovieNotFoundException extends NotFoundException {
  constructor() {
    super('Movie is not found.');
  }
}

export class MovieAlreadyExistsException extends BadRequestException {
  constructor() {
    super('Movie is already exists.');
  }
}