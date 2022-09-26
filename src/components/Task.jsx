import { useState } from 'react'

//Images & Videos
import circle1 from '../img/circle1.png'
import circle2 from '../img/circle2.png'

const Task = ({ taskName, id, deleteTask }) => {
    const [isShown, setIsShown] = useState(false)

    return (
        <section className="taskComponent">
            <img
                src={isShown === false ? circle1 : circle2} alt="nu exista" className="taskComponent__img"
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
                onClick={() => deleteTask(id)}
            />
            <h3 className="taskComponent__name">{taskName}</h3>
        </section>
    )

}

export default Task