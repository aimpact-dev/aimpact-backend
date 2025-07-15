import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { rankingPoints } from 'src/api/leaderboard/utils/rank-system';

export function PointsValid(opts?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      name: 'PointsValid',
      target: target.constructor,
      propertyName,
      constraints: [],
      options: opts,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const rule = rankingPoints[obj.eventType];
          if (typeof rule === 'number') {
            return value == null;
          }
          const [min, max] = rule as number[];
          return typeof value === 'number' && value >= min && value <= max;
        },
        defaultMessage(args: ValidationArguments) {
          const obj = args.object as any;
          const rule = rankingPoints[obj.eventType];
          if (typeof rule === 'number') {
            return 'points must be omitted';
          }
          const [min, max] = rule as number[];
          return `points must be between ${min} and ${max}`;
        },
      },
    });
  };
}
