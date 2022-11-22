
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebaseConnection';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import './home.css';

export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if(email !== '' && password !== '') {
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/admin', {replace: true});
        })
        .catch((err) => {
          alert(err);
        })
    } else {
      alert('Preencha todos os campos');
    }
  }

  return(
    <div className='home-container'>
      <h1>Lista de Tarefas</h1>
      <span>Gerencie a sua agenda de forma fácil</span>

      <form className='form' onSubmit={handleLogin}>
        <input type="text" placeholder='Digite seu e-mail'
            value={email} onChange={ (e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Digite sua senha'
            value={password} onChange={ (e) => setPassword(e.target.value)} />
        <button type='submit'>Acessar</button>
      </form>

      <Link to='/register' className='button-link'>
        Não possui uma conta?  Cadastre-se...
      </Link>
    </div>
  )
}