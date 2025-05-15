import { Test, TestingModule } from '@nestjs/testing';
import { DeployAppController } from './deploy-app.controller';

describe('DeployAppController', () => {
  let controller: DeployAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeployAppController],
    }).compile();

    controller = module.get<DeployAppController>(DeployAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
