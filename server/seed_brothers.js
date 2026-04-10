import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Brother from './models/Brother.js';

dotenv.config();

const realBrothers = [
  "Aneeta Thokkadam", "Anaya Rege", "Anagha Gowda", "Neha Gurram", "Aarav Sharma",
  "Shraddha Mamidipaka", "Riya Havanur", "Yash Shelar", "Visakhi Miriyapalli", "Gianna Athavale",
  "Ansh Vasudevan", "Arya Bhanushali", "Avaye Dawadi", "Ayan Goel", "Rhea Hiredesai",
  "Pari Vardhineedi", "Saanjh Varyani", "Swathi Kovvur", "Sarah Pena", "Karina Shah",
  "Ishi Bhattacharya", "Zoe Kukreja", "Vedant Bhatt", "Siva Duddempudi", "Ishan Voleti",
  "Akhilan Senthilraj", "Anish Kapoor", "Satvik Tadiparthi", "Arjun Janakiraman", "Rida Merani",
  "Rohan Pai", "Sujith Vuduta", "Megha Goddu", "Krishiv Khatri", "Kirtika Raychaudhury",
  "Mahathi Hariharan", "Prisha Bagad", "Noor Moosa", "Saloni Panchamia", "Neel Adhlaka",
  "Samrah Khan", "Sanjana Polavarapu", "Nayan Nathi", "Mihir Pai", "Sun Hwang",
  "Aishwarya Meyyappan", "Shakshi Bhimani", "Inara Sheeraz", "Rohan Malla", "Maitri Sridhar",
  "Lily Littrell", "Rahul Solleti", "Krish Kochhar", "Swara Viswanadha", "Vinay Gupta",
  "Kevin Jacob", "Kate Kwon", "Karan Ajmera", "Julia Lown", "Ishan Kasaju",
  "Hasini Sandra", "Gavin Chen", "Agnes Chacko", "Divye Agrawal", "Brandon Stephenson",
  "Becca Jose", "Aryan Thakkar"
];

const seedBrothers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing brothers
    await Brother.deleteMany({});
    console.log('🗑️  Cleared existing brothers');

    // Remove duplicates from list
    const uniqueBrothers = [...new Set(realBrothers)];

    for (let i = 0; i < uniqueBrothers.length; i++) {
      const type = i % 2 === 0 ? 'networking' : 'brotherhood';
      await Brother.create({
        name: uniqueBrothers[i],
        type: type
      });
    }

    console.log(`✅ ${uniqueBrothers.length} Real brothers seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding brothers:', error);
    process.exit(1);
  }
};

seedBrothers();
