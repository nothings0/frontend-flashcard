import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UpdateTask } from "../../redux/calendarApi/taskApi";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextareaAutosize } from "@mui/base";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "react-query";

const Task = ({ data, index, handleDelete }) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  let timer;
  const timeOut = 500;

  const [taskContent, setTaskContent] = useState("");
  const [taskTime, setTaskTime] = useState("");

  useEffect(() => {
    setTaskContent(data.content);
    setTaskTime(dayjs(data.time));
  }, []);

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: (data, dataList) => UpdateTask(data._id, dataList, accessToken),
  });

  const handleSelect = (e) => {
    e.target.focus();
    e.target.select();
  };

  const handleUpdate = () => {
    let dataList = {
      content: taskContent,
      time: dayjs(taskTime, "HH:mm DD/MM/YYYY"),
    };
    clearTimeout(timer);
    timer = setTimeout(() => {
      mutateUpdate((data, dataList), {
        onSuccess: () => {
          queryClient.invalidateQueries(["board"]);
        },
      });
    }, timeOut);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };
  const date = new Date();
  // console.log(date.toISOString() > data.time.toISOString());
  return (
    <div
      className={`task__item ${date.toISOString() > data.time ? "stale" : ""}`}
    >
      <div className="task__item__selector"></div>
      <div
        className="task__item__delete"
        onClick={() => handleDelete(data._id, accessToken, index)}
      >
        <i className="fa-solid fa-xmark"></i>
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          format="HH:mm DD/MM/YYYY"
          value={taskTime}
          onChange={(e) => setTaskTime(e)}
          onAccept={handleUpdate}
          className="date-time"
        />
      </LocalizationProvider>
      <TextareaAutosize
        value={taskContent}
        onChange={(e) => setTaskContent(e.target.value)}
        onClick={handleSelect}
        onBlur={handleUpdate}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Task;
