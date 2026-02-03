import mongoose from 'mongoose';
import BlogPost from './model/blogpostschema.js';

const sampleBlogs = [
  {
    title: "Complete Guide to Airline Seat Upgrades",
    slug: "complete-guide-airline-seat-upgrades",
    featuredImage: "https://images.unsplash.com/photo-1436491865332-7a61a76616a0?w=800",
    introduction: "Learn everything about upgrading your airline seats, from economy to business class.",
    author: {
      name: "Aviation Expert",
      role: "Senior Travel Writer"
    },
    category: "Travel Tips",
    tags: ["upgrades", "seats", "airlines", "travel"],
    status: "pending"
  },
  {
    title: "Best Airlines for International Travel 2024",
    slug: "best-airlines-international-travel-2024",
    featuredImage: "https://images.unsplash.com/photo-1526499076415-a5a9f3f7a184?w=800",
    introduction: "Discover the top-rated airlines for your international journeys.",
    author: {
      name: "Travel Reviewer",
      role: "Aviation Analyst"
    },
    category: "Reviews",
    tags: ["airlines", "international", "reviews", "2024"],
    status: "published"
  },
  {
    title: "Pending Blog for Approval Testing",
    slug: "pending-blog-approval-testing",
    featuredImage: "https://images.unsplash.com/photo-1436491865332-7a61a76616a0?w=800",
    introduction: "This is a test blog that needs admin approval before being published.",
    author: {
      name: "Test Author",
      role: "Content Writer"
    },
    category: "Test",
    tags: ["test", "approval", "pending"],
    status: "pending"
  }
];

async function seedBlogs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/airlines-offices');
    console.log("MongoDB connected");
    
    // Clear existing blogs
    await BlogPost.deleteMany({});
    console.log('Cleared existing blogs');
    
    // Insert sample blogs
    const insertedBlogs = await BlogPost.insertMany(sampleBlogs);
    console.log(`Inserted ${insertedBlogs.length} sample blogs:`);
    
    insertedBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title} - Status: ${blog.status}`);
    });
    
    console.log('\nBlog seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
}

seedBlogs();