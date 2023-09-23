import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControl {
  constructor() {
    this.ultimo = 0;
    this.hoy = new Date().getDate();
    this.tickets = [];
    this.ultimos4 = [];
    this.dbPath = './db/data.json';
    this.init();
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    };
  }

  init() {
    if (!fs.existsSync(this.dbPath)) return;
    const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
    const { hoy, tickets, ultimo, ultimos4 } = JSON.parse(info);
    if (hoy === this.hoy) {
      this.tickets = tickets;
      this.ultimo = ultimo;
      this.ultimos4 = ultimos4;
    } else {
      this.guardarDB();
    }
  }

  guardarDB() {
    const dbPath = path.join(__dirname, '../db/data.json');
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  siguiente() {
    this.ultimo += 1;
    const ticket = new Ticket(this.ultimo, null);
    this.tickets.push(ticket);
    this.guardarDB();
    return 'Ticket ' + ticket.numero;
  }

  atenderTicket(escritorio) {
    // No tenemos tickets
    if (this.tickets.length === 0) return null;

    const ticket = this.tickets.shift();

    ticket.escritorio = escritorio;
    this.ultimos4.unshift(ticket);
    if (this.ultimos4.length > 4) {
      this.ultimos4.splice(-1, 1);
    }
    this.guardarDB();
    return ticket;
  }
}

export default TicketControl;
