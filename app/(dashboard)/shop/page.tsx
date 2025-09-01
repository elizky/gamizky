import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/server/db/prisma';
import ShopClient from '@/components/pages/ShopClient';
import type { PrismaUser } from '@/types/prisma';

async function getUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  return await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      skills: true,
      characters: {
        include: { character: true }
      },
      rewards: {
        include: { reward: true }
      }
    }
  });
}

async function getRewards() {
  return await db.reward.findMany({
    where: { available: true },
    orderBy: [
      { rarity: 'desc' },
      { cost: 'asc' }
    ]
  });
}

async function getCharacters() {
  return await db.character.findMany({
    orderBy: { cost: 'asc' }
  });
}

export default async function ShopPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }

  const rewards = await getRewards();
  const characters = await getCharacters();

  return (
    <ShopClient 
      user={user as unknown as PrismaUser} 
      rewards={rewards}
      characters={characters}
    />
  );
}
