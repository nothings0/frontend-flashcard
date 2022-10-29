import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Modal, { ModalBody, ModalFooter, ModalTitle } from '../components/Modal'
import { GetWrite, GetMarkWrite } from '../redux/apiRequest'
import WriteCpn from '../components/WriteCpn'
import Helmet from '../components/Helmet';
import Skeleton from '../components/Skeleton'
import HeaderPrimary from '../components/HeaderPrimary'


const Write = () => {
    const {cardId} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const { loading } = useSelector((state) => state.middle)
    const user = useSelector(state => state.user.currentUser?.user._id)

    const [index, setIndex] = useState(0)
    const [mark, setMark] = useState(0)
    const [result, setResult] = useState({})
    const [isResult, setIsResult] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [answer, setAnswer] = useState("")

    const [data, setData] = useState([])
    const [modalType, setModalType] = useState(1)
    const [round, setRound] = useState(0)

    const getData = async (cardId) => {
      const res = await GetWrite(dispatch, cardId, user, 10)
      if(res.length === 0){
        setModalType(2)
        setModalOpen(true)
      }else{
        setData(res.question)
        setRound(round => round + 1)
      }
    }
    useEffect(() => {
      getData(cardId)
    }, [cardId])

    const handleIndex = () => {
      let nextIndex = index + 1
      if(nextIndex < data.length){
          setIndex(nextIndex)
          setResult({})
          setIsResult(false)
          setAnswer('')
      }else{
          setModalOpen(true)
      }
    }
    const handleQues = async() => {
        let ques = {
          answer: answer,
          id: data[index]._id
        }

        const res = await GetMarkWrite(dispatch, cardId, ques, user)
        setResult(res)
        setIsResult(true)
        if(res.check === true){
          let Imark = mark + 1
          setMark(Imark)
        }
    }
    const handleNextQuestion = () => {
      getData(cardId)
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
    <Helmet title='Luyện viết | Flux'>
    <div className="write">
      <HeaderPrimary value={index} length={data?.length} round={round} title='Luyện viết'/>
      <WriteCpn handleQues={handleQues} data={data[index]} answer={answer} setAnswer={setAnswer} isResult={isResult} handleIndex={handleIndex} result={result}/>
      {
        modalOpen && <Modal
        modalOpen={modalOpen}
      >
        <ModalTitle>
          <h4>Kết quả</h4>
          <i class="fa-solid fa-xmark"></i>
        </ModalTitle>
        <ModalBody>
          <p>Bạn trả lời đúng {mark}/{data.length}</p>
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

export default Write