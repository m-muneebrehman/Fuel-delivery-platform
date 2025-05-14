const socketIO = require('socket.io');

let io;

/**
 * Initialize Socket.IO server
 * @param {object} server - HTTP server instance
 * @returns {object} Socket.IO instance
 */
function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join room based on userId
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${socket.id} joined room: ${userId}`);
    });

    socket.on('join',async(data)=>{
      const {userId,userType} = data;
      if(userType === 'user'){
        await User.findByIdAndUpdate(userId,{socketId:socket.id});
      }else if(userType === 'fuelPump'){
        await FuelPump.findByIdAndUpdate(userId,{socketId:socket.id});
      }else if(userType === 'deliveryBoy'){
        await DeliveryBoy.findByIdAndUpdate(userId,{socketId:socket.id});
      }

    })

   
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  console.log('Socket.IO initialized');
  return io;
}

/**
 * Send a message to a specific socket or room
 * @param {string} recipient - Socket ID or room name
 * @param {string} event - Event name to emit
 * @param {object} data - Data to send
 * @returns {boolean} - Success status
 */
function sendMessageToSocket(recipient, event, data) {
  if (!io) {
    console.error('Socket.IO not initialized');
    return false;
  }

  try {
    io.to(recipient).emit(event, data);
    console.log(`Message sent to ${recipient} with event: ${event}`);
    return true;
  } catch (error) {
    console.error('Error sending socket message:', error);
    return false;
  }
}

module.exports = {
  initializeSocket,
  sendMessageToSocket
}; 