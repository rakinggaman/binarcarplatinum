import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { access_token } from '../utils'
import toast from 'react-hot-toast'
import axios from "axios"
import { useTransition, animated } from 'react-spring'
import { useSelector } from "react-redux";



const notify = () =>
  toast('Data Berhasil Disimpan', {
    duration: 4000,
    position: 'top-center',
    style: { background: 'green', color: 'white' },
  })


function createCar(data) {
  return axios
    .post("https://bootcamp-rent-cars.herokuapp.com/admin/car", data, {
      headers: {
        access_token,
        'Content-Type': "multipart/form-data"
      },
    })
}


const CarCreate = () => {
  const [carName, setCarName] = useState('')
  const [carPrice, setCarPrice] = useState('')
  const [carImage, setCarImage] = useState('')
  const [carCategory, setCarCategory] = useState('undefined')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const showNav = useSelector((state) => state.navbar.show)
  const transition = useTransition(showNav, {
    from: { x: -100, y: 0, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    delay: 0,
  })

  const onImageUpload = (e) => {
    const file = e.target.files[0]
    console.log(file);
    setCarImage(file)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleAddCar = async () => {
    setLoading(true)
    const data = {
      name: carName,
      category: carCategory,
      price: carPrice,
      image: carImage,
    }
    await createCar(data)

    notify()
    setLoading(false)
    navigate('/cars')
  }



  return (
    <div className="add-car-page">
      {transition(
        (style, item) =>
          item && (
            <animated.nav style={style} className='nav-container'>
              <div className="nav-cars">
                <div className="menu-title">
                  <h4>Cars</h4>
                </div>
                <div className="menu bg-secondary">
                  <p>List Car</p>
                </div>
              </div>
            </animated.nav>
          )
      )}
      <section className='car-add-new'>
        <main className='car-add-new__container'>
          <CarAddHeader />
          <div className='car-add-new__form'>
            <section className='car-add-form__container'>
              <form>
                <div>
                  <label>
                    Name/Tipe Mobil<span>*</span>{' '}
                  </label>
                  <input
                    onChange={(e) => setCarName(e.target.value)}
                    value={carName}
                    type='text'
                    placeholder='Input Nama/Tipe Mobil'
                    required
                  />
                </div>
                <div>
                  <label>
                    Harga<span>*</span>
                  </label>
                  <input
                    onChange={(e) => setCarPrice(e.target.value)}
                    value={carPrice}
                    type='number'
                    min='0'
                    placeholder='Input Harga Sewa Mobil Per Hari'
                    required
                  />
                </div>
                <div className='form-upload'>
                  <label>
                    Foto<span>*</span>
                  </label>
                  <input className='input' onChange={onImageUpload} type='file' required />
                  
                </div>
                <div>
                  <label>
                    Kategori<span>*</span>
                  </label>
                  <select
                    onChange={(e) => setCarCategory(e.target.value)}
                    value={carCategory}
                    required
                  >
                    <option value='undefined' hidden disabled>
                      Pilih Kategori Mobil
                    </option>
                    <option value='small'>2 - 4 Orang</option>
                    <option value='medium'>4 - 6 Orang</option>
                    <option value='large'>6 - 8 Orang</option>
                  </select>
                </div>
                <div>
                  <p>Created at</p>
                  <small>-</small>
                </div>
                <div>
                  <p>Updated at</p>
                  <small>-</small>
                </div>
              </form>
            </section>
            <div className='car-add-button'>
              <button onClick={handleGoBack} className='btn-outlined-primary'>
                Cancel
              </button>
              <button onClick={() => handleAddCar()} className='btn-primary'>
                {loading ? <p>Saving...</p> : <p>Save</p>}
              </button>
            </div>
          </div>
        </main>
        {/* <Toaster /> */}
      </section>
    </div>

  )
}

const CarAddHeader = () => {
  return (
    <>
      <section className='breadcrumb'>
        <div className='breadcrumb-container df-center '>
          <p>Cars</p>
          <i className='uil uil-angle-right-b'></i>
          <div className='link'>
            <Link to='/cars'>List Car</Link>
          </div>
          <i className='uil uil-angle-right-b'></i>
          <div className='link'>
            <Link to='#'>Add New Car</Link>
          </div>
        </div>
      </section>
      <section className='car-add-title'>
        <div className='car-add-title__container'>
          <h2>Add New Car</h2>
        </div>
      </section>
    </>
  )
}

export default CarCreate
