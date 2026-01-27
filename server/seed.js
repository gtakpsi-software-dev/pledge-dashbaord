import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Brother from './models/Brother.js';
import WeeklyRequirement from './models/WeeklyRequirement.js';
import Todo from './models/Todo.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Brother.deleteMany({});
    await WeeklyRequirement.deleteMany({});
    await Todo.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@akpsi.org',
      password: 'admin123',
      role: 'admin',
      pledgeClass: 'N/A'
    });
    console.log('✅ Admin user created: admin@akpsi.org / admin123');

    // Create sample pledge user
    const pledge = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'pledge@akpsi.org',
      password: 'pledge123',
      role: 'pledge',
      pledgeClass: 'Fall 2025'
    });
    console.log('✅ Pledge user created: pledge@akpsi.org / pledge123');

    // Create sample brothers
    const networkingBrothers = [
      'Alex Johnson',
      'Sarah Williams',
      'Michael Chen',
      'Emily Rodriguez',
      'David Kim',
      'Jessica Lee',
      'Ryan Patel',
      'Amanda Garcia',
      'Kevin Martinez',
      'Lisa Thompson'
    ];

    const brotherhoodBrothers = [
      'Chris Anderson',
      'Michelle Wong',
      'Brandon Taylor',
      'Ashley Brown',
      'Jason Davis'
    ];

    for (const name of networkingBrothers) {
      await Brother.create({
        name,
        type: 'networking',
        addedBy: admin._id
      });
    }

    for (const name of brotherhoodBrothers) {
      await Brother.create({
        name,
        type: 'brotherhood',
        addedBy: admin._id
      });
    }
    console.log('✅ Sample brothers created');

    // Create weekly requirements for Fall 2025 semester
    const weeks = [
      { start: new Date('2025-09-25'), networking: 5, brotherhood: 0, alumni: 0, industry: 0, paddleTasks: 1 },
      { start: new Date('2025-10-02'), networking: 3, brotherhood: 5, alumni: 0, industry: 0, paddleTasks: 2 },
      { start: new Date('2025-10-09'), networking: 5, brotherhood: 0, alumni: 0, industry: 0, paddleTasks: 2 },
      { start: new Date('2025-10-16'), networking: 5, brotherhood: 0, alumni: 1, industry: 0, paddleTasks: 2 },
      { start: new Date('2025-10-23'), networking: 4, brotherhood: 0, alumni: 0, industry: 0, paddleTasks: 0 },
      { start: new Date('2025-10-30'), networking: 2, brotherhood: 2, alumni: 0, industry: 1, paddleTasks: 1 },
      { start: new Date('2025-11-06'), networking: 5, brotherhood: 0, alumni: 1, industry: 0, paddleTasks: 2 },
      { start: new Date('2025-11-13'), networking: 0, brotherhood: 0, alumni: 0, industry: 0, paddleTasks: 2 }
    ];

    for (const week of weeks) {
      const weekEnd = new Date(week.start);
      weekEnd.setDate(weekEnd.getDate() + 6);

      await WeeklyRequirement.create({
        weekStartDate: week.start,
        weekEndDate: weekEnd,
        pledgeClass: 'Fall 2025',
        requirements: {
          networking: week.networking,
          brotherhood: week.brotherhood,
          alumni: week.alumni,
          industry: week.industry,
          paddleTasks: week.paddleTasks
        }
      });
    }
    console.log('✅ Weekly requirements created for Fall 2025');

    // Create sample todos for pledge user
    const sampleTodos = [
      {
        pledgeId: pledge._id,
        title: 'Attend Chapter Meeting',
        description: 'Mandatory chapter meeting this Thursday at 7 PM',
        dueDate: new Date('2025-10-30'),
        priority: 'high',
        category: 'event',
        createdBy: admin._id
      },
      {
        pledgeId: pledge._id,
        title: 'Submit Paddle Design',
        description: 'Email your paddle design to the pledge chair',
        dueDate: new Date('2025-10-28'),
        priority: 'high',
        category: 'paddle',
        createdBy: admin._id
      },
      {
        pledgeId: pledge._id,
        title: 'Complete 3 Networking 1:1s',
        description: 'Schedule and complete at least 3 networking 1:1s this week',
        dueDate: new Date('2025-11-01'),
        priority: 'medium',
        category: 'requirement',
        createdBy: admin._id
      },
      {
        pledgeId: pledge._id,
        title: 'Read AKPsi History Chapter',
        description: 'Read Chapter 2 of the AKPsi history book',
        dueDate: new Date('2025-10-27'),
        priority: 'low',
        category: 'general',
        createdBy: admin._id
      },
      {
        pledgeId: pledge._id,
        title: 'Practice Pledge Exam',
        description: 'Study the pledge exam materials and take practice quiz',
        dueDate: new Date('2025-11-05'),
        priority: 'high',
        category: 'requirement',
        createdBy: admin._id
      }
    ];

    for (const todoData of sampleTodos) {
      await Todo.create(todoData);
    }
    console.log('✅ Sample todos created for pledge user');

    console.log('\n🎉 Seed data created successfully!\n');
    console.log('Login credentials:');
    console.log('  Admin: admin@akpsi.org / admin123');
    console.log('  Pledge: pledge@akpsi.org / pledge123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

