import { Test, TestingModule } from '@nestjs/testing';
import { DeployAppService } from './deploy-app.service';

describe('DeployAppService', () => {
  let service: DeployAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeployAppService],
    }).compile();

    service = module.get<DeployAppService>(DeployAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
