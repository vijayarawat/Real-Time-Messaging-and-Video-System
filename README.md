# Real-Time-Messaging-and-Video-System

A full-stack web application that enables users to communicate through direct messaging, group chats, and video calls with real-time synchronization using Socket.io and WebRTC.

## Features

### Direct Messaging
- Real-time one-on-one messaging
- Message history persistence
- User authentication with JWT
- Online/offline status indicators
- Typing indicators

### Group Chat
- Create and manage groups
- Join groups using unique invite codes
- Admin controls (add/remove members, delete groups)
- Group message history
- Group settings and information
- Member management

### Video Calling
- **Direct Video Calls**: One-on-one video calling with WebRTC
- **Group Video Calls**: Multi-participant video conferencing
- Automatic call initiation (starts when first member accepts)
- Real-time video/audio streaming
- Responsive video grid layout
- Incoming call notifications

### User Management
- User registration and login
- User profiles with avatars
- Search and add users
- View online users

### Group Join Codes
- Each group gets a unique 8-character alphanumeric code
- Users can join groups without being invited by admin
- Codes are displayed in group settings for easy sharing

### Video Call Workflow
1. **Direct Calls**:
   - Caller sends offer via Socket.io
   - Receiver accepts and sends answer
   - ICE candidates are exchanged
   - WebRTC connection established

2. **Group Calls**:
   - Initiator creates call and sends SDP offer to all members
   - Any member accepting activates the call
   - Multiple peers connect via WebRTC mesh topology
   - Video streams displayed in responsive grid

## Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **WebRTC Signaling**: Socket.io events
- **Runtime**: Node.js

### Frontend
- **Framework**: React
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **UI Components**: DaisyUI
- **Real-time Client**: Socket.io-client
- **Icons**: React Icons
- **Build Tool**: Vite
- **Notifications**: React Hot Toast

### WebRTC
- Peer-to-peer video/audio streaming
- ICE candidate exchange for NAT traversal
- SDP offer/answer protocol

## Project Structure

```
gupshup/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── protectedRoutes.js  # Private route protection
│   │   │   └── utilities/
│   │   │       └── axiosInstance.jsx
│   │   ├── pages/
│   │   │   ├── authentication/
│   │   │   │   ├── login.jsx
│   │   │   │   └── signup.jsx
│   │   │   └── home/
│   │   │       ├── Home.jsx
│   │   │       ├── UserSidebar.jsx
│   │   │       ├── GroupSidebar.jsx
│   │   │       ├── MessageContainer.jsx
│   │   │       ├── GroupChatContainer.jsx
│   │   │       ├── CreateGroupModal.jsx
│   │   │       ├── JoinGroupModal.jsx
│   │   │       ├── GroupSettings.jsx
│   │   │       ├── VideoCallWindow.jsx
│   │   │       ├── GroupVideoCallWindow.jsx
│   │   │       ├── IncomingCallPopup.jsx
│   │   │       └── GroupIncomingCallPopup.jsx
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── slice/
│   │   │       ├── user/
│   │   │       ├── message/
│   │   │       ├── group/
│   │   │       ├── call/
│   │   │       └── socket/
│   │   └── utils/
│   │       └── webrtc.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                          # Express backend
    ├── controllers/
    │   ├── user.controller.js
    │   ├── messageController.js
    │   └── groupController.js
    ├── models/
    │   ├── userModel.js
    │   ├── conversationModel.js
    │   ├── messageModel.js
    │   └── groupModel.js
    ├── routes/
    │   ├── user.route.js
    │   ├── messageRoute.js
    │   └── groupRoute.js
    ├── middlewares/
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    ├── socket/
    │   └── socket.js
    ├── utilities/
    │   ├── asyncHandlerUtility.js
    │   └── errorHandlerUtility.js
    ├── db/
    │   └── connectionDb.js
    ├── index.js
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gupshup
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the server:
```bash
nodemon index.js
```
The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_SERVER_URL=set_here_the backend_url 
dummy = http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```
The client will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/user/signup` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/user/logout` - Logout user
- `GET /api/user/all-users` - Get all users

### Direct Messaging
- `POST /api/messages/send` - Send direct message
- `GET /api/messages/:conversationId` - Get conversation messages

### Groups
- `POST /api/group/create` - Create a new group
- `GET /api/group/user-groups` - Get user's groups
- `GET /api/group/:groupId` - Get group details
- `GET /api/group/:groupId/messages` - Get group messages
- `POST /api/group/add-member` - Add member to group (admin)
- `POST /api/group/remove-member` - Remove member from group (admin)
- `PUT /api/group/update/:groupId` - Update group info (admin)
- `DELETE /api/group/delete/:groupId` - Delete group (admin)
- `POST /api/group/join-by-code` - Join group using code

## Socket Events

### Direct Calls
- `initiate-call` - Initiate a direct video call
- `accept-call` - Accept incoming call
- `ice-candidate` - Exchange ICE candidates
- `end-call` - End call session
- `call-accepted` - Confirmation of call acceptance
- `incoming-call` - Receive incoming call notification

### Group Calls
- `initiate-group-call` - Initiate group video call
- `accept-group-call` - Accept group call
- `user-joined-group-call` - Notify when user joins
- `group-ice-candidate` - Exchange ICE candidates in group
- `group-call-ended` - End group call
- `group-call-accepted` - Confirmation of call activation

### Messaging
- `message` - Receive new direct message
- `group-message` - Receive new group message

### User Status
- `user-online` - User comes online
- `user-offline` - User goes offline

## Running the Application

### Development Mode

Terminal 1 - Start Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Start Frontend:
```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

Frontend:
```bash
cd client
npm run build
npm run preview
```

Backend:
```bash
cd server
NODE_ENV=production npm start
```

## Usage Guide

### Creating an Account
1. Go to signup page
2. Enter username, email, and password
3. Click signup to create account

### Direct Messaging
1. Go to home page (Users tab)
2. Click on a user from the user list
3. Type message and press send
4. Messages appear in real-time

### Starting a Video Call
1. Open direct message with a user
2. Click the video call icon
3. User receives notification popup
4. Recipient accepts to establish video connection

### Creating a Group
1. Switch to Groups tab
2. Click "Create Group" button
3. Enter group name, description, and select members
4. Click create
5. Get the group join code automatically

### Joining a Group
1. Click "Join Group" button in Groups sidebar
2. Enter the 8-character join code
3. Click join to become a member

### Managing Group
1. Click settings icon in group chat
2. Edit name/description (admin only)
3. Add or remove members (admin only)
4. View and copy the join code
5. Delete group (admin only)

### Group Video Call
1. In group chat, click video call button
2. Invitation sent to all members
3. Members receive notification
4. Any member accepting activates the call
5. Multiple video streams displayed in grid

## Security Considerations

- Passwords hashed with bcrypt
- JWT tokens for session management
- Protected API routes with authentication middleware
- CORS configured for cross-origin requests
- Input validation on server side
- Error messages don't leak sensitive information

## Performance Optimizations

- Lazy loading of message history
- Efficient WebRTC peer connections
- Redux selectors for component optimization
- Socket.io room management for targeted messaging
- Message filtering to prevent duplicates

## Troubleshooting

### Messages not sending
- Check server is running
- Verify MongoDB connection
- Check browser console for errors
- Ensure authentication token is valid

### Video call not connecting
- Check microphone/camera permissions
- Verify both users have stable internet
- Check Socket.io connection status
- Try refreshing the page

### Can't join group by code
- Verify code is correct (8 characters)
- Check you're not already a member
- Confirm the group exists
