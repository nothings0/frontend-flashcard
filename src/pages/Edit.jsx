import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCardById,
  UpdateCard,
  genAiCard,
  GetTranslate,
} from "../redux/apiRequest";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../components/Modal";
import Search from "../components/Search";
import Helmet from "../components/Helmet";
import Skeleton from "../components/Skeleton";
import TermWrap from "../components/TermWrap";

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

const Edit = () => {
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const userId = useSelector((state) => state.user.currentUser?.user._id);
  const { loading } = useSelector((state) => state.middle);
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [terms, setTerms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [isStreaming, setIsStreaming] = useState(false);
  const [total, setTotal] = useState(1);
  const [page, setPage] = useState(1);
  const topRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      share: true,
      background: colors[0].css,
    },
    validationSchema: Yup.object({
      title: Yup.string().max(50, "Tối đa 50 ký tự").required("Bắt buộc"),
      description: Yup.string().max(200, "Tối đa 200 ký tự"),
    }),
    onSubmit: async (values) => {
      const newTerms = terms.filter(
        (term) => term.prompt.trim() !== "" && term.answer.trim() !== ""
      );
      if (newTerms.length < 2) {
        setModalOpen(true);
        return;
      }
      const newCard = {
        title: values.title,
        description: values.description,
        share: values.share,
        background: values.background,
        language,
        term: newTerms,
      };
      const res = await UpdateCard(
        newCard,
        slug,
        accessToken,
        userId,
        dispatch
      );
      if (res.type === "failure") return;
      navigate(`/card/${slug}`);
    },
  });

  useEffect(() => {
    if (!userId || !accessToken) {
      navigate("/login");
      return;
    }
    const getData = async () => {
      const res = await getCardById(dispatch, slug, page, 50);
      if (res.cards.user._id !== userId) {
        navigate("/");
        return;
      }
      if (page === 1) {
        setTotal(res.total);
        formik.setValues({
          title: res.cards.title,
          description: res.cards.description,
          share: res.cards.share,
          background: res.cards.background,
        });
      }
      setTerms((prev) => [...prev, ...res.terms]);
    };
    getData();
  }, [slug, page, userId, accessToken, navigate, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        document.body.scrollTop >= 60 ||
        document.documentElement.scrollTop >= 60
      ) {
        topRef?.current?.classList.add("shrink");
      } else {
        topRef?.current?.classList.remove("shrink");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleView = () => {
    setTerms([...terms, { prompt: "", answer: "" }]);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleGenerateTerms = async () => {
    if (isStreaming || !formik.values.title) return;
    setIsStreaming(true);
    try {
      const existingPrompts = terms
        .filter((term) => term.prompt.trim() !== "")
        .map((term) => term.prompt);
      const response = await genAiCard(
        { title: formik.values.title, language, accessToken, existingPrompts },
        dispatch
      );
      if (!response) return;

      const reader = response.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim()) {
            try {
              const term = JSON.parse(line);
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

  const typeText = async (index, text, field) => {
    let currentText = "";
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setTerms((prev) => {
        const newTerms = [...prev];
        newTerms[index] = { ...newTerms[index], [field]: currentText };
        return newTerms;
      });
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  };

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

  const handleCardDelete = (i) => {
    let updatedTerms = [...terms];
    updatedTerms.splice(i, 1);
    setTerms(updatedTerms);
  };

  return (
    <Helmet title={`${formik.values.title || "Loading"} | Flux`}>
      <div className="edit">
        <Search />
        <div className="edit__top" ref={topRef}>
          <div className="edit__top__left">Chỉnh sửa học phần</div>
          <div className="edit__top__right">
            <button
              className="generate-terms-btn"
              onClick={handleGenerateTerms}
              disabled={isStreaming || !formik.values.title}
            >
              {isStreaming ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-robot"></i>
              )}
            </button>
            <div
              className="edit__top__right__create"
              onClick={formik.handleSubmit}
            >
              Hoàn tất
            </div>
          </div>
        </div>
        <div className="edit__header">
          <div className="edit__header__left">
            <div className="edit__header__input">
              <div className="edit__header__input__wrap">
                <textarea
                  maxLength="50"
                  placeholder="Nhập tiêu đề..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                  name="title"
                ></textarea>
                <small>{formik.values.title.length}/50</small>
                {formik.touched.title && formik.errors.title && (
                  <p className="errorMsg">{formik.errors.title}</p>
                )}
              </div>
              <p>tiêu đề</p>
            </div>
            <div className="edit__header__input">
              <div className="edit__header__input__wrap">
                <textarea
                  maxLength="200"
                  placeholder="Thêm mô tả"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  name="description"
                  className="edit__header__input__wrap__des"
                  rows={4}
                ></textarea>
                <small>{formik.values.description.length}/200</small>
                {formik.touched.description && formik.errors.description && (
                  <p className="errorMsg">{formik.errors.description}</p>
                )}
              </div>
              <p>mô tả</p>
            </div>
          </div>
          <div className="edit__header__right">
            <div className="edit__header__right__item">
              <div className="edit__header__right__item__txt">Ảnh nền</div>
              <div className="edit__header__right__item__color">
                {colors.map((item, index) => (
                  <div
                    className={`edit__header__right__item__color__item ${
                      item.css === formik.values.background ? "active" : ""
                    }`}
                    key={index}
                    style={{ background: item.css }}
                    onClick={() => formik.setFieldValue("background", item.css)}
                  ></div>
                ))}
              </div>
            </div>
            <div className="edit__header__right__item">
              <div className="checkbox__private">
                <div className="checkbox__private__txt">
                  Share{" "}
                  <input
                    type="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.share}
                    name="share"
                  />
                </div>
              </div>

              <div className="language__choice">
                Ngôn ngữ
                <select
                  className="language__choice__select"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="en-US">Tiếng Anh</option>
                  <option value="ko-KR">Tiếng Hàn</option>
                  <option value="cmn-Hant-TW">Tiếng Trung</option>
                  <option value="ja-JP">Tiếng Nhật</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="edit__term">
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
          {total > terms.length && (
            <div className="load-more">
              <span onClick={handleLoadMore}>Xem thêm</span>
            </div>
          )}
        </div>
        <div className="edit__btn" onClick={handleView}>
          <div className="edit__btn__wrap">
            <i className="fa-solid fa-plus"></i> thêm thẻ
          </div>
        </div>
        {modalOpen && (
          <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <ModalTitle fnClose={() => setModalOpen(false)}>
              <h4>Lỗi chỉnh sửa học phần</h4>
            </ModalTitle>
            <ModalBody>
              <p>Bạn phải có ít nhất 2 thuật ngữ để lưu học phần</p>
            </ModalBody>
            <ModalFooter>
              <button className="cancel-btn" onClick={() => navigate(-1)}>
                Quay lại
              </button>
              <button className="ok-btn" onClick={() => setModalOpen(false)}>
                Ok
              </button>
            </ModalFooter>
          </Modal>
        )}
        {loading && <Skeleton />}
      </div>
    </Helmet>
  );
};

export default Edit;
