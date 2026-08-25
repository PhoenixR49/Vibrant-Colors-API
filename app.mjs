import express from "express";
import { Vibrant } from "node-vibrant/node";

const app = express();

app.get("/color", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "param url manquant" });
    try {
        const palette = await Vibrant.from(url).getPalette();
        // Swatches disponibles : Vibrant, Muted, DarkVibrant, DarkMuted, LightVibrant, LightMuted
        const swatch = palette.Vibrant ?? palette.DarkVibrant ?? palette.Muted;
        if (!swatch) return res.status(404).json({ error: "No result found" });
        res.json({ rgb: swatch.rgb, hex: swatch.hex });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.listen(8765, () => console.log("Vibrant server on :8765"));