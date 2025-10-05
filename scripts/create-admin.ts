import { PrismaClient } from '@prisma/client'
import { hashPassword, validatePasswordStrength } from '../src/lib/security'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function questionHidden(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(prompt)
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')

    let input = ''
    const onData = (char: string) => {
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004': // Ctrl+D
          process.stdin.setRawMode(false)
          process.stdin.pause()
          process.stdin.removeListener('data', onData)
          console.log('')
          resolve(input)
          break
        case '\u0003': // Ctrl+C
          process.exit()
          break
        default:
          input += char
          process.stdout.write('*')
          break
      }
    }

    process.stdin.on('data', onData)
  })
}

async function createAdmin() {
  try {
    console.log('🔐 PhoneMax Admin User Creation')
    console.log('================================\n')

    // Get admin details
    const name = await question('Admin Name: ')
    const email = await question('Admin Email: ')

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      const updateExisting = await question('User already exists. Update to admin? (y/N): ')
      if (updateExisting.toLowerCase() !== 'y') {
        console.log('Aborted.')
        process.exit(0)
      }
    }

    // Get password with validation
    let password = ''
    let isValidPassword = false

    while (!isValidPassword) {
      password = await questionHidden('Admin Password (min 12 chars): ')

      const validation = validatePasswordStrength(password)
      if (validation.isValid) {
        isValidPassword = true
      } else {
        console.log('\n❌ Password requirements not met:')
        validation.errors.forEach(error => console.log(`   • ${error}`))
        console.log('')
      }
    }

    const confirmPassword = await questionHidden('Confirm Password: ')

    if (password !== confirmPassword) {
      console.log('\n❌ Passwords do not match!')
      process.exit(1)
    }

    // Ask for role
    console.log('\nSelect admin role:')
    console.log('1. ADMIN - Standard admin privileges')
    console.log('2. SUPER_ADMIN - Full system access')

    const roleChoice = await question('Choice (1-2): ')
    const role: 'ADMIN' | 'SUPER_ADMIN' = roleChoice === '2' ? 'SUPER_ADMIN' : 'ADMIN'

    // Hash password
    console.log('\n⏳ Creating admin user...')
    const hashedPassword = await hashPassword(password)

    // Create or update user
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
      emailVerified: new Date(),
    }

    let user
    if (existingUser) {
      user = await prisma.user.update({
        where: { email },
        data: userData
      })
    } else {
      user = await prisma.user.create({
        data: userData
      })
    }

    console.log('\n✅ Admin user created successfully!')
    console.log(`   Name: ${user.name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   ID: ${user.id}`)

    console.log('\n🔗 Access URLs:')
    console.log(`   Admin Login: http://localhost:3000/admin/login`)
    console.log(`   Admin Dashboard: http://localhost:3000/admin/dashboard`)

    console.log('\n🔒 Security Notes:')
    console.log('   • Change password regularly')
    console.log('   • Enable 2FA when available')
    console.log('   • Monitor security logs')
    console.log('   • Use strong, unique passwords')

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

createAdmin()