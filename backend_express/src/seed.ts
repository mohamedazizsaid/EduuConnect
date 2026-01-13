import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/educonnect';

async function seedDatabase() {
    const client = new MongoClient(MONGODB_URL);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db();

        // Clear existing data
        console.log('Clearing existing data...');
        await db.collection('User').deleteMany({});
        await db.collection('Course').deleteMany({});
        await db.collection('Certificate').deleteMany({});
        await db.collection('Conversation').deleteMany({});
        await db.collection('Message').deleteMany({});
        await db.collection('Assignment').deleteMany({});
        await db.collection('Resource').deleteMany({});
        await db.collection('Notification').deleteMany({});

        // Create Users
        console.log('Creating users...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = [
            {
                _id: new ObjectId(),
                name: 'Mohamed Aziz',
                email: 'aziz@educonnect.com',
                password: hashedPassword,
                role: 'STUDENT',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                name: 'Sarah Martin',
                email: 'sarah@educonnect.com',
                password: hashedPassword,
                role: 'TEACHER',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                name: 'John Doe',
                email: 'john@educonnect.com',
                password: hashedPassword,
                role: 'STUDENT',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                name: 'Emma Wilson',
                email: 'emma@educonnect.com',
                password: hashedPassword,
                role: 'TEACHER',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                name: 'Admin User',
                email: 'admin@educonnect.com',
                password: hashedPassword,
                role: 'ADMIN',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await db.collection('User').insertMany(users);
        console.log(`✓ Created ${users.length} users`);

        // Create Courses
        console.log('Creating courses...');
        const courses = [
            {
                _id: new ObjectId(),
                title: 'Introduction to Web Development',
                description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
                category: 'Programming',
                difficultyLevel: 'Beginner',
                price: 49.99,
                instructorId: users[1]._id, // Sarah Martin
                thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
                isPublished: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'Advanced React & TypeScript',
                description: 'Master React with TypeScript, hooks, context, and modern patterns.',
                category: 'Programming',
                difficultyLevel: 'Advanced',
                price: 99.99,
                instructorId: users[1]._id, // Sarah Martin
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
                isPublished: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'Data Science with Python',
                description: 'Explore data analysis, visualization, and machine learning with Python.',
                category: 'Science',
                difficultyLevel: 'Intermediate',
                price: 79.99,
                instructorId: users[3]._id, // Emma Wilson
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
                isPublished: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'Digital Art Fundamentals',
                description: 'Learn digital illustration, color theory, and composition.',
                category: 'Art',
                difficultyLevel: 'Beginner',
                price: 0, // Free course
                instructorId: users[3]._id, // Emma Wilson
                thumbnail: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
                isPublished: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'Calculus I',
                description: 'Introduction to differential and integral calculus.',
                category: 'Math',
                difficultyLevel: 'Intermediate',
                price: 59.99,
                instructorId: users[1]._id, // Sarah Martin
                thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
                isPublished: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await db.collection('Course').insertMany(courses);
        console.log(`✓ Created ${courses.length} courses`);

        // Create Assignments
        console.log('Creating assignments...');
        const assignments = [
            {
                _id: new ObjectId(),
                title: 'Build a Portfolio Website',
                description: 'Create a personal portfolio website using HTML, CSS, and JavaScript.',
                courseId: courses[0]._id,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'React Todo App',
                description: 'Build a todo application with React hooks and TypeScript.',
                courseId: courses[1]._id,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'Data Analysis Project',
                description: 'Analyze a dataset and create visualizations using pandas and matplotlib.',
                courseId: courses[2]._id,
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await db.collection('Assignment').insertMany(assignments);
        console.log(`✓ Created ${assignments.length} assignments`);

        // Create Certificates
        console.log('Creating certificates...');
        const certificates = [
            {
                _id: new ObjectId(),
                userId: users[0]._id, // Mohamed Aziz
                courseId: courses[0]._id,
                hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
                uniqueId: 'CERT-A1B2C3D4',
                status: 'ISSUED',
                txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                blockNumber: 12345,
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
            {
                _id: new ObjectId(),
                userId: users[2]._id, // John Doe
                courseId: courses[3]._id,
                hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7',
                uniqueId: 'CERT-B2C3D4E5',
                status: 'ISSUED',
                txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
                blockNumber: 12346,
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            }
        ];

        await db.collection('Certificate').insertMany(certificates);
        console.log(`✓ Created ${certificates.length} certificates`);

        // Create Conversations for courses
        console.log('Creating conversations...');
        const conversations = courses.map(course => ({
            _id: new ObjectId(),
            courseId: course._id,
            participants: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        await db.collection('Conversation').insertMany(conversations);
        console.log(`✓ Created ${conversations.length} conversations`);

        // Create Messages
        console.log('Creating messages...');
        const messages = [
            {
                _id: new ObjectId(),
                content: 'Hello everyone! Excited to start this course!',
                conversationId: conversations[0]._id,
                senderId: users[0]._id, // Mohamed Aziz
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                _id: new ObjectId(),
                content: 'Welcome! Feel free to ask any questions.',
                conversationId: conversations[0]._id,
                senderId: users[1]._id, // Sarah Martin (teacher)
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60000),
                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60000)
            },
            {
                _id: new ObjectId(),
                content: 'Can someone help me with the CSS flexbox assignment?',
                conversationId: conversations[0]._id,
                senderId: users[2]._id, // John Doe
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                _id: new ObjectId(),
                content: 'Sure! What specific part are you struggling with?',
                conversationId: conversations[0]._id,
                senderId: users[0]._id, // Mohamed Aziz
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 120000),
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 120000)
            },
            {
                _id: new ObjectId(),
                content: 'This course is amazing! The TypeScript examples are very clear.',
                conversationId: conversations[1]._id,
                senderId: users[0]._id, // Mohamed Aziz
                createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
            },
            {
                _id: new ObjectId(),
                content: 'Thank you! Glad you\'re enjoying it. The next module covers advanced hooks.',
                conversationId: conversations[1]._id,
                senderId: users[1]._id, // Sarah Martin
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            }
        ];

        await db.collection('Message').insertMany(messages);
        console.log(`✓ Created ${messages.length} messages`);

        // Create Resources
        console.log('Creating resources...');
        const resources = [
            {
                _id: new ObjectId(),
                title: 'HTML Cheat Sheet',
                description: 'Quick reference guide for HTML tags',
                fileUrl: 'https://example.com/html-cheatsheet.pdf',
                courseId: courses[0]._id,
                uploadedBy: users[1]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'React Hooks Guide',
                description: 'Comprehensive guide to React hooks',
                fileUrl: 'https://example.com/react-hooks.pdf',
                courseId: courses[1]._id,
                uploadedBy: users[1]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await db.collection('Resource').insertMany(resources);
        console.log(`✓ Created ${resources.length} resources`);

        // Create Notifications
        console.log('Creating notifications...');
        const notifications = [
            {
                _id: new ObjectId(),
                userId: users[0]._id,
                title: 'New Assignment',
                message: 'A new assignment has been posted in Web Development',
                type: 'ASSIGNMENT',
                isRead: false,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                _id: new ObjectId(),
                userId: users[0]._id,
                title: 'Certificate Issued',
                message: 'Your certificate for Web Development has been issued',
                type: 'CERTIFICATE',
                isRead: true,
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
        ];

        await db.collection('Notification').insertMany(notifications);
        console.log(`✓ Created ${notifications.length} notifications`);

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${users.length}`);
        console.log(`   Courses: ${courses.length}`);
        console.log(`   Assignments: ${assignments.length}`);
        console.log(`   Certificates: ${certificates.length}`);
        console.log(`   Conversations: ${conversations.length}`);
        console.log(`   Messages: ${messages.length}`);
        console.log(`   Resources: ${resources.length}`);
        console.log(`   Notifications: ${notifications.length}`);
        console.log('\n🔑 Test Credentials:');
        console.log('   Email: aziz@educonnect.com');
        console.log('   Email: sarah@educonnect.com (Teacher)');
        console.log('   Email: john@educonnect.com');
        console.log('   Email: emma@educonnect.com (Teacher)');
        console.log('   Email: admin@educonnect.com (Admin)');
        console.log('   Password: password123 (for all users)');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('\nDisconnected from MongoDB');
    }
}

seedDatabase();
