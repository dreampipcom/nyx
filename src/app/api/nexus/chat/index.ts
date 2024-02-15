// nexus/chat/index.ts
import type { Server as ISocket } from 'socket.io'
import type { Socket as INetSocket } from 'net'
import type { Server as IHTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse } from "next"
import type { IChatMessage } from "@types"
import { Server } from 'socket.io';
import { addUser, getUser, getUsersInRoom } from './users';


interface SocketServer extends IHTTPServer {
  io?: ISocket | undefined
}

interface SocketWithIO extends INetSocket {
  server: SocketServer
}

interface NextResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (req: NextApiRequest, res: NextResponseWithSocket) => {
  const io = new Server(res.socket.server);
  io.on('connection', (socket) => {
    if (!res.socket.server.io) {
      const sendAll = ({ room, username, text }: IChatMessage) => {
        const { ans: users } = getUsersInRoom({ room });
        const sockets = users.map((user) => user.id);
        if (sockets.length) {
          sockets.forEach((_socket) => {
            try {
              io.sockets[_socket].emit('Message', {
                text,
                username,
                date: new Date().toLocaleTimeString({ locale: 'en-US' }),
              });
            } catch (e) {
              return;
            }
          });
        }
      };

      io.on('join', ({ username, room }, callback) => {
        const { error } = addUser({ id: socket.id, username, room });
        if (error) {
          return callback(error);
        }

        sendAll({ room, username, text: 'Dude joined.' });
      });

      socket.on('Send', (data) => {
        const { text, username } = data;
        const { room } = getUser({ username });
        sendAll({ room, username, text });
      });

      res.socket.server.io = io;
    } else {
      console.log('socket.io already running');
    }
    res.end();
  });
};

export default handler;
