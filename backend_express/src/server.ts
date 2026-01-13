import app from './app';
import { connectDB } from './utils/mongo';
import { createServer } from 'http';
import { initializeWebSocket } from './utils/websocket';

const PORT = process.env.PORT || 3000;
async function main() {
    try {
        await connectDB();
        
        // Create HTTP server and integrate WebSocket
        const httpServer = createServer(app);
        initializeWebSocket(httpServer);
        
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`WebSocket ready at ws://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

main();
