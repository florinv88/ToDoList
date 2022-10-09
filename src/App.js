import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

//Import files
import Task from './components/Task'
import CompletedTask from './components/CompletedTask'

//Import images
import home from './img/home.png'
import add2 from './img/add2.png'
import logout2 from './img/logout2.png'

function App() {

  const [currentUser, setCurrentUser] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [completedTasks, setCompletedTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [activeTasks, setActiveTasks] = useState([])


  useEffect(() => {

    if (Cookies.get("userID") !== undefined) {
      axios({
        method: "POST",
        data: {
          userId: Cookies.get("userID")
        },
        withCredentials: true,
        url: "https://todolistfinalproduct.herokuapp.com/getCurentUser"
      })
        .then(res => {
          if (res.data !== null) {
            setCurrentUser(res.data)
            axios({
              method: "POST",
              data: {
                userId: Cookies.get("userID")
              },
              withCredentials: true,
              url: "https://todolistfinalproduct.herokuapp.com/getActiveTasks"
            })
              .then(res => setActiveTasks(res.data.activeTasks))
            axios({
              method: "POST",
              data: {
                userId: Cookies.get("userID")
              },
              withCredentials: true,
              url: "https://todolistfinalproduct.herokuapp.com/getCompletedTasks"
            })
              .then(res => setCompletedTasks(res.data.completedTasks))

          }
        })
    }
  }, [])

  ///////////////////////// Functions /////////////////////////

  const logoutUser = () => {
    Cookies.remove("userID")
    setCurrentUser(null)
  }


  const addActiveTask = () => {
    if (currentUser !== null)
      axios({
        method: "POST",
        data: {
          newActiveTask: newTask,
          userId: currentUser._id
        },
        withCredentials: true,
        url: "https://todolistfinalproduct.herokuapp.com/addActiveTask"
      })
        .then(res => {
          if (res.data === false) alert("Smth got wrong.. please try again!")
          else {
            setNewTask("")
            window.location.reload(true)
          }
        })

  }
  const deleteActiveTask = (id) => {
    //move task to completed 
    if (currentUser !== null)
      axios({
        method: "POST",
        data: {
          userID: currentUser._id,
          taskID: id
        },
        withCredentials: true,
        url: "https://todolistfinalproduct.herokuapp.com/moveTaskToCompleted"
      })
        .then(res => {
          if (res.data === false) alert("Smth got wrong.. please try again!")
          else {
            window.location.reload(true)
          }
        })


  }

  const moveTaskToActive = (id) => {
    if (currentUser !== null)
      axios({
        method: "POST",
        data: {
          taskID: id,
          userID: currentUser._id
        },
        withCredentials: true,
        url: "https://todolistfinalproduct.herokuapp.com/moveTaskToActive"
      })
        .then(res => {
          if (res.data === false) alert("Smth got wrong.. please try again!")
          else {
            window.location.reload(true)
          }
        })

  }


  const deleteTask = (id) => {
    if (currentUser !== null)
      axios({
        method: "DELETE",
        data: {
          taskID: id
        },
        withCredentials: true,
        url: "https://todolistfinalproduct.herokuapp.com/deleteTaskPerm"
      })
        .then(res => {
          if (res.data === false) alert("Smth got wrong.. please try again!")
          else {
            window.location.reload(true)
          }
        })

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
