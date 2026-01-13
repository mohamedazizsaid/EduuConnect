import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const url = 'mongodb://localhost:27017';
const dbName = 'educonnect';

async function main() {
    const client = new MongoClient(url);
    const email = 'aziz@gmail.com';
    const password = 'aaaa';
    const name = 'Aziz Teacher';
    const role = 'TEACHER';

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await client.connect();
        const db = client.db(dbName);
        const users = db.collection('User');

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            await users.updateOne(
                { email },
                {
                    $set: {
                        password: hashedPassword,
                        role: role,
                        name: name,
                        updatedAt: new Date()
                    }
                }
            );
            console.log('User updated via native driver');
        } else {
            await users.insertOne({
                email,
                password: hashedPassword,
                name,
                role: role,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('User created via native driver');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

main();
