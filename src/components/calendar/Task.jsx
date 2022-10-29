import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { UpdateTask } from '../../redux/calendarApi/taskApi';

const Task = ({data, index, handleDelete}) => {
    const accessToken = useSelector(state => state.user.currentUser?.accessToken)

    let timer
    const timeOut = 500

    const [taskContent, setTaskContent] = useState('')
    const [taskTitle, setTaskTitle] = useState('')

    useEffect(() => {
        setTaskContent(data.content)
        setTaskTitle(data.title)
    }, [])

    const handleSelect = (e) => {
      e.target.focus();
      e.target.select();
    }
  
    const handleUpdate = () => {
      let dataList = {
        title:taskTitle,
        content:taskContent
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
          UpdateTask(data._id, dataList, accessToken);
      }, timeOut)
    }
  
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.target.blur();
      }
    };

  return (
    <div className="task__item">
      <div className="task__item__selector">
      </div>
      <div className="task__item__delete" onClick={() => handleDelete(data._id, accessToken, index)}>
      <i className="fa-solid fa-xmark"></i>
      </div>
      <textarea maxLength="30" placeholder='Title...' value={taskTitle}
        className="task__item__title"
        onChange={e => setTaskTitle(e.target.value)}
        onClick={handleSelect}
        onBlur={handleUpdate}
        onKeyDown={handleKeyDown}
      />
      <textarea maxLength="250" placeholder='Task description...' 
        className="task__item__description"
        value={taskContent} 
        onChange={e => setTaskContent(e.target.value)}
        onClick={handleSelect}
        onBlur={handleUpdate}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export default Task