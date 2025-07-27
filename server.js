const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kvanitha270@gmail.com',      // replace with your Gmail
    pass: 'senk cesw mtca ewyy'          // use App Password from Google (not your normal password)
  }
});

// Twilio config
// const accountSid = 'YOUR_TWILIO_SID';
// const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
// const twilioPhone = 'YOUR_TWILIO_PHONE';
// const targetPhone = 'TARGET_PHONE_NUMBER'; // e.g. +9198XXXXXXXX

// const client = require('twilio')(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Load HTML files
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});
// res.redirect('/form');
// res.sendFile(__dirname + '/views/form.html');


app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === 'bday123') {
    res.redirect('/form'); // ✅ Only inside this block
  } else {
    res.send('<h2>Wrong password. <a href="/">Try again</a></h2>');
  }
});


function isTaken(product) {
  const file = fs.readFileSync('./data/takenProducts.json');
  const data = JSON.parse(file);
  return data.taken.includes(product);
}

function markTaken(product) {
  const file = fs.readFileSync('./data/takenProducts.json');
  const data = JSON.parse(file);
  data.taken.push(product);
  fs.writeFileSync('./data/takenProducts.json', JSON.stringify(data, null, 2));
}

function sendSMS(name, product) {
  client.messages
    .create({
      body: `${name} selected: ${product} 🎁`,
      from: twilioPhone,
      to: targetPhone
    })
    .then(msg => console.log('SMS sent:', msg.sid))
    .catch(console.error);
}

// app.post('/submit', (req, res) => {
//   const { name, product } = req.body;

//   if (isTaken(product)) {
//     return res.send('<h2>That gift is already taken! <a href="/">Go back</a></h2>');
//   }

//   markTaken(product);
//   console.log(`🎉 ${name} picked: ${product}`);
//   // sendSMS(name, product);
//   res.sendFile(__dirname + '/views/thankyou.html');
// });

app.post('/submit', (req, res) => {
  const { name, product } = req.body;

  if (isTaken(product)) {
    return res.send('<h2>That gift is already taken! <a href="/">Go back</a></h2>');
  }

  markTaken(product);
  console.log(`🎉 ${name} picked: ${product}`);

  // Send Email
  const mailOptions = {
    from: 'kvanitha270@gmail.com',
    to: 'kvanitha270@gmail.com, amirdha06091010@gmail.com', // Change if you want it to go elsewhere
    subject: '🎁 New Gift Submission',
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Selected Product:</strong> ${product}</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending failed:', error);
    } else {
      console.log('Email sent:', info.response);
    }
    // Continue regardless of mail result
    res.sendFile(__dirname + '/views/thankyou.html');
  });
});

app.get('/form', (req, res) => {
  const file = fs.readFileSync('./data/takenProducts.json');
  const taken = JSON.parse(file).taken;

  const products = [
    {
      name: "Carlton London Perfume",
      img: "https://images-static.nykaa.com/media/catalog/product/1/4/1406c26CALTO00000005_1.jpg",
      link: "https://www.nykaa.com/carlton-london-perfume-women-escape-perfume/p/12223282?se=0"
    },
    {
      name: "MARS Lip Tint",
      img: "https://marscosmetics.in/cdn/shop/files/04w.jpg?v=1751970608",
      link: "https://www.amazon.in/MARS-Non-Sticky-Lightweight-Comfortable-Flattering/dp/B0DQNQD8DG"
    },
    {
      name: "SKINN by TITAN Perfume",
      img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTHNh8RCzRn5wh40ucB1CiV_9J05S7TonqpwpwgSmOdD_LvLpvNOxq8iEXvYCXpimDlTfVlu5nkW847bxzf-gMbosfg0eHzy5VjKxyBY9fFrSbgn5NzfrI-YiJiUhQew_KzkTLjFUpmV_I&usqp=CAc",
      link: "https://www.myntra.com/mailers/fragrance/skinn/skinn-by-titan-women-nude-edp--50-ml/11785226/buy?utm_source=social_share_pdp&utm_medium=deeplink&utm_campaign=social_share_pdp_deeplink"
    },
    {
      name: "MIRAGGIO Shoulder Bag",
      img: "https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/2024/6/24/cca692ea-9f29-4df2-bbde-a00027f15b2d1719212033433-asa--36-.jpg",
      link: "https://www.myntra.com/mailers/bags/miraggio/miraggio-cindy-black-half-moon-shoulder-bag/20894552/buy?utm_source=social_share_pdp&utm_medium=deeplink&utm_campaign=social_share_pdp_deeplink"
    }, {
      name: "LA ELLORE Shoulder Bag",
      img: "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/32109762/2025/5/26/5113b5c5-4be5-43a0-b8ec-bbfc4f7b20f61748254894044-LA-ELLORE-Women-Solid-Structured-Leather-Shoulder-Bag-965174-1.jpg",
      link: "https://www.myntra.com/mailers/bags/la-ellore/la-ellore-women-solid-structured-leather-shoulder-bag/32109762/buy?utm_source=social_share_pdp&utm_medium=deeplink&utm_campaign=social_share_pdp_deeplink"
    }, {
      name: "BRONZITE glass tint balm",
      img: "https://www.diambeauty.com/cdn/shop/files/HUES5826-5_cd4670c8-5dce-458a-a5d3-b37093edcb58_2048x2048.jpg?v=1733466925",
      link: "https://www.diambeauty.com/products/glass-tint-balm-bronzite"
    }, {
      name: "Maybelline Waterproof Mascara",
      img: "https://m.media-amazon.com/images/I/512zBYEenoL.jpg",
      link: "https://www.myntra.com/mailers/makeup/maybelline/maybelline-new-york-lash-sensational-sky-high-waterproof-mascara-6-ml---very-black/18987452/buy?utm_source=social_share_pdp&utm_medium=deeplink&utm_campaign=social_share_pdp_deeplink"
    }
  ];

  res.render('form', { products, taken });
});
//senk cesw mtca ewyy

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
