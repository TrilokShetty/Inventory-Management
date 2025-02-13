const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Item = require('./models/Item');

const app = express();

mongoose.connect('mongodb://localhost:27017/inventory', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
  const items = await Item.find();
  res.render('index', { items });
});

app.get('/add', (req, res) => {
  res.render('add-item');
});

app.post('/add', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render('edit-item', { item });
});

app.post('/edit/:id', async (req, res) => {
  await Item.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
