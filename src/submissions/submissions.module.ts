import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from '../database/schemas/submission.schema';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { ExamsModule } from '../exams/exams.module';
import { UsersModule } from '../users/users.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }]),
    ExamsModule,
    UsersModule,
    QuestionsModule,
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}