export const calendarData = {
    board: {
        cardOrder: ["cot-1", "cot-2", "cot-3"],
        title: "Sắp xếp thời gian học tập!!!",
        user: "admin",
        _id: "board-1"
    },
    sections: [
        {
            board: "board-1",
            taskOrder: [
                "task-1.1", "task-1.2", "task-1.3", "task-1.4"
            ],
            tasks: [
                {
                    content: "Ghi nhớ từ vựng công nghệ thông tin",
                    section: "board-1",
                    title: "Ghi nhớ từ vựng",
                    _id: "task-1.1"
                },
                {
                    content: "Luyện nghe tiếng anh trên video youtube ...",
                    section: "board-1",
                    title: "Luyện nghe tiếng anh",
                    _id: "task-1.2"
                },
                {
                    content: "Kiểm tra ghi nhớ từ vựng",
                    section: "board-1",
                    title: "Kiểm tra",
                    _id: "task-1.3"
                },
                {
                    content: "Ghi nhớ từ vựng công nghệ thông tin ...",
                    section: "board-1",
                    title: "Ghi nhớ từ vựng",
                    _id: "task-1.4"
                }
            ],
            title: "Việc làm",
            _id: "cot-1"
        },
        {
            board: "board-1",
            taskOrder: [
                "task-2.1"
            ],
            tasks: [
                {
                    content: "Ghi nhớ từ vựng công nghệ thông tin ...",
                    section: "board-1",
                    title: "Ghi nhớ từ vựng",
                    _id: "task-2.1"
                }
            ],
            title: "Đang làm",
            _id: "cot-2"
        },
        {
            board: "board-1",
            taskOrder: [
                "task-3.1", "task-3.2", "task-3.3"
            ],
            tasks: [
                {
                    content: "Kiểm tra xong",
                    section: "board-1",
                    title: "Kiểm tra",
                    _id: "task-3.1"
                },
                {
                    content: "Đã xong",
                    section: "board-1",
                    title: "Làm bài tập về nhà giải tích",
                    _id: "task-3.2"
                },
                {
                    content: "Nhớ 40 / 60 từ",
                    section: "board-1",
                    title: "Ghi nhớ từ vựng",
                    _id: "task-3.3"
                }
            ],
            title: "Hoàn thành",
            _id: "cot-3"
        }
    ]
}