import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTransition, animated } from 'react-spring'
import { access_token } from '../utils'
import { useEffect, useState } from 'react'
import moment from 'moment/moment'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ListTable from '../components/ListTable'

ChartJS.register(CategoryScale, LinearScale, BarElement)

const URL =
  'https://bootcamp-rent-cars.herokuapp.com/admin/v2/order?sort=created_at%3Adesc&page=1&pageSize=10'

const Dashboard = () => {
  const user = localStorage.getItem('token')

  const navigate = useNavigate()

  const showNav = useSelector((state) => state.navbar.show)
  const transition = useTransition(showNav, {
    from: { x: -100, y: 0, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    delay: 0,
  })

  const navDashboard = (
    <div className='nav-dashboard'>
      <div className='menu-title'>
        <h4>dashboard</h4>
      </div>
      <div className='menu bg-secondary'>
        <p>Dashboard</p>
      </div>
    </div>
  )

  if (!user) {
    return navigate('/login')
  }

  return (
    <>
      <main className='dashboard-page'>
        {transition(
          (style, item) =>
            item && (
              <animated.nav style={style} className='nav-container'>
                {navDashboard}
              </animated.nav>
            )
        )}

        <section className='dashboard'>
          <div className='dashboard-container'>
            <Breadrumb />
            <section className='chart-title'>
              <div className='chart-title-container'>
                <figure />
                <h3>Rented Car Data Visualization</h3>
              </div>
            </section>
            <ChartRented />
            <ListOrder />
          </div>
        </section>
      </main>
    </>
  )
}

const Breadrumb = () => {
  return (
    <section className='breadcrumb'>
      <div className='breadcrumb-container df-center '>
        <p>Dashboard</p>
        <i className='uil uil-angle-right-b'></i>
        <div className='link'>
          <Link to=''>Dashboard</Link>
        </div>
      </div>
    </section>
  )
}

const ChartRented = () => {
  const [date, setDate] = useState('Oct')
  const [value, setValue] = useState()
  const [loading, setLoading] = useState(false)
  const [dataChart, setDataChart] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
      },
    ],
  })

  function handleClick() {
    setValue(date)
  }

  const input = (
    <section className='chart-filter'>
      <div className='chart-filter-container'>
        <p>Month</p>
        <div className='filter'>
          <select value={date} onChange={(e) => setDate(e.target.value)}>
            <option value={'Oct'}>Oct - 2022</option>
            <option value={'Nov'}>Nov - 2022</option>
            <option value={'Dec'}>Dec - 2022</option>
          </select>
          <button onClick={() => handleClick()} className='btn-primary'>
            Go
          </button>
        </div>
      </div>
    </section>
  )

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      await fetch(URL, { headers: { access_token } })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data)
          const dataRent = data.orders.map((data) =>
            moment(data.start_rent_at).format('D MMM')
          )
          //# filter by value of month
          const order = dataRent.filter((data) => data.includes(date))
          const newDataOrder = order.map((date) => moment(date).format('D'))

          const chartOrder = newDataOrder
            .sort((a, b) => a.localeCompare(b))
            .reduce((accVal, val) => {
              accVal[val] = (accVal[val] || 0) + 1
              return accVal
            }, {})

          setDataChart({
            labels: Object.keys(chartOrder),
            datasets: [
              {
                label: 'Rented Car',
                data: Object.values(chartOrder),
                backgroundColor: '#586B90',
              },
            ],
          })

          setLoading(false)
        })
    }

    fetchData()
  }, [value])

  if (loading) {
    return input
  }

  return (
    <>
      {input}

      <section className='rented-car-chart'>
        <div className='chart-container'>
          <Bar data={dataChart} />
          <p className='chart_total-order'>Total Order</p>
          <p className='chart_date-order'>Date</p>
        </div>
      </section>
    </>
  )
}



const ListOrder = () => {
  return (
    <>
      <section className='list-title'>
        <div className='list-title-container'>
          <h2>Dashboard</h2>
          <aside>
            <figure />
            <h3>List Order</h3>
          </aside>
        </div>
      </section>
      <ListTable />
    </>
  )
}

export default Dashboard
