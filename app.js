const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inisialisasi Gemini AI
// Pastikan GEMINI_API_KEY sudah diisi di Environment Variables Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '.wwebjs_auth' // Menyimpan sesi agar tidak scan terus-menerus
    }),
    puppeteer: {
        // Menggunakan path yang disediakan environment atau default path umum
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// Menampilkan QR di log terminal
client.on('qr', (qr) => {
    console.log('QR RECEIVED. Silakan scan dengan WhatsApp Anda:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot Aqiqah Barokah Purwokerto sudah siap!');
});

// Fungsi AI untuk membalas pesan
client.on('message', async msg => {
    if (msg.fromMe) return;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Anda adalah admin ramah dari Aqiqah Barokah Purwokerto. 
        Jawablah pesan pelanggan ini dengan sopan, informatif, dan gunakan Bahasa Indonesia: "${msg.body}"`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        msg.reply(text);
    } catch (error) {
        console.error("Error AI:", error);
        msg.reply("Mohon maaf, admin sedang sibuk. Silakan hubungi 08xxx untuk bantuan lebih lanjut.");
    }
});

client.initialize().catch(err => {
    console.error("Gagal menginisialisasi bot:", err);
});
