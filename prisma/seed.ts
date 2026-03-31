import { PrismaClient, PlanType, FiaaStatus, ReferralType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Users
  const passwordHash = await bcrypt.hash('123456', 10)

  const docente = await prisma.user.upsert({
    where: { email: 'docente@senai.br' },
    update: {},
    create: {
      email: 'docente@senai.br',
      name: 'Professor Silva',
      password: passwordHash,
      role: 'DOCENTE',
    },
  })

  const opp = await prisma.user.upsert({
    where: { email: 'opp@senai.br' },
    update: {},
    create: {
      email: 'opp@senai.br',
      name: 'Orientador Oliveira',
      password: passwordHash,
      role: 'OPP',
    },
  })

  const aqv = await prisma.user.upsert({
    where: { email: 'aqv@senai.br' },
    update: {},
    create: {
      email: 'aqv@senai.br',
      name: 'Analista Santos',
      password: passwordHash,
      role: 'AQV_OE',
    },
  })

  // 2. Create Classes
  const classTDS01 = await prisma.class.create({
    data: { name: 'TDS-01' },
  })
  const classELET02 = await prisma.class.create({
    data: { name: 'ELET-02' },
  })

  // 3. Create Students
  const pedro = await prisma.student.create({
    data: { name: 'PEDRO HENRIQUE', classId: classTDS01.id },
  })
  const maria = await prisma.student.create({
    data: { name: 'MARIA EDUARDA', classId: classTDS01.id },
  })
  const joao = await prisma.student.create({
    data: { name: 'JOAO VITOR', classId: classELET02.id },
  })

  // 4. Create FIAAs

  // FIAA 1 - DRAFT
  await prisma.fIAA.create({
    data: {
      studentId: pedro.id,
      teacherId: docente.id,
      status: FiaaStatus.DRAFT,
      diffAttendance: true,
      diffNotDoingTasks: true,
      actAdviseAttendance: true,
      actAdviseTasks: true,
    },
  })

  // FIAA 2 - PENDING_OPP
  await prisma.fIAA.create({
    data: {
      studentId: maria.id,
      teacherId: docente.id,
      status: FiaaStatus.PENDING_OPP,
      diffWorkQuality: true,
      diffParticipation: true,
      actAdviseStudy: true,
      actAdviseTutoring: true,
      absences: 5,
      lop: 'Oficina 1',
    },
  })

  // FIAA 3 - ESCALATED
  await prisma.fIAA.create({
    data: {
      studentId: joao.id,
      teacherId: docente.id,
      status: FiaaStatus.ESCALATED,
      diffDisciplinaryConduct: true,
      diffResultFocus: true,
      actAdviseSocialRules: true,
      guardAdviseContactSchool: true,
      referral: ReferralType.OPP,
      provGuidance: ReferralType.AQV,
      provObservations: 'Aluno apresenta comportamento inadequado recorrente.',
    },
  })

  // FIAA 4 - CLOSED with Recovery Plan
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
  })

  console.log('Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
