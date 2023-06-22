export const calendarData = {
  board: {
    cardOrder: ["cot-1", "cot-2", "cot-3"],
    title: "Sắp xếp thời gian học tập!!!",
    user: "admin",
    _id: "board-1",
  },
  sections: [
    {
      board: "board-1",
      taskOrder: ["task-1.1", "task-1.2", "task-1.3", "task-1.4"],
      tasks: [
        {
          content: "Ghi nhớ từ vựng công nghệ thông tin",
          time: new Date(),
          section: "board-1",
          _id: "task-1.1",
        },
        {
          content: "Luyện nghe tiếng anh trên video youtube ...",
          time: new Date(),
          section: "board-1",
          _id: "task-1.2",
        },
        {
          content: "Kiểm tra ghi nhớ từ vựng",
          time: new Date(),
          section: "board-1",
          _id: "task-1.3",
        },
        {
          content: "Ghi nhớ từ vựng công nghệ thông tin ...",
          time: new Date(),
          section: "board-1",
          _id: "task-1.4",
        },
      ],
      title: "Việc làm",
      _id: "cot-1",
    },
    {
      board: "board-1",
      taskOrder: ["task-2.1"],
      tasks: [
        {
          content: "Ghi nhớ từ vựng công nghệ thông tin ...",
          time: new Date(),
          section: "board-1",
          _id: "task-2.1",
        },
      ],
      title: "Đang làm",
      _id: "cot-2",
    },
    {
      board: "board-1",
      taskOrder: ["task-3.1", "task-3.2", "task-3.3"],
      tasks: [
        {
          content: "Kiểm tra xong",
          time: new Date(),
          section: "board-1",
          _id: "task-3.1",
        },
        {
          content: "Đã xong",
          time: new Date(),
          section: "board-1",
          _id: "task-3.2",
        },
        {
          content: "Nhớ 40 / 60 từ",
          time: new Date(),
          section: "board-1",
          _id: "task-3.3",
        },
      ],
      title: "Hoàn thành",
      _id: "cot-3",
    },
  ],
};
