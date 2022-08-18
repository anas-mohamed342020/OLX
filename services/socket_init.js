
const { userModel } = require('../DB/models/user.model.js');
const { initIO } = require('./socket.js');
function socketInit(server) {

  const io = initIO(server);

  io.on('connection', socket => {
    socket.on('updateSocketID', async userId => {
      await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
    });
    console.log({socket_id: socket.id});
  });
}

module.exports = socketInit;
