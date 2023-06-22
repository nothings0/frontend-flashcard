import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import Helmet from "../components/Helmet";
import Section from "../components/calendar/Section";
import { Container, Draggable } from "react-smooth-dnd";
import { useDispatch, useSelector } from "react-redux";
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
import { sortOrder } from "../util/index";
import { calendarData } from "../FakeDta/calendarData";
import Skeleton from "../components/Skeleton";

const Calendar = () => {
  const [board, setBoard] = useState({});
  const [sections, setSections] = useState([]);
  const [boardTitle, setBoardTitle] = useState("Sắp xếp thời gian học tập");
  const [sectionTitle, setSectionTitle] = useState("");
  const [isOpenFormAdd, setOpenFormAdd] = useState(false);

  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const { loading } = useSelector((state) => state.middle);
  let timer;
  const timeOut = 500;

  useEffect(() => {
    const getBoard = async () => {
      const res = await GetBoard(accessToken, dispatch);
      if (res) {
        setBoard(res.board);
        setBoardTitle(res.board.title);
        if (res.board.cardOrder.length > 0) {
          setSections(sortOrder(res.sections, res.board.cardOrder, "_id"));
        } else {
          setSections(
            sortOrder(
              calendarData.sections,
              calendarData.board.cardOrder,
              "_id"
            )
          );
        }
      } else {
        const data = { ...calendarData, title: boardTitle };
        await CreateBoard(data, accessToken, dispatch);
        setBoard(calendarData.board);
        setSections(
          sortOrder(calendarData.sections, calendarData.board.cardOrder, "_id")
        );
      }
    };
    getBoard();
  }, []);

  const onCardDrop = (result) => {
    if (result.removedIndex || result.addedIndex) {
      let newSections = [...sections];
      newSections = applyDrag(newSections, result);
      if (result.removedIndex !== result.addedIndex) {
        let newBoard = { ...board };
        newBoard.cardOrder = newSections.map((colume) => colume._id);
        clearTimeout(timer);
        timer = setTimeout(() => {
          UpdatePositionSection(newBoard.cardOrder, accessToken);
        }, timeOut);
        setBoard(newBoard);
        setSections(newSections);
      }
    }
  };

  const onTaskDrop = (result, columnId) => {
    if (result.removedIndex || result.addedIndex) {
      if (result.removedIndex !== result.addedIndex) {
        console.log(result);
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
          UpdatePositionTask(
            currentSection.taskOrder,
            currentSection._id,
            sectionIdAdded,
            result.payload._id,
            accessToken
          );
        }, timeOut);
        setSections(newSections);
      }
    }
  };

  const handleCreateSection = async () => {
    const res = await CreateSection(sectionTitle, board._id, accessToken);
    const newSections = [...sections, res.section];
    setSections(newSections);
    setOpenFormAdd(false);
  };

  const handleDeleteSection = (sectionId, accessToken, i) => {
    clearTimeout(timer);
    let newSections = [...sections];
    newSections.splice(i, 1);
    setSections(newSections);
    timer = setTimeout(() => {
      DeleteSection(sectionId, accessToken);
    }, timeOut);
  };

  const handleUpdateBoard = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      UpdateBoard(boardTitle, board._id, accessToken);
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
        {loading ? (
          <Skeleton type="calendar" />
        ) : (
          <>
            {Object.keys(board).length !== 0 && (
              <>
                <div className="calendar__title">
                  <input
                    type="text"
                    value={boardTitle}
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
