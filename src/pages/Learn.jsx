import React, {useEffect, useState} from 'react'
import { GetMarkLearn, GetLearn } from '../redux/apiRequest'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Modal, { ModalBody, ModalFooter, ModalTitle } from '../components/Modal'
import LearnCpn from '../components/LearnCpn'
import Helmet from '../components/Helmet';
import Skeleton from '../components/Skeleton';
import HeaderPrimary from '../components/HeaderPrimary'


const Learn = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {cardId} = useParams()
  //   mang cau hoi
  const [question, setQuestion] = useState([])

  const {loading} = useSelector(state => state.middle)
  const user = useSelector(state => state.user.currentUser?.user._id)
  //   ket qua cham diem tra ve
  const [index, setIndex] = useState(0)
  const [mark, setMark] = useState(0)
  const [result, setResult] = useState({})
  const [isResult, setIsResult] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState(1)
  const [round, setRound] = useState(0)


  const getQuestion = async (cardId) => {
    const res = await GetLearn(dispatch, cardId, user, 10)
    if(res.question?.length === 0){
      setModalType(2)
      setModalOpen(true)
    }else{
      setQuestion(res.question)
      setRound(round => round + 1)
    }
  }
  useEffect(() => {
    getQuestion(cardId)
  }, [cardId])

    const handleIndex = () => {
        let nextIndex = index + 1
        if(nextIndex < question.length){
            setIndex(nextIndex)
            setResult({})
            setIsResult(false)
        }else{
            setModalOpen(true)
        }
    }

    const handleQues = async(e) => {
        let ques = {
            prompt: question[index].prompt,
            answer: e.target.innerHTML,
            id: question[index]._id
        }
        const res = await GetMarkLearn(dispatch, cardId, ques, user)
        setResult(res)
        setIsResult(true)
        if(res.check === true){
            let Imark = mark + 1
            setMark(Imark)
        }
    }

    const handleNextQuestion = () => {
      getQuestion(cardId)
      setResult({})
      setIsResult(false)
      setIndex(0)
      setModalOpen(false)
    }

    const handleReLearn = () => {
      setResult({})
      setIsResult(false)
      setIndex(0)
      setModalOpen(false)
    }
    
    return (
    <Helmet title='Học tập | Flux'>
    <div className="learn">
      <HeaderPrimary value={index} length={question?.length} round={round} title="Học tập"/>
      <LearnCpn handleQues={handleQues} question={question[index]} isResult={isResult} result={result}/>
        {
          isResult && <>
              <div className="learn__notifi">
                  <div className="learn__notifi__txt">
                      {
                          result.check === false ?
                          <p className='wrong'><i className="fa-solid fa-x"></i>Không sao, hãy tiếp tục học !</p>
                          : <p className='true'><i className="fa-solid fa-check"></i>Chính xác rồi !</p>
                      }
                  </div>
                  <div className="learn__notifi__btn" onClick={handleIndex}>
                      Tiếp tục
                  </div>
              </div>
          </>
        }
        {
          modalOpen && <Modal
            modalOpen={modalOpen}
          >
            <ModalTitle setModalOpen={setModalOpen}>
              <h4>Kết quả</h4>
            </ModalTitle>
            <ModalBody>
              <p>Bạn trả lời đúng {mark}/{question.length}</p>
            </ModalBody>
            <ModalFooter>
              <button
                className='cancel-btn'
                onClick={handleReLearn}
              >
                Học lại
              </button>
              <button
                className='ok-btn'
                onClick={handleNextQuestion}
              >
                tiếp tục
              </button>
            </ModalFooter>
          </Modal>
        }
        {
          modalOpen && modalType === 2 && <Modal
            modalOpen={modalOpen}
          >
            <ModalTitle setModalOpen={setModalOpen}>
              <h4>Hoàn thành</h4>
            </ModalTitle>
            <ModalBody>
              <p>Bạn đã hoàn thành học phần này</p>
            </ModalBody>
            <ModalFooter>
              <button
                className='ok-btn'
                onClick={() => navigate(-1)}
              >
                Quay lại
              </button>
            </ModalFooter>
          </Modal>
        }
        
      {loading && <Skeleton />}
    </div>
    </Helmet>
  )
}

export default Learn