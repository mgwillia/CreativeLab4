const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('dist'))


let items = [];
let id = 0;

let doImport = false;
let importItems = [];
let importId = 0;

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

/*function createRandomData() {
  const DAYS = 29;
  for (let day = 1; day < DAYS; day++ ) {
    let number = randomIntFromInterval(0,30);
    for (let i = 0; i < number; i++ ) {
      importId += 1;
      let date = new Date(2018,1,day);
      let item = {id:importId, text:"random thing", completed: true, completedDate: date };
      importItems.push(item);
    }
  }
}

if (doImport) {
  createRandomData();
  items = importItems;
  id = importId;
}*/

app.get('/api/items', (req, res) => {
  res.send(items);
});

app.put('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = items.map(item => { return item.id; });
  let index = itemsMap.indexOf(id);
  let item = items[index];
  item.hidden = req.body.hidden;
  item.person = req.body.person;
  item.weight = req.body.weight;
  item.bench = req.body.bench;
  item.benchR = req.body.benchR;
  item.squat = req.body.squat;
  item.squatR = req.body.squatR;
  item.deadlift = req.body.deadlift;
  item.deadliftR = req.body.deadliftR;
  if (item.hidden) {
    item.completedDate = Date.now();
  }
  // handle drag and drop re-ordering
  if (req.body.orderChange) {
    let indexTarget = itemsMap.indexOf(req.body.orderTarget);
    items.splice(index,1);
    items.splice(indexTarget,0,item);
  }
  res.send(item);
});

app.post('/api/items', (req, res) => {
  id = id + 1;
  let item = {id:id, person:req.body.person, weight:req.body.weight, bench:req.body.bench, benchR:req.body.benchR, squat:req.body.squat, squatR:req.body.squatR, deadlift:req.body.deadlift, deadliftR:req.body.deadliftR, hidden:req.body.hidden};
  if (item.hidden) {
    item.completedDate = Date.now();
  }
  items.push(item);
  res.send(item);
});

app.delete('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = items.map(item => { return item.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist");
    return;
  }
  items.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'))

