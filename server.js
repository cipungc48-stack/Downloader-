const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware - Biar koneksi lancar jaya
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// ==========================================
// MESIN DOWNLOADER (BYPASS ENGINE V6)
// ==========================================
async function tikDown(url) {
    try {
        const res = await axios.post('https://www.tikwm.com/api/', new URLSearchParams({
            url: url,
            count: 12,
            cursor: 0,
            web: 1,
            hd: 1
        }));
        
        if (res.data.data) {
            const data = res.data.data;
            return {
                status: true,
                title: data.title,
                thumbnail: 'https://www.tikwm.com' + data.cover,
                video: 'https://www.tikwm.com' + (data.hdplay || data.play),
                audio: 'https://www.tikwm.com' + data.music,
                stats: {
                    views: data.play_count,
                    likes: data.digg_count,
                    comments: data.comment_count
                }
            };
        }
        return { status: false, msg: "Video tidak ditemukan atau link salah." };
    } catch (e) {
        return { status: false, msg: "Gagal menembus firewall target." };
    }
}

// ==========================================
// ROUTE API (GABUNGAN V5 ENDPOINT)
// ==========================================
app.get('/api/download', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, msg: 'Masukkan URL-nya dulu, Bos!' });

    // Log aktivitas biar lu tau siapa yang pake
    console.log(`[REQUEST] Link: ${url}`);

    const result = await tikDown(url);
    if (result.status) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
});

// Jalankan Server
app.listen(PORT, () => {
    console.clear();
    console.log(`
    ==============================================
    🚀 GOOST PROJECT - HYBRID VERSION (V5 + V6)
    ==============================================
    🖥️  SERVER : http://localhost:${PORT}
    🛠️  ENGINE : TikWM Turbo Bypass
    🛡️  STATUS : FIREWALL PENETRATED
    ==============================================
    📢 Web lu sudah lebih unggul dari yang lain!
    `);
});
