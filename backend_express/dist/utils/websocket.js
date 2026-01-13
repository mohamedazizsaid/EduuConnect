"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocket = initializeWebSocket;
exports.getIO = getIO;
exports.broadcastDataChange = broadcastDataChange;
exports.broadcastCourseChange = broadcastCourseChange;
exports.broadcastAssignmentChange = broadcastAssignmentChange;
exports.broadcastCourseList = broadcastCourseList;
exports.broadcastNotification = broadcastNotification;
const socket_io_1 = require("socket.io");
let io;
function initializeWebSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:51963', 'http://localhost:52104', '*'],
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        // Join room for specific data type
        socket.on('join-room', (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room: ${room}`);
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
    return io;
}
function getIO() {
    if (!io) {
        throw new Error('WebSocket not initialized');
    }
    return io;
}
// Broadcast data change to all clients
function broadcastDataChange(room, event, data) {
    if (!io)
        return;
    io.to(room).emit(event, data);
}
// Specific broadcast functions
function broadcastCourseChange(courseId, data) {
    broadcastDataChange(`course-${courseId}`, 'course-updated', data);
}
function broadcastAssignmentChange(courseId, data) {
    broadcastDataChange(`course-${courseId}`, 'assignment-updated', data);
}
function broadcastCourseList() {
    broadcastDataChange('courses', 'courses-updated', null);
}
function broadcastNotification(userId, data) {
    broadcastDataChange(`user-${userId}`, 'notification', data);
}
