import dbConnect from '../lib/mongodb';
import User from '../models/User';
import { hashPassword } from '../lib/auth-utils';

async function seedUsers() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@medicall.com' });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
      return;
    }

    // Create admin user
    const adminPassword = await hashPassword('Admin123!');
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@medicall.com',
      password: adminPassword,
      role: 'admin',
      department: 'IT',
      phoneNumber: '+1234567890',
      isActive: true,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');

    // Create supervisor user
    const supervisorPassword = await hashPassword('Supervisor123!');
    const supervisorUser = new User({
      name: 'Call Center Supervisor',
      email: 'supervisor@medicall.com',
      password: supervisorPassword,
      role: 'supervisor',
      department: 'Call Center',
      phoneNumber: '+1234567891',
      isActive: true,
    });

    await supervisorUser.save();
    console.log('✅ Supervisor user created successfully');

    // Create agent user
    const agentPassword = await hashPassword('Agent123!');
    const agentUser = new User({
      name: 'Call Center Agent',
      email: 'agent@medicall.com',
      password: agentPassword,
      role: 'agent',
      department: 'Call Center',
      phoneNumber: '+1234567892',
      isActive: true,
    });

    await agentUser.save();
    console.log('✅ Agent user created successfully');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nDefault users created:');
    console.log('Admin: admin@medicall.com / Admin123!');
    console.log('Supervisor: supervisor@medicall.com / Supervisor123!');
    console.log('Agent: agent@medicall.com / Agent123!');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedUsers().then(() => {
  console.log('Seeding process completed');
  process.exit(0);
}).catch((error) => {
  console.error('Seeding process failed:', error);
  process.exit(1);
});
