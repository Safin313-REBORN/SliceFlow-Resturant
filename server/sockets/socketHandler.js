import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((res, c) => {
    const [key, val] = c.trim().split('=');
    if (key && val) res[key] = decodeURIComponent(val);
    return res;
  }, {});
};

export const setupSockets = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      let token = socket.handshake.auth?.token;

      if (!token && socket.handshake.headers.cookie) {
        const parsed = parseCookies(socket.handshake.headers.cookie);
        token = parsed.jwt;
      }

      if (!token) {
        socket.user = null;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sliceflow_secret');
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        socket.user = user;
      }
      next();
    } catch (err) {
      socket.user = null;
      next();
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?._id?.toString();
    const userRole = socket.user?.role;

    if (userId) {
      const userRoom = `user_${userId}`;
      socket.join(userRoom);

      if (userRole === 'admin') {
        socket.join('admin_room');
      }
    }

    socket.on('join_order_room', (orderId) => {
      // Room for specific order tracking
      if (orderId) {
        socket.join(`order_${orderId}`);
      }
    });

    socket.on('disconnect', () => {});
  });
};
