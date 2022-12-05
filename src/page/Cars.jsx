import { UilClock, UilEdit, UilPlus, UilUsersAlt } from '@iconscout/react-unicons'
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import moment from 'moment/moment'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { animated, useTransition } from 'react-spring'
import { access_token } from '../utils'


const notifyDelete = () =>
  toast('Data Berhasil Dihapus', {
    duration: 4000,
    position: 'top-center',
    style: { background: 'red', color: 'white' },
  })

const getCars = async (page, category) => {
  const res = await fetch(
    `https://bootcamp-rent-cars.herokuapp.com/admin/v2/car?category=${category}&page=${page}&pageSize=9`,
    { headers: { access_token, }, }
  )
  return res.json()
}

const deleteCar = async (id) => {
  try {
    return await fetch(`https://bootcamp-rent-cars.herokuapp.com/admin/car/${id}`, {
      method: 'DELETE',
      headers: { access_token },
    })
  } catch (err) {
    return console.log(err.message)
  }
}

const Cars = () => {
  const user = localStorage.getItem('token')

  const navigate = useNavigate()

  const showNav = useSelector((state) => state.navbar.show)
  const transition = useTransition(showNav, {
    from: { x: -100, y: 0, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    delay: 0,
  })

  if (!user) {
    return navigate('/login')
  }

  return (
    <section className="cars-page">
      {transition(
        (style, item) =>
          item && (
            <animated.nav style={style} className="nav-container">
              <NavCars />
            </animated.nav>
          )
      )}
      <CarList />
    </section>
  );
}

const NavCars = () => {
  return (
    <nav className="nav-container">
      <div className="nav-cars">
        <div className="menu-title">
          <h4>Cars</h4>
        </div>
        <div className="menu bg-secondary">
          <p>List Car</p>
        </div>
      </div>
    </nav>
  )
}

const CarList = () => {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState("")

  const { isLoading, data, isPreviousData } = useQuery(
    ["cars", page, category],
    () => getCars(page, category),
    {
      keepPreviousData: true
    }
  )

  const props = {
    page,
    setPage,
    category,
    setCategory,
    data,
    isLoading,
    isPreviousData,
  }

  return (
    <section className="car-list">
      <main className="car-list-container">
        <ListHeader {...props} />
        <CarCard {...props} />
      </main>
    </section>
  )
}

const ListHeader = ({ setCategory, setPage, page, data }) => {
  const [buttonFilter, setButtonFilter] = useState("all")

  const handleShowAll = () => {
    setCategory("")
    setButtonFilter("all")
  }

  const handleShowLarge = () => {
    setCategory("large")
    setButtonFilter("large")
  }

  const handleShowMedium = () => {
    setCategory("medium")
    setButtonFilter("medium")
  }

  const handleShowSmall = () => {
    setCategory("small")
    setButtonFilter("small")
  }

  const nextPage = () => {
    setPage((prev) => prev + 1)
  }

  const prevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0))
  }

  return (
    <>
      <section className="breadcrumb">
        <div className="breadcrumb-container df-center ">
          <p>Cars</p>
          <i className="uil uil-angle-right-b"></i>
          <div className="link">
            <Link to="#">List Car</Link>
          </div>
        </div>
      </section>
      <section className="car-list-title">
        <div className="car-list-title-container">
          <h2>List Car</h2>
          <Link to="add-car">
            <button className="btn-primary">
              <UilPlus />
              <p>Add New Car</p>
            </button>
          </Link>
        </div>
      </section>
      <section className="car-filter-container">
        <div className="car-filter">
          <button
            className={buttonFilter === "all" ? "btn-active" : "btn-passive"}
            onClick={handleShowAll}
          >
            All
          </button>
          <button
            className={buttonFilter === "small" ? "btn-active" : "btn-passive"}
            onClick={handleShowSmall}
          >
            Small
          </button>
          <button
            className={buttonFilter === "medium" ? "btn-active" : "btn-passive"}
            onClick={handleShowMedium}
          >
            Medium
          </button>
          <button
            className={buttonFilter === "large" ? "btn-active" : "btn-passive"}
            onClick={handleShowLarge}
          >
            Large
          </button>
        </div>
        <div className="car-pagination">
          <nav className="car-pagination">
            <button className="btn-primary" onClick={prevPage} disabled={page === 1}>
              <span>&lt;&lt;</span>
            </button>
            <p>{`Page ${page} of ${data?.pageCount}`}</p>
            <button
              className="btn-primary"
              onClick={nextPage}
              disabled={page === data?.pageCount}
            >
              <span>&gt;&gt;</span>
            </button>
          </nav>
        </div>
      </section>
    </>
  )
}

const CarCard = ({ data, isLoading }) => {

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  if (isLoading) {
    return <p>{' '}</p>
  }

  return (
    <div className='car-card__container'>
      {data?.cars.map((car) => (
        <div key={car.id} className='car-card'>
          <>
            <div className='car-card__body'>
              <div className='car-card__image'>
                <img src={car.image ? car.image : '/img/no-image.png'} alt='car' />
              </div>
              <div className='car-card__content'>
                <p>{car.name}</p>
                <h4>{`${formatCurrency(car.price)} / hari`}</h4>
                <div className='car-category'>
                  <UilUsersAlt />
                  <p>{car.category}</p>
                </div>
                <div className='car-updated'>
                  <UilClock />
                  <small>
                    Updated at{' '}
                    {moment(car.updatedAt).format('MMM D YYYY, hh:mm')}
                  </small>
                </div>
                <div className='car-card__button'>
                  <ButtonDelete carId={car.id} />
                  <Link to={`edit-car/${car.id}`}>
                    <button className="button-edit btn">
                      <UilEdit />
                      <p>Edit</p>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        </div>
      ))}
      {/* {isLoading && <SkeletonCard />} */}
    </div>
  )
}


const ButtonDelete = ({ carId }) => {
  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate()

  const handleModal = () => {
    setShowModal(!showModal)
  }

  const handleDelete = async (id) => {
    await deleteCar(id)
    navigate('/cars', { replace: true })
    notifyDelete()
    handleModal()
  }

  return (
    <>
      <button
        onClick={handleModal}
        className='button-delete btn-outlined-danger'
      >
        <p>Delete</p>
      </button>
      {showModal && (
        <div className='modal-delete__backdrop df-center'>
          <div className='modal df-center'>
            <div className='modal-content df-center'>
              <img src='/img/modal-img.png' alt='car' />
              <h3>Menghapus Data Mobil</h3>
              <p>
                Setelah dihapus, data mobil tidak dapat dikembalikan, Yakin ingin
                menghapus?
              </p>
              <div className='modal-button'>
                <button onClick={() => handleDelete(carId)} className='btn-primary'>
                  Ya
                </button>
                <button onClick={handleModal} className='btn-outlined-primary'>
                  Tidak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Cars;