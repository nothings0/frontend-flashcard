import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Draggable } from "react-smooth-dnd"
import { CreateSection, UpdateSection } from '../../redux/calendarApi/sectionApi';
import { CreateTask, DeleteTask } from '../../redux/calendarApi/taskApi';
import Task from './Task'
import { sortOrder } from '../../util/index';


const Section = ({data, onTaskDrop, handleDeleteSection, index, boardId}) => {
    
    let timer
    const timeOut = 500
    // const dispatch = useDispatch()
    const accessToken = useSelector(state => state.user.currentUser?.accessToken)
    
    const [isOpenFormAdd, setOpenFormAdd] = useState(false)
    const [tasks, setTasks] = useState([])
    const [taskTitle, setTaskTitle] = useState("")
    const [taskContent, setTaskContent] = useState("")
    const [sectionTitle, setSectionTitle] = useState("")

    useEffect(() => {
        setSectionTitle(data.title)
        setTasks(sortOrder(data.tasks, data.taskOrder, "_id") || [])
    }, [data.tasks, data.taskOrder])

    const handleCreateTask = async(accessToken) => {
        const dataTask = {
            taskContent,
            taskTitle,
            sectionId: data._id
        }
        const res = await CreateTask(dataTask, accessToken)
        const newTasks = [...tasks, res.task]
        setTasks(newTasks)
        setOpenFormAdd(false)
        setTaskContent('')
        setTaskTitle('')
    }

    const handleDelete = (taskId, accessToken, i) => {
        let newTasks = [...tasks]
        newTasks.splice(i, 1)
        setTasks(newTasks)
        clearTimeout(timer)
        timer = setTimeout(() => {
            DeleteTask(taskId, accessToken)
        }, timeOut)
    }

    const handleSelect = (e) => {
        e.target.focus();
        e.target.select();
    }

    const handleUpdateSection = () => {
        if(data.board === 'board-1'){
            CreateSection(sectionTitle, boardId, accessToken)
        }else{
            clearTimeout(timer)
            timer = setTimeout(() => {
                UpdateSection(sectionTitle, accessToken);
            }, timeOut)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.target.blur();
        }
    }
    
  return (
    <div className="section">
        <div className="section__title">
            <div className="section__selector"></div>
            <textarea maxLength="30" placeholder='United' 
            value={sectionTitle} 
            onChange={e => setSectionTitle(e.target.value)}
            onBlur={handleUpdateSection}
            onClick={handleSelect}
            onKeyDown={handleKeyDown}
            />
            <div className="section__title__delete" onClick={() => handleDeleteSection(data._id, accessToken, index)}>
                <i className="fa-solid fa-xmark"></i>
            </div>
        </div>
        <div className="section__top">
            {
                isOpenFormAdd ? 
                <div className="section__top__form">
                <textarea maxLength="30" placeholder='United' value={taskTitle} onChange={e => setTaskTitle(e.target.value)}/>
                <textarea maxLength="250" placeholder='United' rows="4" value={taskContent} onChange={e => setTaskContent(e.target.value)}/>
                <div className="section__top__form__btn">
                    <div className="section__top__form__btn__add" onClick={() => handleCreateTask(accessToken)}>
                    Add
                    </div>
                    <div className="section__top__form__btn__cancel" onClick={() => setOpenFormAdd(false)}>
                    Cancel
                    </div>
                </div>
                </div> : 
                <div className="section__top__create" onClick={() => setOpenFormAdd(true)}>
                    <i className="fa-solid fa-plus"></i> Add Task
                </div>
            }
        </div>
        {
            tasks &&
            <Container
                groupName="task__item"
                onDrop={dropResult => onTaskDrop(dropResult, data._id)}
                getChildPayload={
                    index => tasks[index]
                }
                dragClass="task__item-ghost"
                dropClass="task__item-ghost-drop"
                dragHandleSelector='.task__item__selector'
                dropPlaceholder={{                      
                animationDuration: 150,
                showOnTop: true,
                className: 'task__item__drop-preview' 
                }}
                dropPlaceholderAnimationDuration={200}
            >
                {tasks.map((item , idx) => (
                    <Draggable key={item._id}>
                        <Task data={item} handleDelete={handleDelete} index={idx}/>
                    </Draggable>
                ))}
            </Container>
        }
    </div>
  )
}

export default Section