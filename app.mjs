import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://chat.restream.io/embed');
const fetchData = async () => {

    const data = await page.$$eval('.message-item', (elements) => {
        return elements.map((element) => ({
            sender: element.querySelector('.message-sender').textContent,
            message: element.querySelector('.chat-text-normal').textContent
        }));
    });

    //await browser.close();

    return data;
};

setInterval(async () => {
    const data = await fetchData();
    console.log(data);
}, 5000);

app.get('/restreamData', async (req, res) => {
    const data = await fetchData();
    res.send(data);
});

app.get('/setRestreamChat', async (req, res) => {
    const { chatToken } = req.query;
    await page.goto(`https://chat.restream.io/embed?token=${chatToken}`);
    res.send(chatToken);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
