import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/server/db/prisma';
import ChallengesClient from '@/components/pages/ChallengesClient';
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
      }
    }
  });
}

async function getChallenges() {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await db.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) return [];

  // Obtener todos los challenges activos
  const challenges = await db.challenge.findMany({
    where: { 
      active: true,
      OR: [
        { startDate: null },
        { startDate: { lte: new Date() } }
      ],
      AND: [
        {
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } }
          ]
        }
      ]
    },
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  // Obtener el progreso del usuario en estos challenges
  const userChallenges = await db.userChallenge.findMany({
    where: { 
      userId: user.id,
      challengeId: { in: challenges.map(c => c.id) }
    }
  });

  // Combinar challenges con progreso del usuario
  return challenges.map(challenge => {
    const userProgress = userChallenges.find(uc => uc.challengeId === challenge.id);
    
    return {
      ...challenge,
      requirements: challenge.requirements as Record<string, unknown>,
      userProgress: userProgress ? {
        progress: userProgress.progress,
        target: userProgress.target,
        completed: userProgress.completed,
        completedAt: userProgress.completedAt,
        progressData: userProgress.progressData as Record<string, unknown>
      } : null
    };
  });
}

export default async function ChallengesPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }

  const challenges = await getChallenges();

  return (
    <ChallengesClient 
      user={user as unknown as PrismaUser} 
      challenges={challenges}
    />
  );
}
