
const { OpenAI } = require('openai');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        upload.single('file')(req, res, async (err) => {
            if (err) return res.status(400).json({ message: "Błąd przy przesyłaniu pliku" });

            const { mode, style } = req.body;
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
    } else {
        res.status(405).json({ message: 'Metoda nieobsługiwana' });
    }
};
