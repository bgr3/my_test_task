import { validateSync } from 'class-validator';

export const configValidationUtility = {
  validateConfig: (config: any) => {
    const errors = validateSync(config);

    if (errors.length > 0) {
      const sortedMessages = errors
        .map((error) => {
          const currentValue = error.value;
          const constraints = Object.values(error.constraints || {}).join(', ');
          return `${constraints} (current value: ${currentValue})`;
        })
        .join('; ');
      throw new Error('Validation AppCoreConfig failed: ' + sortedMessages);
    }
  },

  errorString(env) {
    return `environment variable ${env} is not defined`;
  },
};
