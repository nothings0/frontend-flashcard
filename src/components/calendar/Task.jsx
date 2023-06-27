import { useState } from "react";
import { useSelector } from "react-redux";
import { UpdateTask } from "../../redux/calendarApi/taskApi";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextareaAutosize } from "@mui/base";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "react-query";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

const Task = ({ data, handleDelete }) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  let timer;
  const timeOut = 500;

  const [taskContent, setTaskContent] = useState(data ? data.content : "");
  const [taskTime, setTaskTime] = useState(data ? dayjs(data.time) : "");
  const [isEdit, setEdit] = useState(false);

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: ({ data, dataList }) =>
      UpdateTask(data._id, dataList, accessToken),
  });

  const handleSelect = (ele) => {
    ele.focus();
    ele.select();
  };

  const handleUpdate = () => {
    let dataList = {
      content: taskContent,
      time: taskTime,
    };
    clearTimeout(timer);
    timer = setTimeout(() => {
      mutateUpdate(
        { data, dataList },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["board"]);
          },
        }
      );
    }, timeOut);
    setEdit(false);
  };

  const date = new Date();

  return (
    <div
      className={`task__item ${date.toISOString() > data.time ? "stale" : ""}`}
    >
      <div className="task__item__selector"></div>
      <div className="task__item__delete" onClick={handleDelete}>
        <i className="fa-solid fa-xmark"></i>
      </div>
      <div style={{ padding: "5px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            format="hh:mm DD/MM/YYYY"
            value={taskTime}
            onChange={(e) => setTaskTime(e.$d)}
            ampm={false}
            className="date-time"
            minDateTime={dayjs(new Date())}
            onClose={() => setEdit(true)}
          />
        </LocalizationProvider>
        <TextareaAutosize
          value={taskContent}
          onChange={(e) => {
            setTaskContent(e.target.value);
            setEdit(true);
          }}
          onClick={(e) => handleSelect(e.target)}
        />
        {isEdit && (
          <div className="section__top__form__btn">
            <div
              className="section__top__form__btn__cancel"
              onClick={() => setEdit(false)}
            >
              Hủy
            </div>
            <div
              className="section__top__form__btn__add"
              onClick={handleUpdate}
            >
              Lưu
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
