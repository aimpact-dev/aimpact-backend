import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { google } from 'googleapis';
import { analyticsEnvConfig } from 'src/shared/config';
import { UserGradeDto } from './dto/userGrade.dto';
import { UserGrade } from 'src/entities/user-grade.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnalyticsService {
  private sheets;
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @Inject(analyticsEnvConfig.KEY) private readonly analyticsConfig: ConfigType<typeof analyticsEnvConfig>,
    @InjectRepository(UserGrade)
    private userGradeRepository: Repository<UserGrade>,
  ) {
    // this.initializeGoogleSheets();
  }
  
  private async initializeGoogleSheets() {
    try {
      const credentials = JSON.parse(
        this.analyticsConfig.GOOGLE_SERVICE_ACCOUNT_KEY || "",
      );

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
    } catch (error) {
      this.logger.error('Failed to initialize Google Sheets API', error);
      throw new Error('Google Sheets initialization failed');
    }
  }

  async saveToSheets(wallet: string, dto: UserGradeDto) {
    const sheetId = this.analyticsConfig.GOOGLE_SHEET_ID;
    const range = this.analyticsConfig.GOOGLE_SHEET_RANGE;
    try {
      const timestamp = new Date().toISOString();
      const values = [[wallet, dto.grade, timestamp]];

      await this.sheets.spreadsheets.values.append({
        sheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
    } catch (error) {
      this.logger.error('Failed to write to Google Sheets', error);
    }
  }

  async writeUsersGrade(userId: string, dto: UserGradeDto) {
    console.log(dto, userId)
    const userGrade = this.userGradeRepository.create({ 
      grade: dto.grade,
      userId,
    });
    console.log(await this.userGradeRepository.save(userGrade));

    return;
  }
}
