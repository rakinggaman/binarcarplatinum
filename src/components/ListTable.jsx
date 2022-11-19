import FirstPageIcon from "@mui/icons-material/FirstPage"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import LastPageIcon from "@mui/icons-material/LastPage"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import { useTheme } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableFooter from "@mui/material/TableFooter"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import { useQuery } from "@tanstack/react-query"
import moment from "moment/moment"
import React, { useState } from "react"
import { access_token } from "../utils"


const tableHead = [
  { id: "no", label: "No", width: "5%" },
  {
    id: "user email",
    label: "User Email",
    width: "13.5%",
  },
  {
    id: "car",
    label: "Car",
    width: "13.5%",
  },
  {
    id: "start rent",
    label: "Start Rent",
    width: "13.5%",
  },
  {
    id: "finish rent",
    label: "Finish Rent",
    width: "13.5%",
  },
  {
    id: "price",
    label: "Price",
    width: "13.5%",
  },
  {
    id: "category",
    label: "Category",
    width: "13.5%",
  },
]

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)

const getOrders = async () => {
  const res = await fetch(
    `https://bootcamp-rent-cars.herokuapp.com/admin/v2/order?sort=created_at%3Adesc&page=1&pageSize=100`,
    { headers: { access_token, }, }
  )
  return res.json()
}

const ListTable = () => {
  console.log('wkwk')
  const { data, isLoading } = useQuery(["orders"], () => getOrders(),
    { keepPreviousData: true }
  )

  // state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.orders.length) : 0

  const handleChangePage = (e, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  if (isLoading) {
    return null
  }


  return (
    <div className="list-table-container">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead
            style={{
              background: "#cfd4ed",
            }}
          >
            <TableRow>
              {tableHead.map((head) => (
                <TableCell key={head.id}>{head.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? data.orders.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
              : data.orders
            ).map((order, index) => (
              <TableRow key={order.id}>
                <TableCell style={{ width: "5%" }}>{`${index + 1}`}</TableCell>
                <TableCell style={{ width: "13.5%" }}>
                  {order.User.email}
                </TableCell>
                <TableCell style={{ width: "13.5%" }}>
                  {order.Car?.name}
                </TableCell>
                <TableCell style={{ width: "13.5%" }}>
                  {moment(order.start_rent_at).format("ll")}
                </TableCell>
                <TableCell style={{ width: "13.5%" }}>
                  {moment(order.finish_rent_at).format("ll")}
                </TableCell>
                <TableCell style={{ width: "13.5%" }}>
                  {formatCurrency(order.total_price)}
                </TableCell>
                <TableCell style={{ width: "10.5%" }}>
                  {order.Car?.category}
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={4}
                count={data.orders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  )
}


const TablePaginationActions = (props) => {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }


  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}


export default ListTable
