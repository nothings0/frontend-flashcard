import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Draggable } from "react-smooth-dnd";
import { handleVoice } from "../util/speech";
import { applyDrag } from "../util/index";
import { useParams } from "react-router-dom";
import { DeleteTerm, UpdateCard } from "../redux/apiRequest";
import { showToast } from "../redux/toastSlice";

const TermWrap = ({ terms, setTerms, iUsername, type }) => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const userId = useSelector((state) => state.user.currentUser?.user._id);
  const username = useSelector(
    (state) => state.user.currentUser?.user.username
  );

  const handleCardChange = (e, index) => {
    const { name, value } = e.target;
    let termArr = [...terms];
    termArr[index] = { ...termArr[index], [name]: value };
    setTerms(termArr);
  };

  const handleSelect = (e) => {
    e.target.focus();
    e.target.select();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  const handleCardDelete = (i) => {
    let updatedTerms = [...terms];
    updatedTerms.splice(i, 1);
    setTerms(updatedTerms);
    if (terms[i]._id) {
      DeleteTerm(accessToken, terms[i]._id);
      dispatch(showToast({ msg: "Xóa thành công", success: true }));
    }
  };

  const onCardDrop = (result) => {
    if (result.addedIndex === result.removedIndex) return;
    let newTerms = [...terms];
    newTerms = applyDrag(newTerms, result);
    let newCard = {
      ...terms,
      term: newTerms,
    };
    setTerms(newTerms);
    UpdateCard(newCard, slug, accessToken, userId, dispatch);
  };

  return (
    <div className="term-wrap">
      <div className="card-detail__des__term">
        <Container
          groupName="col"
          onDrop={onCardDrop}
          getChildPayload={(index) => terms[index]}
          dragClassName="card-ghost"
          dropClassName="card-ghost-drop"
          dragHandleSelector=".term-selector"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "term-drop-preview",
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {terms &&
            terms.map((_, index) => (
              <Draggable key={index}>
                <div className="card-detail__des__term__item">
                  {type !== "detail" ? (
                    <>
                      <div className="card-detail__des__term__prompt prompt">
                        <textarea
                          name="prompt"
                          maxLength="255"
                          value={terms[index]?.prompt}
                          onChange={(e) => handleCardChange(e, index)}
                          onClick={handleSelect}
                          onKeyDown={handleKeyDown}
                          spellCheck="false"
                        ></textarea>
                      </div>
                      <div className="card-detail__des__term__answer">
                        <textarea
                          name="answer"
                          maxLength="255"
                          value={terms[index]?.answer}
                          onChange={(e) => handleCardChange(e, index)}
                          onClick={handleSelect}
                          onKeyDown={handleKeyDown}
                          spellCheck="false"
                        ></textarea>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="card-detail__des__term__prompt prompt">
                        <p>{terms[index]?.prompt}</p>
                      </div>
                      <div className="card-detail__des__term__answer">
                        <p>{terms[index]?.answer}</p>
                      </div>
                    </>
                  )}
                  <div className="card-detail__des__term__icon">
                    <i
                      className="fa-solid fa-volume-high"
                      onClick={(e) =>
                        handleVoice(
                          e.target.parentElement.parentElement.querySelector(
                            ".prompt"
                          ).textContent
                        )
                      }
                    />
                    <i
                      className={`${
                        username !== iUsername && "disable"
                      } fa-solid fa-trash-can`}
                      onClick={() => handleCardDelete(index)}
                    ></i>
                  </div>
                  <div className="term-selector">
                    <i className="fa-solid fa-arrows-up-down-left-right"></i>
                  </div>
                </div>
              </Draggable>
            ))}
        </Container>
      </div>
    </div>
  );
};

export default memo(TermWrap);
