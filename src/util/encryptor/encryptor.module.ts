import { Module } from '@nestjs/common';
import { EncryptorService } from './encryptor.service';

@Module({
  providers: [EncryptorService],
})
export class EncryptorModule {}
