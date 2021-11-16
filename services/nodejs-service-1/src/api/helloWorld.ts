import { Request, Response } from 'express';
import { startTracingSpan } from '@vestico/service-utils';

export const getWorld = async (req: Request, res: Response) => {
  const span = startTracingSpan('hello-world');

  res.status(200).send('world');

  span.end();
  return Promise.resolve();
};
