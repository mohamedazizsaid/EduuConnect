"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const pino_http_1 = __importDefault(require("pino-http"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const certificate_routes_1 = __importDefault(require("./routes/certificate.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const assignment_routes_1 = __importDefault(require("./routes/assignment.routes"));
const submission_routes_1 = __importDefault(require("./routes/submission.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const resource_routes_1 = __importDefault(require("./routes/resource.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const middleware_1 = require("./utils/middleware");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, pino_http_1.default)());
// Swagger
try {
    const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, '../docs/swagger.yaml'));
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
}
catch (e) {
    console.warn('Swagger docs not found or invalid');
}
// Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/courses', course_routes_1.default);
app.use('/api/v1/certificates', certificate_routes_1.default);
app.use('/api/v1/ai', ai_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/assignments', assignment_routes_1.default);
app.use('/api/v1/submissions', submission_routes_1.default);
app.use('/api/v1/conversations', message_routes_1.default);
app.use('/api/v1/resources', resource_routes_1.default);
app.use('/api/v1', notification_routes_1.default); // Handles /notifications and /reminders
app.use(middleware_1.unknownEndpoint);
app.use(middleware_1.errorHandler);
exports.default = app;
