import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const MongoDBConfig = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    uri:
      configService.get<string>('MONGODB_URI') ||
      'mongodb://localhost:27017/exam-system',
  }),
});
