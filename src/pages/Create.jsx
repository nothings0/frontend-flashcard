import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AddCard, genAiCard, GetTranslate } from "../redux/apiRequest";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../components/Modal";
import Search from "../components/Search";
import Helmet from "../components/Helmet";
import Skeleton from "../components/Skeleton";
import Toast from "../components/Toast";

const colors = [
  {
    hex: "flux1",
    css: "linear-gradient(45deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
  },
  {
    hex: "flux2",
    css: "linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)",
  },
  {
    hex: "flux3",
    css: "linear-gradient(45deg, rgba(253,227,26,1) 0%, rgba(254,139,37,1) 100%)",
  },
  {
    hex: "flux4",
    css: "linear-gradient(135deg, rgba(154,4,129,1) 0%, rgba(220,61,99,1) 50%, rgba(254,115,23,1) 100%)",
  },
  {
    hex: "flux5",
    css: "linear-gradient(45deg, rgba(100,38,151,0.9) 0%, rgba(152,45,151,1) 50%, rgba(190,52,117,0.9) 100%)",
  },
  {
    hex: "flux6",
    css: "linear-gradient(45deg, rgba(38,49,151,1) 0%, rgba(39,22,96,1) 50%, rgba(147,52,190,1) 100%)",
  },
];

let timer;

const Create = () => {
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [terms, setTerms] = useState([]);
  const [description, setDescription] = useState("");
  const [background, setBackground] = useState(colors[0].css);
  const [share, setShare] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const topRef = useRef(null);
  const { loading } = useSelector((state) => state.middle);
  const { success, toast } = useSelector((state) => state.card);

  const { handleSubmit, handleChange, values, touched, errors, handleBlur } =
    useFormik({
      initialValues: {
        title: "",
      },
      validationSchema: Yup.object({
        title: Yup.string().required("Bắt buộc"),
      }),
      onSubmit: async (values) => {
        handleAdd(values.title);
      },
    });

  const handleView = () => {
    const newTerm = {
      prompt: "",
      answer: "",
    };
    let termArr = [...terms, newTerm];
    setTerms(termArr);
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop >= 60 ||
        document.documentElement.scrollTop >= 60
      ) {
        topRef?.current?.classList.add("shrink");
      } else {
        topRef?.current?.classList.remove("shrink");
      }
    });
    return () => {
      window.removeEventListener("scroll", null);
    };
  }, []);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    } else {
      const newTerm = {
        prompt: "",
        answer: "",
      };
      let termArr = [...terms, newTerm];
      setTerms(termArr);
    }
  }, [accessToken]);

  const handleCardChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "prompt") {
      const termArr = [...terms];
      termArr[index] = { ...termArr[index], prompt: value };
      setTerms(termArr);
      clearTimeout(timer);
      timer = setTimeout(async () => {
        if (value === "") return;
        const res = await GetTranslate(value);
        setMatches(res.matches);
        const translate = res.matches.sort(
          (a, b) => b["usage-count"] - a["usage-count"]
        );
        let termArr1 = [...terms];
        termArr1[index] = {
          prompt: value,
          answer: translate[0].translation,
        };
        setTerms(termArr1);
      }, 250);
    } else {
      let termArr = [...terms];
      termArr[index] = { ...termArr[index], answer: value };
      setTerms(termArr);
    }
  };

  const handleAdd = async (title) => {
    const newTerms = terms.filter(
      (term) => term.prompt.trim() !== "" && term.answer.trim() !== ""
    );
    const newCard = {
      title,
      description,
      share,
      background,
      term: newTerms,
    };
    if (newCard.term.length < 2) {
      setModalOpen(true);
    } else {
      const res = await AddCard(newCard, accessToken, dispatch);
      if (res?.type === "failure") return;
      else {
        navigate(`${res?.card? `/card/${res?.card?.slug}` : "/"}`); 
      }
    }
  };

  const handleCardDelete = (i) => {
    let updatedTerms = [...terms];
    updatedTerms.splice(i, 1);
    setTerms(updatedTerms);
  };

  const typeText = async (index, text, field) => {
    let currentText = "";
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setTerms((prev) => {
        const newTerms = [...prev];
        newTerms[index] = { ...newTerms[index], [field]: currentText };
        return newTerms;
      });
      await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms per character
    }
  };

  const handleGenerateTerms = async () => {
    if (isStreaming) return;
    setIsStreaming(true);

    try {
      const existingPrompts = terms
      .filter((term) => term.prompt.trim() !== "")
      .map((term) => term.prompt);

      const response = await genAiCard({
        title: values.title, accessToken, existingPrompts})

      if (!response.ok) {
        throw new Error("Failed to fetch terms");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete JSON objects
        const lines = buffer.split("\n");
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim()) {
            try {
              const term = JSON.parse(line);
              if (term.prompt && term.answer) {
                // Thêm term rỗng và lấy chỉ số từ prev.length
                setTerms((prev) => {
                  const newIndex = prev.length;
                  const newTerms = [...prev, { prompt: "", answer: "" }];
                  // Bắt đầu animation ngay sau khi thêm term
                  setTimeout(async () => {
                    await typeText(newIndex, term.prompt, "prompt");
                    await typeText(newIndex, term.answer, "answer");
                  }, 0);
                  return newTerms;
                });
              } else if (term.error) {
                console.error("Server error:", term.error);
                setTerms([{ prompt: "", answer: "" }]);
                break;
              }
            } catch (e) {
              console.error("Error parsing JSON:", line, e);
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        try {
          const term = JSON.parse(buffer);
          if (term.prompt && term.answer) {
            setTerms((prev) => {
              const newIndex = prev.length;
              const newTerms = [...prev, { prompt: "", answer: "" }];
              setTimeout(async () => {
                await typeText(newIndex, term.prompt, "prompt");
                await typeText(newIndex, term.answer, "answer");
              }, 0);
              return newTerms;
            });
          }
        } catch (e) {
          console.error("Error parsing final buffer:", buffer, e);
        }
      }
    } catch (error) {
      console.error("Error streaming terms:", error);
      setTerms([{ prompt: "", answer: "" }]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <Helmet title="Tạo | Flux">
      <div className="create">
        <Search />
        <div className="create__top" ref={topRef}>
          <div className="create__top__left">Tạo học phần mới</div>
          <div className="create__top__right">
            <button
              className="generate-terms-btn"
              onClick={handleGenerateTerms}
              disabled={isStreaming || !values.title}
            >
              {isStreaming ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-robot"></i>
              )}
            </button>
            <div className="create__top__right__create" onClick={handleSubmit}>
              Tạo
            </div>
          </div>
        </div>
        <div className="create__header">
          <div className="create__header__left">
            <div className="create__header__input">
              <div className="create__header__input__wrap">
                <textarea
                  maxLength="50"
                  placeholder="Nhập tiêu đề..."
                  onChange={handleChange}
                  value={values.title}
                  name="title"
                  onBlur={handleBlur}
                  autoFocus
                ></textarea>
                <small>{values.title.length}/50</small>
              </div>
              <p>
                tiêu đề{" "}
                {errors.title && touched.title && (
                  <span className="errorMsg"> {errors.title}</span>
                )}
              </p>
            </div>
            <div className="create__header__input">
              <div className="create__header__input__wrap">
                <textarea
                  maxLength="200"
                  placeholder="Thêm mô tả"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  className="create__header__input__wrap__des"
                  rows={4}
                ></textarea>
                <small>{description.length}/200</small>
              </div>
              <p>mô tả</p>
            </div>
          </div>
          <div className="create__header__right">
            <div className="create__header__right__item">
              <div className="create__header__right__item__txt">Ảnh nền</div>
              <div className="create__header__right__item__color">
                {colors.map((item, index) => {
                  const style = {
                    background: `${item.css}`,
                  };
                  return (
                    <div
                      className={`create__header__right__item__color__item ${
                        item.css === background ? "active" : ""
                      }`}
                      key={index}
                      style={style}
                      onClick={() => setBackground(item.css)}
                    ></div>
                  );
                })}
              </div>
            </div>
            <div className="create__header__right__item">
              <div className="checkbox__private">
                <div className="checkbox__private__txt">
                  Share{" "}
                  <input
                    type="checkbox"
                    onChange={(e) => setShare(e.target.checked)}
                    checked={share}
                    value={share}
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="create__term">
          {terms &&
            terms.map((item, index) => {
              if (!item) return null; // Bỏ qua item undefined
              return (
                <div className="term" key={index}>
                  <div className="term__header">
                    <div className="term__header__count">{index + 1}</div>
                    <div
                      className="term__header__control"
                      onClick={() => handleCardDelete(index)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </div>
                  </div>
                  <div className="term__content">
                    <div className="term__content__input">
                      <textarea
                        name="prompt"
                        maxLength="255"
                        onChange={(e) => handleCardChange(e, index)}
                        value={item.prompt || ""}
                      ></textarea>
                      <p>thuật ngữ</p>
                    </div>
                    <div className="term__content__input">
                      <textarea
                        name="answer"
                        maxLength="255"
                        onChange={(e) => handleCardChange(e, index)}
                        value={item.answer || ""}
                      ></textarea>
                      <p>định nghĩa</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="create__btn" onClick={handleView}>
          <div className="create__btn__wrap">
            <i className="fa-solid fa-plus"></i> thêm thẻ
          </div>
        </div>
        {modalOpen && (
          <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <ModalTitle fnClose={() => setModalOpen(false)}>
              <h4>Lỗi tạo học phần</h4>
            </ModalTitle>
            <ModalBody>
              <p>Bạn phải tạo ít nhất 2 thuật ngữ để bắt đầu học tập</p>
            </ModalBody>
            <ModalFooter>
              <button
                className="cancel-btn"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Ok
              </button>
            </ModalFooter>
          </Modal>
        )}
        {loading && <Skeleton />}
        {toast && <Toast type={success ? "success" : "error"} des={toast} />}
      </div>
    </Helmet>
  );
};

export default Create;
