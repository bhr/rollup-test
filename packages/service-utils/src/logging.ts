/* eslint-disable prefer-spread */
import { LoggingWinston } from '@google-cloud/logging-winston';
import { transports as wtransports, format, createLogger } from 'winston';

const isProduction = process.env.NODE_ENV === 'production' && process.env.COLD_START_TEST !== 'true';
const transports = isProduction
  ? [
      new LoggingWinston({
        resource: {
          type: 'cloud_run_revision',
          labels: {
            configuration_name: process.env.K_CONFIGURATION!,
            location: process.env.K_LOCATION!,
            revision_name: process.env.K_REVISION!,
            service_name: process.env.K_SERVICE!,
          },
        },
        serviceContext: {
          service: process.env.K_SERVICE!,
          version: process.env.K_REVISION!,
        },
      }),
    ]
  : [
      new wtransports.Console({
        level: 'debug',
        format: format.combine(format.colorize(), format.simple()),
      }),
    ];

export const logger = createLogger({
  level: 'debug',
  transports,
});

export const initLogging = () => {
  // Override the base console log with winston
  console.log = (...args: any[]) => {
    return logger.info.apply(logger, [...args] as any);
  };

  console.error = (err: Error | string) => {
    if (isProduction) {
      if (err instanceof Error) {
        return logger.error('', err);
      }
      return logger.error('', new Error(err));
    }

    if (err instanceof Error) {
      return logger.error(err.message);
    }
    return logger.error(err);
  };

  console.warn = (...args: any[]) => {
    return logger.warn.apply(logger, [...args] as any);
  };

  console.info = (...args: any[]) => {
    return logger.info.apply(logger, [...args] as any);
  };

  console.debug = (...args: any[]) => {
    return logger.debug.apply(logger, [...args] as any);
  };
};
