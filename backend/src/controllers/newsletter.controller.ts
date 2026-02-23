import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export async function subscribe(req: Request, res: Response): Promise<void> {
  const { email } = req.body;

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (existing) {
    if (!existing.active) {
      await prisma.newsletterSubscriber.update({ where: { email }, data: { active: true } });
      res.json({ success: true, message: 'Resubscribed successfully' });
      return;
    }
    res.json({ success: true, message: 'Already subscribed' });
    return;
  }

  await prisma.newsletterSubscriber.create({ data: { email } });
  res.status(201).json({ success: true, message: 'Subscribed successfully' });
}

export async function getSubscribers(_req: Request, res: Response): Promise<void> {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: subscribers });
}
