import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

//Import files
import Task from './components/Task'
import CompletedTask from './components/CompletedTask'

//Import images
import home from './img/home.png'
import add2 from './img/add2.png'
import logout2 from './img/logout2.png'

function App() {

  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [completedTasks, setCompletedTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [activeTasks, setActiveTasks] = useState([])


  useEffect(() => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "https://todolist-t1.herokuapp.com/getCurrentUser"
    })
      .then(res => res.data !== '' ?
        (setCurrentUser(res.data),
          axios({
            method: "GET",
            withCredentials: true,
            url: "https://todolist-t1.herokuapp.com/currentActiveTasks"
          })
            .then(res => setActiveTasks(res.data.activeTasks)),
          axios({
            method: "GET",
            withCredentials: true,
            url: "https://todolist-t1.herokuapp.com/currentCompletedTasks"
          })
            .then(res => setCompletedTasks(res.data.completedTasks))

        ) : console.log(res))

  }, [])

  console.log(completedTasks)

  ///////////////////////// Functions /////////////////////////

  const logoutUser = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "https://todolist-t1.herokuapp.com/logout"
    })
    window.location.reload(true);

  }

  const addActiveTask = async () => {
    if (newTask === '') alert('The task shouldn t be empty')
    else {
      await axios({
        method: "POST",
        data: {
          newActiveTask: newTask
        },
        withCredentials: true,
        url: "https://todolist-t1.herokuapp.com/addActiveTask"
      })
      setNewTask("")
      window.location.reload(true);
    }
  }

  const deleteActiveTask = async (id) => {
    //add to completed
    await axios({
      method: "POST",
      data: {
        taskId: id
      },
      withCredentials: true,
      url: "https://todolist-t1.herokuapp.com/moveTaskToCompleted"
    })
      .catch(err => console.log(err))
    window.location.reload(true);
  }

  const moveTaskToActive = async (id) => {
    await axios({
      method: "POST",
      data: {
        taskId: id
      },
      withCredentials: true,
      url: "https://todolist-t1.herokuapp.com/moveTaskToActive"
    })
      .catch(err => console.log(err))
    window.location.reload(true);

  }

  const deleteTask = async (id) => {

    try {
      await axios({
        method: "DELETE",
        data: {
          taskId: id
        },
        withCredentials: true,
        url: "https://todolist-t1.herokuapp.com/deleteTask"
      })
      window.location.reload(true);
    }
    catch {
      console.log("err")
    }

  }


  return (

    <div className="mainPage">
      <header className="header">
        <img src={home} alt="nu exista" className="header__logo" />
        <h4 className="header__text">Tasks</h4>
        {currentUser !== null && <h3 className="header__welcome">Hi, {currentUser.username}!</h3>}
        {currentUser !== null && <img src={logout2} onClick={logoutUser} className="header__logout" alt="doesn't exist" />}
      </header>

      {currentUser === null
        ?
        <section className="buttons">
          <div>
            <Link to="/register"> Register</Link>
          </div>
          <div>
            <Link to="/login">Login</Link>
          </div>
        </section>
        :

        <div>

          {activeTasks !== [] && activeTasks.map((item, index) => {
            return (
              <Task taskName={item.taskName} key={index} id={item._id} deleteTask={deleteActiveTask} />
            )
          })}


          <section className='completedTasks'>
            <div className="completedTasks__button" onClick={() => setIsExpanded(prevState => !prevState)}>
              <span className={`material-symbols-outlined ${isExpanded === true && "expanded"}`}>arrow_forward_ios</span>
              <h4>Completed</h4>
              <h3>{completedTasks.length}</h3>
            </div>
            {isExpanded === true && completedTasks.map((item, index) => {
              return (
                <CompletedTask taskName={item.taskName} key={index} id={item._id} deleteTask={deleteTask} moveTaskToActive={moveTaskToActive} />
              )
            })}
          </section>

          <section className="footer">
            <input
              type="text"
              placeholder="  Add a task"
              className="footer__input"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <img onClick={addActiveTask} src={add2} alt="Doesn't exist!" className="footer__done" />
          </section>
        </div>
      }

    </div>
  );
}

export default App;
