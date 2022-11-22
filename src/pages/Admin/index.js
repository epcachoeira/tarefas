import { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConnection';
import { signOut } from 'firebase/auth';
import { addDoc, collection, onSnapshot, query, orderBy, 
        where, doc, deleteDoc, updateDoc } from 'firebase/firestore';

import './admin.css';
import { format } from 'date-fns';

export default function Admin() {

  const [tarefa, setTarefa] = useState('');
  const [prazo, setPrazo] = useState('');
  const [user, setUser] = useState({});
  const [tarefas, setTarefas] = useState([]);
  const [edit, setEdit] = useState({})

  useEffect(() => {
    async function loadTarefas() {
      const userDetail = localStorage.getItem("@detailUser");
      setUser(JSON.parse(userDetail));

      console.log(userDetail);

      if(userDetail) {
        const data = JSON.parse(userDetail);
        const tarefaRef = collection(db, 'tarefas');
        const q = query(tarefaRef, orderBy('created', 'desc'), where('userUid', '==', data?.uid));
        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              created: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
              userUid: doc.data().userUid,
              deadline: doc.data()?.deadline
            })
          });
          
          setTarefas(lista);
        })
      }
    
    }

    loadTarefas();
  }, []);
/*
  async function handleReload() {
    const userDetail = localStorage.getItem("@detailUser");
    if(Object.keys(userDetail).length > 0) {
      const data = user;
      const tarefaRef = collection(db, 'tarefas');
      const q = query(tarefaRef, orderBy('created', 'desc'), where('userUid', '==', data?.uid));
      const unsub = onSnapshot(q, (snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            userUid: doc.data().userUid,
            deadline: doc.data().deadline
          })
        });

        setTarefas(lista);
      });
    };
  };
*/
  async function handleRegister(e) {
    e.preventDefault();
    
    if(tarefa === '') {
      alert('Digite sua tarefa');
      return;
    }

    if(edit?.id){
      handleUpdateTarefa();
      return;
    }

    await addDoc(collection(db, 'tarefas'), {
      tarefa: tarefa,
      created: new Date(),
      userUid: user?.uid,
      deadline: prazo
    })
    .then(() => {
      console.log('Tarefa registrada');
      setTarefa('');
      setPrazo('');
    })
    .catch((err) => {
      console.log(err);
    })
  }

  async function handleLogout() {
    await signOut(auth);
    localStorage.removeItem("@detailUser");
  }

  async function deleteTarefa(id) {
    const docRef = doc(db, "tarefas", id)
    await deleteDoc(docRef)
    .then(() => {
      console.log('Tarefa eliminada');
    })
    .catch((err) => {
      alert(err);
    });
  }

  function editarTarefa(item) {
    setTarefa(item.tarefa);
    if(item.deadline) {
      setPrazo(item.deadline);
    } else {
      setPrazo('');
    }
    setEdit(item);
  }

  async function handleUpdateTarefa(){
    const docRef = doc(db, "tarefas", edit?.id)
    await updateDoc(docRef, {
      tarefa: tarefa,
      deadline: prazo
    })
    .then(() => {
      setTarefa('')
      setPrazo('')
      setEdit({})
    })
    .catch(() => {
      alert("ERRO AO ATUALIZAR")
      setTarefa('')
      setEdit({})
    })
  }

  return(
    <div className='admin-container'>
      <span className='usuario'>Usuário: {user.email}</span>
      <h1>Minhas Tarefas</h1>

      <form onSubmit={handleRegister} className='form'>
        <textarea 
          placeholder='Digite sua tarefa ....'
          value={tarefa} onChange={(e) => setTarefa(e.target.value)}
          cols="100" rows="5" />

        <input type="text" placeholder='Para quando?'
          value={prazo} onChange={(e) => setPrazo(e.target.value)}/>
        {Object.keys(edit).length > 0 ? (
        <button className="btn-register" type="submit">Atualizar tarefa</button>
          ) : (
            <button className="btn-register" type="submit">Registrar tarefa</button>
        )}
      </form>

      {tarefas.map((item) => (
      <article key={item.id} className="list">
        {item.deadline ? (
          <p>{item.tarefa} - Prazo: {item.deadline}</p>
        ) : (
          <p>{item.tarefa}</p>
        )}
        <span className='dataTask'>Criada em: {item.created}</span>
        <div>
          <button onClick={ () => editarTarefa(item) }>Editar</button>
          <button onClick={ () => deleteTarefa(item.id) } className="btn-delete">Excluir</button>
        </div>
      </article>
      ))}
      <div>
        <button className='btn-logout' onClick={handleLogout}>Sair</button>
      </div>
    </div>
  )
}
//        <button className='btn-footer' onClick={handleReload}>Reload</button>