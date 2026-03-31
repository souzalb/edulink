import { NextResponse } from 'next/server';
import { PlanType, FiaaStatus, ReferralType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash('123456', 10);

    const docente = await prisma.user.upsert({
      where: { email: 'docente@senai.br' },
      update: {},
      create: {
        email: 'docente@senai.br',
        name: 'Professor Silva',
        password: passwordHash,
        role: 'DOCENTE',
      },
    });

    const opp = await prisma.user.upsert({
      where: { email: 'opp@senai.br' },
      update: {},
      create: {
        email: 'opp@senai.br',
        name: 'Orientador Oliveira',
        password: passwordHash,
        role: 'OPP',
      },
    });

    const aqv = await prisma.user.upsert({
      where: { email: 'aqv@senai.br' },
      update: {},
      create: {
        email: 'aqv@senai.br',
        name: 'Analista Santos',
        password: passwordHash,
        role: 'AQV_OE',
      },
    });

    const classTDS01 = await prisma.class.upsert({
      where: { id: 'class-tds01-123' },
      update: {},
      create: { id: 'class-tds01-123', name: 'TDS-01' },
    });

    const classELET02 = await prisma.class.upsert({
      where: { id: 'class-elet02-123' },
      update: {},
      create: { id: 'class-elet02-123', name: 'ELET-02' },
    });

    const pedro = await prisma.student.upsert({
      where: { id: 'st-pedro-123' },
      update: {},
      create: { id: 'st-pedro-123', name: 'PEDRO HENRIQUE', classId: classTDS01.id },
    });

    const maria = await prisma.student.upsert({
      where: { id: 'st-maria-123' },
      update: {},
      create: { id: 'st-maria-123', name: 'MARIA EDUARDA', classId: classTDS01.id },
    });

    const joao = await prisma.student.upsert({
      where: { id: 'st-joao-123' },
      update: {},
      create: { id: 'st-joao-123', name: 'JOAO VITOR', classId: classELET02.id },
    });

    const existingFiaa = await prisma.fIAA.findFirst();
    if (!existingFiaa) {
      await prisma.fIAA.create({
        data: {
          studentId: pedro.id,
          teacherId: docente.id,
          status: FiaaStatus.DRAFT,
          diffAttendance: true,
          actAdviseAttendance: true,
        },
      });
      await prisma.fIAA.create({
        data: {
          studentId: maria.id,
          teacherId: docente.id,
          status: FiaaStatus.PENDING_OPP,
          diffWorkQuality: true,
          actAdviseStudy: true,
        },
      });
      await prisma.fIAA.create({
        data: {
          studentId: pedro.id,
          teacherId: docente.id,
          status: FiaaStatus.CLOSED,
          diffKnowledge: true,
          actAdviseRetest: true,
          provMakeupPlan: true,
          provRecoveryPlanAuth: true,
          recoveryPlans: {
            create: {
              type: PlanType.RECOVERY,
              coordAuth: true,
              studentAwareness: true,
              planSatisfactory: true,
              schedules: {
                create: [
                  {
                    date: new Date('2026-04-10'),
                    time: '14:00',
                    classesNum: 2,
                    content: 'Revisão Lógica de Programação',
                    teachingStrategy: 'Exercícios Práticos',
                  },
                ],
              },
            },
          },
        },
      });
    }

    return NextResponse.json({ message: 'Seeded successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
