import * as dotenv from 'dotenv'
import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import * as path from 'node:path'

const envFile = path.join(
  __dirname,
  '..',
  '..',
  `.env.${process.env.NODE_ENV || 'development'}`,
)
dotenv.config({
  path: envFile,
  quiet: true,
})

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const passwordRounds = Number(process.env.PASSWORD_ROUNDS) || 10

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD is missing in env')
  }

  const hashedPassword = await bcrypt.hash(password, passwordRounds)

  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Admin',
        email,
        password: hashedPassword,
        role: Role.Admin,
        isActive: true,
      },
    })
    console.log('✔ Admin user created')
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
