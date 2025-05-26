const index = (req, res) =>
  res.send({
    status: "success",
    code: 200,
    message: "OK",
    data: {
      books: [
        { id: "ab", title: "hawk" },
        { id: "cd", title: "something else" },
        { id: "ef", title: "My book title" },
      ],
    },
  });

module.exports = {
  index,
};
