const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  };
  app.use(cors(corsOptions));
  
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://ekadantamani1997:Mani%401997@cluster0.t09rl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const MessageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        return res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// API route to store messages in MongoDB
app.post('/send-message', async (req, res) => {
  try {
    const { sender, message } = req.body;
    if (!sender || !message) {
      return res.status(400).json({ error: 'Sender and message are required' });
    }

    const newMessage = new Message({ sender, message });
    await newMessage.save();

    // Emit the new message to all connected clients
    io.emit('receiveMessage', newMessage);

    res.status(201).json({ success: true, message: 'Message stored and broadcasted', data: newMessage });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', async (data) => {
    const newMessage = new Message(data);
    await newMessage.save();
    io.emit('receiveMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));
