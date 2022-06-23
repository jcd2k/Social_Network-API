const { Thought, User } = require('../models');

const thoughtController = {

  // get all thoughts
  getThoughts(req, res) {
    Thought.find({})
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .sort({ _id: -1 })
    .then(thoughts => res.json(thoughts))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  // get single thought by id
  getSingleThought(req, res) {
    // specifies thought id
    Thought.findOne(
      { _id: req.params.id }
      )
      .populate(
        { path: 'reactions', select: '-__v' }
        )
      .select('-__v')
        .then(thoughts => {
        if (!thoughts) {
          res.status(404).json({ message: 'No thought with this id!' });
          return;
        }
        res.json(thoughts);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // create a thought
  createThought({ body }, res) {
    // attach to corresponding user
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((thoughts) => {
        console.log(thoughts);
        if (!thoughts) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(thoughts);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // update thought by id
  updateThought(req, res) {
    // specifies thought id
    Thought.findOneAndUpdate(
      { _id: req.params.id }, 
      { $set: req.body }, 
      { runValidators: true, new: true })
      .populate({
        path: "reactions",
        select: "-__v"
      })
      .then((thoughts) => {
        if (!thoughts) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(thou);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // delete thought by id
  deleteThought(req, res) {
    Thought.findOneAndDelete(
    { _id: req.params.thoughtId })
      .then((thoughts) => {
        if (!thoughts) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(thoughts);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // add a reaction to a thought
  addReaction(req, res) {
    Thought.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .select("-__v")
      .then((thoughts) => {
        if (!thoughts) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(thoughts);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });;
  },

  // remove reaction from a thought
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .select("-__v")
      .then((thoughts) => {
        if (!thoughts) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(thoughts);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};

module.exports = thoughtController;
