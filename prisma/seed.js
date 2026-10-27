import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

const ids = {
  admin: '11111111-1111-4111-8111-111111111111',
  user: '22222222-2222-4222-8222-222222222222',
  games: [
    '33333333-3333-4333-8333-333333333333',
    '44444444-4444-4444-8444-444444444444',
    '55555555-5555-4555-8555-555555555555',
  ],
  slots: [
    '66666666-6666-4666-8666-666666666666',
    '77777777-7777-4777-8777-777777777777',
    '88888888-8888-4888-8888-888888888888',
    '99999999-9999-4999-8999-999999999999',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  ],
  reservation: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
};

const games = [
  { id: ids.games[0], title: 'Xadrez', description: 'Partida de xadrez', duration_minutes: 60 },
  { id: ids.games[1], title: 'Dominó', description: 'Partida de dominó', duration_minutes: 60 },
  { id: ids.games[2], title: 'Uno', description: 'Partida de Uno', duration_minutes: 60 },
];

async function main() {
  const password_hash = await bcrypt.hash(process.env.SEED_PASSWORD ?? 'Gamood@123', 10);
  const today = new Date();

  await prisma.$transaction(async (tx) => {
    for (const user of [
      { id: ids.admin, email: 'admin@gamood.local', name: 'Admin', roles: ['ADMIN'] },
      { id: ids.user, email: 'usuario@gamood.local', name: 'Usuário', roles: ['USER'] },
    ]) {
      await tx.user.upsert({
        where: { id: user.id },
        update: {},
        create: { ...user, password_hash },
      });
    }

    for (const game of games) {
      await tx.game.upsert({ where: { id: game.id }, update: {}, create: game });
    }

    for (const [index, id] of ids.slots.entries()) {
      const start_time = new Date(Date.UTC(
        today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + index + 1, 14,
      ));
      const end_time = new Date(start_time.getTime() + 60 * 60 * 1000);
      await tx.timeSlot.upsert({
        where: { id },
        update: {},
        create: { id, start_time, end_time, status: index === 0 ? 'BOOKED' : 'AVAILABLE' },
      });
    }

    await tx.reservation.upsert({
      where: { id: ids.reservation },
      update: {},
      create: {
        id: ids.reservation,
        userId: ids.user,
        gameId: ids.games[0],
        timeSlotId: ids.slots[0],
        status: 'CONFIRMED',
      },
    });
  });

  console.log('Seed concluído: 2 usuários, 3 jogos, 5 slots e 1 reserva.');
}

main()
  .catch((error) => {
    console.error('Falha ao executar o seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
