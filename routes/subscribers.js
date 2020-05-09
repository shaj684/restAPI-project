const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');

// Getting Subscribers
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Getting Single Subscriber
router.get('/:id', getSubscriber, (req, res) => {
  res.json(res.subscriber);
});

// Create Subscriber
router.post('/', async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
  });

  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Updating Subscriber (could use put but this changes all data of user)
router.patch('/:id', getSubscriber, async (req, res) => {
  res.subscriber.name = req.body.name ? req.body.name : res.subscriber.name;

  res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    ? req.body.subscribedToChannel
    : res.subscriber.subscribedToChannel;

  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Deleting Subscriber
router.delete('/:id', getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
    res.json({ msg: `${res.subscriber.name} was deleted from the database` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Middleware
async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ msg: 'could not find subscriber' });
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
  console.log(subscriber);
  res.subscriber = subscriber;
  next();
}

module.exports = router;
