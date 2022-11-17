import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { animated, useTransition } from 'react-spring';
import { access_token } from '../utils';


const notify = () =>
  toast('Data Berhasil Disimpan', {
    duration: 4000,
    position: 'top-center',
    style: { background: 'green', color: 'white' },
  })

const CarEdit = () => {
  const user = localStorage.getItem("token")
  const navigate = useNavigate()
  const showNav = useSelector((state) => state.navbar.show)

  const transition = useTransition(showNav, {
    from: { x: -100, y: 0, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    delay: 0,
  })

  const [carName, setCarName] = useState('')
  const [carPrice, setCarPrice] = useState('')
  const [carImage, setCarImage] = useState('')
  const [carCategory, setCarCategory] = useState('small')

  const param = useParams()


  const onImageUpload = (e) => {
    const file = e.target.files[0]
    console.log(file);
    setCarImage(file)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleEditCar = async () => {
    const id = param.id
    const data = {
      name: carName,
      category: carCategory,
      price: carPrice,
      image: carImage,
    }
    // putEditCar(data, navigate, id)
    await axios
      .put(`https://bootcamp-rent-cars.herokuapp.com/admin/car/${id}`, data, {
        headers: { access_token },
      })
      .then((res) => {
        console.log(res.status)
        if (res.status === 200) {
          navigate(-1)
        }
      })
      .catch((err) => console.log(err.message))
    notify()
  }

  useEffect(() => {
    let ignore = false;

    async function fetcher(id) {
      return await fetch(`https://bootcamp-rent-cars.herokuapp.com/admin/car/${id}`, {
        headers: {
          access_token,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (!ignore) {
            setCarName(json.name)
            setCarPrice(json.price)
            setCarCategory(json.category)
          }
        });
    }

    fetcher(param.id);

    return () => {
      ignore = true;
    };
  }, [param.id]);


  const props = {
    setCarName,
    setCarPrice,
    setCarImage,
    setCarCategory,
    onImageUpload,
    carName,
    carPrice,
    carImage,
    carCategory,
    handleGoBack,
    handleEditCar
  }

  if (!user) {
    return navigate('/login')
  }

  return (
    <main>
      <section className="edit-car-page">
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
        <Edit {...props} />
      </section>
    </main>
  );
}

const Edit = (props) => {
  const {
    setCarName,
    setCarPrice,
    setCarImage,
    setCarCategory,
    onImageUpload,
    carName,
    carPrice,
    carCategory,
    handleGoBack,
    handleEditCar
  } = props

  return (
    <section className='car-edit'>
      <main className='car-edit__container'>
        <section className="breadcrumb">
          <div className="breadcrumb-container df-center ">
            <p>Cars</p>
            <i className="uil uil-angle-right-b"></i>
            <div className="link">
              <Link to="/cars">List Car</Link>
            </div>
            <i className="uil uil-angle-right-b"></i>
            <div className="link">
              <Link to="#">Edit Car</Link>
            </div>
          </div>
        </section>
        <section className="car-edit-title">
          <div className="car-edit-title__container">
            <h2>Edit Car</h2>
          </div>
        </section>
        <div className='car-edit__form'>
          {/* Car Form */}
          <section className="car-edit-form__container">
            <form>
              <div>
                <label>
                  Name/Tipe Mobil<span>*</span>{" "}
                </label>
                <input
                  onChange={(e) => setCarName(e.target.value)}
                  type="text"
                  placeholder={carName}
                  required
                />
              </div>
              <div>
                <label>
                  Harga<span>*</span>
                </label>
                <input
                  onChange={(e) => setCarPrice(e.target.value)}
                  type="number"
                  min="0"
                  required
                  placeholder={carPrice}
                />
              </div>
              <div className="form-upload">
                <label>Foto</label>
                <input onChange={onImageUpload} type="file" />
              </div>
              <div>
                <label>
                  Kategori<span>*</span>
                </label>
                <select value={carCategory} onChange={(e) => setCarCategory(e.target.value)} required>
                  <option value="small">small</option>
                  <option value="medium">medium</option>
                  <option value="large">large</option>
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
          {/* Car Button */}
          <div className="car-edit-button">
            <button onClick={handleGoBack} className="btn-outlined-primary">
              Cancel
            </button>
            <button onClick={handleEditCar} className="btn-primary">
              Save
            </button>
          </div>
        </div>
      </main>
    </section>
  )
}

export default CarEdit;