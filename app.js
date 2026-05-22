const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('QR Code berhasil dibuat, silakan scan dengan WhatsApp Anda!');
});

client.on('ready', () => {
    console.log('Bot sudah online dan siap melayani!');
});

client.on('message', msg => {
    if (msg.body.toLowerCase() === 'hai') {
        msg.reply('Halo, selamat datang di Aqiqah Barokah Purwokerto. Ada yang bisa kami bantu?');
    }
});

client.initialize();
