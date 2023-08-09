const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json()); //middleware

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'hello from the server side', app: 'Natours' });
// });
// app.post('/', (req, res) => {
//   res.send('you can post to this endpoint...');
// });

// APPS
// read data before sending
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// route to handle get requests
app.get('/api/v1/tours', (req, res) => {
  // route handlers
  res.status(200).json({
    // using JSON formatting standard
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

// route to handle url parameters
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id); //get id where is same as parameter

  //check if id > tours id.length
  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

// route to handle post requests
app.post('/api/v1/tours', (req, res) => {
  // route handlers
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); //object assign to margin 2 object
  // push to tours array
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
});

const port = 3000;
app.listen(port, () => {
  // callback function that will be called as soon as server start listening
  console.log(`app is running on port ${port}`);
});
