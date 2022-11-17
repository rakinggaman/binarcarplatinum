import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState(false)
  const [logging, setLogging] = useState(false)

  const navigate = useNavigate()

  const user = localStorage.getItem('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLogging(true)
    setErrMsg(false)

    const payload = {
      email,
      password,
    }
    await fetch('https://bootcamp-rent-cars.herokuapp.com/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw Error(response.status)
      })
      .then((data) => {
        localStorage.setItem('token', data.access_token)
        setLogging(false)
        navigate('/dashboard')
      })
      .catch((error) => {
        setErrMsg(true)
        console.error('Error:', error)
      })
  }

  if (user) {
    return navigate('/dashboard')
  }

  return (
    <div className='signin'>
      <div className='left'>
        <img src='img/cover-login.png' alt='cover-login' />
      </div>
      <div className='right df-center'>
        <div className='signin-container df-center'>
          <div className='logo'>
            <Link to='/'>
              <h3>BCR LOGO</h3>
            </Link>
          </div>
          <h2>Welcome Admin BCR!</h2>
          {errMsg && <Error />}

          <form className='form-login' onSubmit={handleSubmit}>
            <div className='signin-email'>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type='text'
                autoComplete='off'
                required
              />
            </div>
            <div className='signin-password'>
              <label htmlFor='password'>Password</label>
              <input
                id='password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type='password'
                required
              />
            </div>
            <button className='btn-primary'>Sign In</button>
          </form>

          {logging && !errMsg && (
            <div>
              <p>Signing...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Error = () => {
  return (
    <div className='error-login-card d-center'>
      <p>
        Masukkan username dan password yang benar. Perhatikan penggunaan huruf
        kapital.
      </p>
    </div>
  )
}

export default Login