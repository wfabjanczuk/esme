import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const Different =
  (property: string, validationOptions?: ValidationOptions) =>
  (object: any, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: DifferentConstraint,
    });

@ValidatorConstraint({ name: 'Different' })
export class DifferentConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value !== relatedValue;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { property, constraints } = validationArguments;
    return `${property} must be different from ${constraints[0]}`;
  }
}
