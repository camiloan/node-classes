import TicketControl from '../models/ticket-control.js';

const ticketControl = new TicketControl();

const socketController = (socket) => {
  socket.emit('ultimo-ticket', 'Ticket ' + ticketControl.ultimo);
  socket.emit('estado-actual', ticketControl.ultimos4);
  socket.emit('tickets-pendientes', ticketControl.tickets.length);

  socket.on('siguiente-ticket', (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
  });

  socket.on('atender-ticket', ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({ ok: false, msg: 'El escritorio es obligatorio' });
    }
    const ticket = ticketControl.atenderTicket(escritorio);

    socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

    if (!ticket) {
      callback({ ok: false, mgs: 'Ya no hay tickets pendientes' });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

export { socketController };
