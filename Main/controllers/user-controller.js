const { User } = require('../models');

const userController = {

  // get all users
  getUsers(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
        select: "-__v"
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // get single user by id
  getSingleUser(req, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: 'friends', 
        select: '-__v'
      })
      .select("-__v")
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  
  // update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // delete user (BONUS: and delete associated thoughts)
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with this id!' });
        }

        // get ids of user's `thoughts` and delete them all
        return Thought.deleteMany({ username: user.username })
        .then(() => {
          res.json({ message: "Successfully deleted user" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
      })
      .then(() => {
        res.json({ message: 'User and associated thoughts deleted!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // add friend to friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { friends: req.params.friendId } }, 
      { runValidators: true, new: true })
      .populate({
        path: "friends",
        select: ("-__v")
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // remove friend from friend list
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id }, 
      { $pull: { friends: req.params.friendId } }, 
      { runValidators: true, new: true })
      .populate({
        path: "friends",
        select: ("-__v")
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};

module.exports = userController;
