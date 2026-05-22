const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Wajib untuk VPS
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('Silakan scan QR Code di atas dengan WhatsApp Anda.');
});

client.on('ready', () => {
    console.log('Bot Aqiqah Barokah Purwokerto sudah online!');
});

client.on('message', async msg => {
    // Abaikan jika pesan dari status atau grup (opsional)
    if (msg.fromMe) return;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Instruksi khusus untuk bot Anda
        const prompt = `Anda adalah admin ramah dari Aqiqah Barokah Purwokerto. 
        Jawablah pesan pelanggan ini dengan sopan dan informatif: "${msg.body}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        msg.reply(text);
    } catch (error) {
        console.error("Error saat memproses AI:", error);
        msg.reply("Maaf, sedang ada kendala teknis. Silakan hubungi admin secara manual.");
    }
});

client.initialize();
