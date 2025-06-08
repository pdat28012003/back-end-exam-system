import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDBConfig } from './database/mongodb.config';
import { DatabaseService } from './database/database.service';
import { SeedService } from './database/seed.service';
import {
  User,
  UserSchema,
  Exam,
  ExamSchema,
  Question,
  QuestionSchema,
  Submission,
  SubmissionSchema,
  Notification,
  NotificationSchema,
  ExamStatistics,
  ExamStatisticsSchema,
} from './database/schemas';

// Import các module
import { UsersModule } from './users/users.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ExamStatisticsModule } from './exam-statistics/exam-statistics.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoDBConfig,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Exam.name, schema: ExamSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Submission.name, schema: SubmissionSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: ExamStatistics.name, schema: ExamStatisticsSchema },
    ]),
    // Đăng ký các module
    UsersModule,
    ExamsModule,
    QuestionsModule,
    SubmissionsModule,
    NotificationsModule,
    ExamStatisticsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, SeedService],
})
export class AppModule {}
