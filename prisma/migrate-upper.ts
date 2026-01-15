import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('CONVERTING DATA TO UPPERCASE...')

    await prisma.$executeRawUnsafe(`UPDATE "Product" SET name = UPPER(name)`)
    await prisma.$executeRawUnsafe(`UPDATE "Seller" SET name = UPPER(name), address = UPPER(address)`)

    console.log('MIGRATION COMPLETED SUCCESSFULLY!')
}

main()
    .catch((e) => {
        console.error('MIGRATION FAILED:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
