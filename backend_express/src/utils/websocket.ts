import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: Server;

export function initializeWebSocket(httpServer: HTTPServer) {
    io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:51963', 'http://localhost:52104', '*'],
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        // Join room for specific data type
        socket.on('join-room', (room: string) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room: ${room}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
}

export function getIO(): Server {
    if (!io) {
        throw new Error('WebSocket not initialized');
    }
    return io;
}

// Broadcast data change to all clients
export function broadcastDataChange(room: string, event: string, data: any) {
    if (!io) return;
    io.to(room).emit(event, data);
}

// Specific broadcast functions
export function broadcastCourseChange(courseId: string, data: any) {
    broadcastDataChange(`course-${courseId}`, 'course-updated', data);
}

export function broadcastAssignmentChange(courseId: string, data: any) {
    broadcastDataChange(`course-${courseId}`, 'assignment-updated', data);
}

export function broadcastCourseList() {
    broadcastDataChange('courses', 'courses-updated', null);
}

export function broadcastNotification(userId: string, data: any) {
    broadcastDataChange(`user-${userId}`, 'notification', data);
}
