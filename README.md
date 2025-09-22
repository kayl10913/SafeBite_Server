# SafeBite REST API - Node.js/Express Backend

A comprehensive food safety monitoring system built with Node.js, Express, and MySQL. This system provides real-time sensor data monitoring, AI-powered food safety analysis, and user management capabilities.

## Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Admin Panel**: Comprehensive admin dashboard with user management
- **IoT Integration**: Arduino sensor data collection and monitoring
- **AI Analysis**: Food safety analysis based on sensor readings
- **Real-time Monitoring**: Temperature, humidity, and gas level tracking
- **Spoilage Detection**: Automated alerts for unsafe food conditions
- **Activity Logging**: Complete audit trail of user actions

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- XAMPP (for local development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SafeBite_Server
   ```

2. **Install dependencies**
   ```bash
npm install
   ```

3. **Set up environment variables**
   
   Edit `.env` file with your configuration:
   

4. **Set up the database**
   - Import the `safebite.sql` file into your MySQL database
   - Ensure the database name matches your `.env` configuration

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users
- `GET /api/admin/logs` - Get system logs
- `GET /api/admin/spoilage-alerts` - Get spoilage alerts

### User
- `GET /api/users/food-items` - Get food items
- `GET /api/users/food-types` - Get food types
- `GET /api/users/logs` - Get user activity logs
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Sensor Data
- `POST /api/sensor/arduino-data` - Receive sensor data from Arduino
- `GET /api/sensor/data` - Get user's sensor data
- `GET /api/sensor/latest` - Get latest sensor reading
- `GET /api/sensor/statistics` - Get sensor statistics

### AI Analysis
- `POST /api/ai/analyze` - Analyze food safety
- `POST /api/ai/chat` - AI chat assistance
- `GET /api/ai/analysis-history` - Get analysis history
- `GET /api/ai/chat-history` - Get chat history

## Database Schema

The system uses the following main tables:
- `users` - User accounts and profiles
- `sessions` - User session management
- `sensor_data` - IoT sensor readings
- `food_items` - Food item catalog
- `food_types` - Food type categories
- `activity_logs` - User activity tracking
- `spoilage_alerts` - Food safety alerts
- `ai_analysis` - AI analysis results
- `ai_chat` - AI chat conversations

## Frontend Integration

The Express server serves the frontend files from the `../frontend` directory. The frontend includes:
- User authentication pages
- Admin dashboard
- User dashboard with sensor monitoring
- Real-time charts and analytics

## Arduino Integration

The system accepts sensor data from Arduino devices via the `/api/sensor/arduino-data` endpoint. Required data:
- `user_id` - User identifier
- `temperature` - Temperature reading (°C)
- `humidity` - Humidity reading (%)
- `gas_level` - Gas sensor reading (ppm)
- `device_id` - Optional device identifier

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Role-based access control
- Session management

## Development

### Project Structure
```
safebitRestAPI/
├── backend/
│   ├── app.js              # Main Express application
│   ├── config/             # Configuration files
│   │   ├── database.js     # Database connection
│   │   └── auth.js         # Authentication utilities
│   └── routes/             # API route handlers
│       ├── auth.js         # Authentication routes
│       ├── admin.js        # Admin routes
│       ├── user.js         # User routes
│       ├── sensor.js       # Sensor data routes
│       └── ai.js           # AI analysis routes
├── frontend/               # Frontend files (served by Express)
├── package.json
└── README.md
```

### Running Tests
```bash
npm test
```

### Code Style
- Use ES6+ features
- Follow Express.js best practices
- Implement proper error handling
- Use async/await for database operations

## Deployment

1. **Production environment setup**
   ```bash
   NODE_ENV=production npm start
   ```

2. **Environment variables**
   - Set production database credentials
   - Use strong JWT secret
   - Configure proper CORS origins

3. **Process management**
   - Use PM2 or similar process manager
   - Set up reverse proxy (nginx)
   - Configure SSL certificates

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **JWT token invalid**
   - Check JWT_SECRET in `.env`
   - Verify token expiration
   - Check Authorization header format

3. **CORS errors**
   - Verify CORS configuration in `app.js`
   - Check frontend origin settings

### Logs
- Check console output for error messages
- Database errors are logged with details
- Authentication failures are tracked

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Contact the development team

## Changelog

### v1.0.0
- Initial Node.js/Express implementation
- Complete API endpoint coverage
- JWT authentication system
- IoT sensor integration
- AI analysis capabilities