//Images & Videos
import done2 from '../img/done2.png'
import done3 from '../img/done3.png'



const CompletedTask = ({ taskName, id, deleteTask, moveTaskToActive }) => {


    return (
        <section className="completedTaskComponent">
            <img
                src={done2} alt="nu exista" className="completedTaskComponent__img"
                onClick={() => moveTaskToActive(id)}
            />
            <h3 className="completedTaskComponent__name">{taskName}</h3>
            <img onClick={() => deleteTask(id)} src={done3} alt="nu exista" className="completedTaskComponent__delete" />
        </section>
    )

}

export default CompletedTask