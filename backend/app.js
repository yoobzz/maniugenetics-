
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.static('frontend'));

app.post('/interpret', upload.single('file'), async (req, res) => {
    const { mode, style } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "Brak pliku!" });
    }

    let inputText = `Interpretacja: Twoje geny wskazują na ${mode} i styl: ${style}.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'You are a helpful assistant for genetic interpretation.' },
                { role: 'user', content: inputText },
            ],
        });

        const chatResponse = completion.choices[0].message.content;

        res.json({ message: chatResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Błąd podczas komunikacji z OpenAI" });
    }
});

app.listen(port, () => {
    console.log(`Serwer działa na ${port}`);
});
