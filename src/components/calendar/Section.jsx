import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Draggable } from "react-smooth-dnd";
import {
  CreateSection,
  UpdateSection,
} from "../../redux/calendarApi/sectionApi";
import { CreateTask, DeleteTask } from "../../redux/calendarApi/taskApi";
import Task from "./Task";
import { useMutation, useQueryClient } from "react-query";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

let timer;
const timeOut = 500;

const Section = ({ data, onTaskDrop, handleDeleteSection, boardId }) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  const tasks = data?.tasks;

  const [isOpenFormAdd, setOpenFormAdd] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    setSectionTitle(data.title);
  }, [data]);

  const { mutate: mutateCreate } = useMutation({
    mutationFn: ({ dataTask }) => CreateTask(dataTask, accessToken),
  });
  const { mutate: mutateDelete } = useMutation({
    mutationFn: ({ taskId, sectionId }) =>
      DeleteTask(taskId, sectionId, accessToken),
  });
  const { mutate: mutateCreateSection } = useMutation({
    mutationFn: ({ sectionTitle, boardId }) =>
      CreateSection(sectionTitle, boardId, accessToken),
  });
  const { mutate: mutateUpdateSection } = useMutation({
    mutationFn: ({ sectionTitle }) => UpdateSection(sectionTitle, accessToken),
  });

  const handleCreateTask = async () => {
    const dataTask = {
      taskContent,
      sectionId: data._id,
      time: dayjs(time, "HH:mm DD/MM/YYYY"),
    };
    mutateCreate(
      { dataTask },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["board"]);
        },
      }
    );
    setOpenFormAdd(false);
    setTaskContent("");
  };

  const handleDelete = (taskId, sectionId) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      mutateDelete(
        { taskId, sectionId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["board"]);
          },
        }
      );
    }, timeOut);
  };

  const handleSelect = (e) => {
    e.target.focus();
    e.target.select();
  };

  const handleUpdateSection = () => {
    if (data.board === "board-1") {
      mutateCreateSection(
        { sectionTitle, boardId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["board"]);
          },
        }
      );
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        mutateUpdateSection(
          { sectionTitle },
          {
            onSuccess: () => {
              queryClient.invalidateQueries(["board"]);
            },
          }
        );
      }, timeOut);
    }
  };

  return (
    <div className="section">
      <div className="section__title">
        <div className="section__selector"></div>
        <textarea
          maxLength="30"
          placeholder="United"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          onClick={handleSelect}
          onKeyDown={handleUpdateSection}
        />
        <div
          className="section__title__delete"
          onClick={() => handleDeleteSection(data._id)}
        >
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>
      <div className="section__top">
        {isOpenFormAdd ? (
          <div className="section__top__form">
            <textarea
              maxLength="250"
              placeholder="United"
              rows="4"
              value={taskContent}
              onChange={(e) => setTaskContent(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                format="HH:mm DD/MM/YYYY"
                value={time}
                onChange={(e) => setTime(e)}
                className="date-time"
                ampm={false}
                minDateTime={dayjs(new Date())}
              />
            </LocalizationProvider>
            <div className="section__top__form__btn">
              <div
                className="section__top__form__btn__cancel"
                onClick={() => setOpenFormAdd(false)}
              >
                Cancel
              </div>
              <div
                className="section__top__form__btn__add"
                onClick={() => handleCreateTask(accessToken)}
              >
                Add
              </div>
            </div>
          </div>
        ) : (
          <div
            className="section__top__create"
            onClick={() => setOpenFormAdd(true)}
          >
            <i className="fa-solid fa-plus"></i> Add Task
          </div>
        )}
      </div>
      {tasks && (
        <Container
          groupName="task__item"
          onDrop={(dropResult) => onTaskDrop(dropResult, data._id)}
          getChildPayload={(index) => tasks[index]}
          dragClass="task__item-ghost"
          dropClass="task__item-ghost-drop"
          dragHandleSelector=".task__item__selector"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "task__item__drop-preview",
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {tasks.map((item, idx) => (
            <Draggable key={item._id}>
              <Task
                data={item}
                handleDelete={() => handleDelete(item._id, data._id)}
                index={idx}
              />
            </Draggable>
          ))}
        </Container>
      )}
    </div>
  );
};

export default Section;
