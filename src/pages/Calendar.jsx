import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import Helmet from "../components/Helmet";
import Section from "../components/calendar/Section";
import { Container, Draggable } from "react-smooth-dnd";
import { useSelector } from "react-redux";
import { applyDrag } from "../util/index";
import {
  GetBoard,
  CreateBoard,
  UpdateBoard,
} from "../redux/calendarApi/boardApi";
import {
  CreateSection,
  UpdatePositionSection,
  DeleteSection,
} from "../redux/calendarApi/sectionApi";
import { UpdatePositionTask } from "../redux/calendarApi/taskApi";
import { calendarData } from "../FakeDta/calendarData";
import Skeleton from "../components/Skeleton";
import { useQuery, useQueryClient, useMutation } from "react-query";

const Calendar = () => {
  // const [board, setBoard] = useState({});
  // const [sections, setSections] = useState([]);
  const [boardTitle, setBoardTitle] = useState("Sắp xếp thời gian học tập");
  const [sectionTitle, setSectionTitle] = useState("");
  const [isOpenFormAdd, setOpenFormAdd] = useState(false);
  const queryClient = useQueryClient();

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  let timer;
  const timeOut = 500;

  const { data: boardData, isLoading } = useQuery({
    queryFn: () => GetBoard(accessToken),
    queryKey: "board",
    staleTime: 3 * 60 * 1000,
  });

  const { mutate: mutateSection } = useMutation({
    mutationFn: (newBoard) =>
      UpdatePositionSection(newBoard.cardOrder, accessToken),
  });
  const { mutate: mutateCreateBoard, isLoading: isLoadingMutate } = useMutation(
    {
      mutationFn: () => CreateBoard(calendarData, accessToken),
    }
  );
  const { mutate: mutateCreateSection } = useMutation({
    mutationFn: (sectionTitle, board) =>
      CreateSection(sectionTitle, board._id, accessToken),
  });
  const { mutate: mutateUpdate } = useMutation({
    mutationFn: (boardTitle, board) =>
      UpdateBoard(boardTitle, board._id, accessToken),
  });
  const { mutate: mutateTask } = useMutation({
    mutationFn: ({ currentSection, sectionIdAdded, result }) =>
      UpdatePositionTask(
        currentSection.taskOrder,
        currentSection._id,
        sectionIdAdded,
        result.payload._id,
        accessToken
      ),
  });

  const board = boardData?.board;
  const sections = boardData?.sections;

  useEffect(() => {
    if (boardData) {
      // if (board.cardOrder.length > 0) {
      //   sections = sortOrder(sections, board.cardOrder, "_id");
      // }
      return;
    }
    mutateCreateBoard({
      onSuccess: () => {
        queryClient.invalidateQueries(["board"]);
      },
    });
  }, [boardData]);

  const onCardDrop = (result) => {
    if (result.removedIndex || result.addedIndex) {
      let newSections = [...sections];
      newSections = applyDrag(newSections, result);
      if (result.removedIndex !== result.addedIndex) {
        let newBoard = { ...board };
        newBoard.cardOrder = newSections.map((colume) => colume._id);
        clearTimeout(timer);
        timer = setTimeout(() => {
          mutateSection(newBoard, {
            onSuccess: () => {
              queryClient.invalidateQueries(["board"]);
            },
          });
        }, timeOut);
      }
    }
  };

  const onTaskDrop = (result, columnId) => {
    if (result.removedIndex || result.addedIndex) {
      if (result.removedIndex !== result.addedIndex) {
        let newSections = [...sections];
        let currentSection = newSections.find((item) => item._id === columnId);
        currentSection.tasks = applyDrag(currentSection.tasks, result);
        currentSection.taskOrder = currentSection.tasks.map((task) => task._id);
        let sectionIdAdded;
        if (currentSection._id !== result.payload.section) {
          sectionIdAdded = currentSection._id;
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          mutateTask(
            { currentSection, sectionIdAdded, result },
            {
              onSuccess: () => {
                queryClient.invalidateQueries(["board"]);
              },
            }
          );
        }, timeOut);
      }
    }
  };

  const handleCreateSection = async () => {
    mutateCreateSection((sectionTitle, board), {
      onSuccess: () => {
        queryClient.invalidateQueries(["board"]);
      },
    });
    setOpenFormAdd(false);
  };

  const handleDeleteSection = (sectionId, accessToken, i) => {
    clearTimeout(timer);
    let newSections = [...sections];
    newSections.splice(i, 1);
    timer = setTimeout(() => {
      DeleteSection(sectionId, accessToken);
    }, timeOut);
  };

  const handleUpdateBoard = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      mutateUpdate((boardTitle, board), {
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

  return (
    <Helmet title="Calendar | Flux">
      <div className="calendar">
        <Search />
        {isLoading || isLoadingMutate ? (
          <Skeleton type="calendar" />
        ) : (
          <>
            {board && Object.keys(board).length !== 0 && (
              <>
                <div className="calendar__title">
                  <input
                    type="text"
                    value={board.title}
                    onChange={(e) => setBoardTitle(e.target.value)}
                    onBlur={handleUpdateBoard}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Container
                  groupName="section"
                  orientation="horizontal"
                  onDrop={onCardDrop}
                  getChildPayload={(index) => sections[index]}
                  dragClass="section-ghost"
                  dropClass="section-ghost-drop"
                  dragHandleSelector=".section__selector"
                  dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: "section__drop-preview",
                  }}
                  dropPlaceholderAnimationDuration={200}
                >
                  {sections?.map((item, index) => (
                    <Draggable key={item._id}>
                      <Section
                        data={item}
                        boardId={board?._id}
                        onTaskDrop={onTaskDrop}
                        handleDeleteSection={handleDeleteSection}
                        index={index}
                      />
                    </Draggable>
                  ))}
                  <div className="calendar__column">
                    <div className="calendar__column__top">
                      {isOpenFormAdd ? (
                        <div className="calendar__column__top__form">
                          <textarea
                            maxLength="50"
                            placeholder="United"
                            value={sectionTitle}
                            onChange={(e) => setSectionTitle(e.target.value)}
                          />
                          <div className="calendar__column__top__form__btn">
                            <div
                              className="calendar__column__top__form__btn__add"
                              onClick={() =>
                                handleCreateSection(sectionTitle, accessToken)
                              }
                            >
                              Add
                            </div>
                            <div
                              className="calendar__column__top__form__btn__cancel"
                              onClick={() => setOpenFormAdd(false)}
                            >
                              Cancel
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="calendar__column__top__create"
                          onClick={() => setOpenFormAdd(true)}
                        >
                          Add new colume <i className="fa-solid fa-plus"></i>
                        </div>
                      )}
                    </div>
                  </div>
                </Container>
              </>
            )}
          </>
        )}
      </div>
    </Helmet>
  );
};

export default Calendar;
