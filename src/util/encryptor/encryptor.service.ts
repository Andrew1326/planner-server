import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

interface IHashPayload {
  plainStr: string;
  saltRounds: number;
}

interface IComparePayload {
  plainStr: string;
  hash: string;
}

@Injectable()
export class EncryptorService {
  constructor() {}

  // method creates hash from plain string
  async hash({ plainStr, saltRounds }: IHashPayload): Promise<string> {
    return bcrypt.hash(plainStr, saltRounds);
  }

  // function compares hashed string with plain
  async compare({ plainStr, hash }: IComparePayload): Promise<boolean> {
    return bcrypt.compare(plainStr, hash);
  }
}
