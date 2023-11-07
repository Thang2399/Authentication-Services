import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGOOSE_CONNECTION)],
  providers: [],
})
export class MongoModule {}
