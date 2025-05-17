import React, { useState, useEffect, useContext } from "react";

import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import moment from "moment";
import auth from "../services/auth";
import AppContext from "../contexts/AppContext";
import ls from "../services/ls";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

export default function Dashboard(props) {
  const history = useHistory();
  const { updateUserObj } = useContext(AppContext);
  // todo

  const [todo, setTodo] = useState(""); // State to store the todo input
  const [todos, setTodos] = useState([]); // State to store todos from localStorage

  // Load todos from localStorage when the component mounts
  useEffect(() => {
    const storedTodos = ls.get("todos") || [];
    setTodos(storedTodos);
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  // Function to handle adding todos to localStorage and state
  const addTodo = async (e) => {
    e.preventDefault();
    if (todo) {
      const updatedTodos = [...todos, todo];
      ls.set("todos", updatedTodos);
      setTodos(updatedTodos);
      setTodo(""); // Clear the input field
    }
  };

  // Function to handle removing todos from localStorage and state
  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    ls.set("todos", updatedTodos);
    setTodos(updatedTodos);
  };

  // Chart area

  ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const salesAmounts = [
    1000, 1200, 800, 1500, 2000, 1800, 2500, 3000, 2800, 2000, 4000, 0,
  ];

  const data = {
    labels: months,
    datasets: [
      {
        label: "Sales Amount",
        backgroundColor: "rgba(248, 132, 52, 0.6)",
        borderColor: "rgba(248, 132, 52, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(248, 132, 52, 0.9)",
        hoverBorderColor: "rgba(248, 132, 52, 1)",
        data: salesAmounts,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  // fonancial overview

  const finaceData = {
    labels: months,
    datasets: [
      {
        label: "Sales",
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        data: [
          2500, 2000, 2800, 3000, 2700, 3200, 3100, 2900, 2700, 3200, 3300,
          3100,
        ],
      },
      {
        label: "Expenses",
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        data: [
          1200, 1500, 1100, 1300, 1400, 1000, 1100, 1200, 1300, 1100, 1000,
          1200,
        ],
      },
      {
        label: "Pending Payments",
        borderColor: "rgba(255,205,86,1)",
        backgroundColor: "rgba(255,205,86,0.2)",
        data: [800, 900, 950, 700, 850, 1000, 950, 900, 800, 850, 900, 950],
      },
      {
        label: "Net Profit",
        borderColor: "rgba(54,162,235,1)",
        backgroundColor: "rgba(54,162,235,0.2)",
        data: [
          1800, 1600, 1700, 2000, 1900, 2100, 2000, 2200, 2300, 2100, 2000,
          2200,
        ],
      },
    ],
  };

  const finaceOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  // end Chart area
  useEffect(async () => {
    props.setHeaderData({
      pageName: "Dashboard",
      isNewButton: false,
      newButtonLink: "",
      isInnerSearch: false,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);

  return (
    <div className="create_edit_page">
      {props.userData?.role === "Admin" && (
        <>
          <div className="row g-4">
            <div className="col-sm-6 col-xl-3">
              <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                <i className="fa fa-chart-line fa-3x text-falgun"></i>
                <div className="ms-3">
                  <p className="mb-2">Today Sale</p>
                  <h6 className="mb-0">$1234</h6>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                <i className="fa fa-chart-bar fa-3x text-falgun"></i>
                <div className="ms-3">
                  <p className="mb-2">Total Sale</p>
                  <h6 className="mb-0">$1234</h6>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                <i className="fa fa-chart-area fa-3x text-falgun"></i>
                <div className="ms-3">
                  <p className="mb-2">Today Revenue</p>
                  <h6 className="mb-0">$1234</h6>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="bg-modiste-blue-light rounded d-flex align-items-center justify-content-between p-3">
                <i className="fa fa-chart-pie fa-3x text-falgun"></i>
                <div className="ms-3">
                  <p className="mb-2">Total Revenue</p>
                  <h6 className="mb-0">$1234</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <div className="row g-4">
              <div className="col-sm-12 col-xl-6">
                <div className="bg-light text-center rounded p-2">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">Sales</h6>
                    <a className="text-falgun" href="">
                      Show All
                    </a>
                  </div>
                  <Bar data={data} options={options} />
                </div>
              </div>
              <div className="col-sm-12 col-xl-6">
                <div className="bg-light text-center rounded p-2">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">Finance Overview</h6>
                    <a className="text-falgun" href="">
                      Show All
                    </a>
                  </div>
                  <Line data={finaceData} options={finaceOptions} />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <div className="bg-light text-center rounded p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="mb-0">Recent Sales</h6>
                <a className="text-falgun" href="">
                  Show All
                </a>
              </div>
              <div className="table-responsive">
                <table className="table text-start align-middle table-bordered table-hover mb-0">
                  <thead>
                    <tr className="text-dark">
                      <th scope="col">#</th>
                      <th scope="col">Date</th>
                      <th scope="col">Invoice</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>01 Jan 2045</td>
                      <td>INV-0123</td>
                      <td>Jhon Doe</td>
                      <td>$123</td>
                      <td>Paid</td>
                      <td>
                        <a className="btn btn-sm btn-warning bg-falgun" href="">
                          Detail
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>01 Jan 2045</td>
                      <td>INV-0123</td>
                      <td>Jhon Doe</td>
                      <td>$123</td>
                      <td>Paid</td>
                      <td>
                        <a className="btn btn-sm btn-warning bg-falgun" href="">
                          Detail
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>01 Jan 2045</td>
                      <td>INV-0123</td>
                      <td>Jhon Doe</td>
                      <td>$123</td>
                      <td>Paid</td>
                      <td>
                        <a className="btn btn-sm btn-warning bg-falgun" href="">
                          Detail
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>01 Jan 2045</td>
                      <td>INV-0123</td>
                      <td>Jhon Doe</td>
                      <td>$123</td>
                      <td>Paid</td>
                      <td>
                        <a className="btn btn-sm btn-warning bg-falgun" href="">
                          Detail
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>01 Jan 2045</td>
                      <td>INV-0123</td>
                      <td>Jhon Doe</td>
                      <td>$123</td>
                      <td>Paid</td>
                      <td>
                        <a className="btn btn-sm btn-warning bg-falgun" href="">
                          Detail
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <div className="bg-modiste-purple-light text-center rounded p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="mb-0">Order's Overview</h6>
                <select>
                  <option>All</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                  <option>2020</option>
                </select>
              </div>
              <div className="table-responsive">
                <table className="table text-start align-middle table-bordered table-hover mb-0">
                  <thead>
                    <tr className="text-dark">
                      <th scope="col">#</th>
                      <th scope="col">Buyer</th>
                      <th scope="col">On Cutting</th>
                      <th scope="col">On Swing</th>
                      <th scope="col">On Finishing</th>
                      <th scope="col">On Shipping</th>
                      <th scope="col">Completed</th>
                      <th scope="col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>NEXT</td>
                      <td>600</td>
                      <td>500</td>
                      <td>300</td>
                      <td>2000</td>
                      <td>200</td>
                      <td>3800</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>BASS PRO</td>
                      <td>600</td>
                      <td>500</td>
                      <td>300</td>
                      <td>2000</td>
                      <td>200</td>
                      <td>3800</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>GARAN</td>
                      <td>600</td>
                      <td>500</td>
                      <td>300</td>
                      <td>2000</td>
                      <td>200</td>
                      <td>3800</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>LC WAIKIKI</td>
                      <td>600</td>
                      <td>500</td>
                      <td>300</td>
                      <td>2000</td>
                      <td>200</td>
                      <td>3800</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>CHAPS</td>
                      <td>600</td>
                      <td>500</td>
                      <td>300</td>
                      <td>2000</td>
                      <td>200</td>
                      <td>3800</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="text-center">
                        <strong>TOTAL</strong>
                      </td>
                      <td>
                        <strong>3000</strong>
                      </td>
                      <td>
                        <strong>2500 </strong>
                      </td>
                      <td>
                        <strong>1500 </strong>
                      </td>
                      <td>
                        <strong>10000 </strong>
                      </td>
                      <td>
                        <strong>1000 </strong>
                      </td>
                      <td>
                        <strong>19000 PCS</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <div className="row g-4">
              <div className="col-sm-12 col-md-6 col-xl-4">
                <div className="h-100 bg-modiste-blue-light rounded p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">Latest Bookings</h6>
                    <Link to="#" className="text-dark" href="">
                      Show All
                    </Link>
                  </div>
                  <div className="list-group ">
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tooltip on left"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>
                        A booking of <span className="text-danger">$500</span>{" "}
                        is completed between Faisal and the supplier PVH
                        Corporation.
                      </small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>
                        A booking of <span className="text-danger">$500</span>{" "}
                        is completed between Faisal and the supplier PVH
                        Corporation.
                      </small>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-xl-4">
                <div className="h-100 bg-falgun rounded p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">Latest PI's</h6>
                    <Link to="#" className="text-dark" href="">
                      Show All
                    </Link>
                  </div>
                  <div className="list-group">
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>
                        A PI of <span className="text-danger">$500</span> is
                        Submitted by Faisal for the supplier PVH Corporation.
                      </small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>
                        A PI of <span className="text-danger">$500</span> is
                        Submitted by Faisal for the supplier PVH Corporation.
                      </small>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-xl-4">
                <div className="h-100 bg-falgun-light rounded p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">Latest BTB LC</h6>
                    <Link to="#" className="text-dark" href="">
                      Show All
                    </Link>
                  </div>
                  <div className="list-group">
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>
                        An LC of <span className="text-danger">$500</span> has
                        been opened in Dhaka Bank between JMS Garments and
                        supplier PVH Corporation
                      </small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>
                        An LC of <span className="text-danger">$500</span> has
                        been opened in Dhaka Bank between JMS Garments and
                        supplier PVH Corporation
                      </small>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-xl-4">
                <div className="h-100 bg-modiste-purple rounded p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">Latest Design's</h6>
                    <Link to="#" className="text-dark" href="">
                      Show All
                    </Link>
                  </div>
                  <div className="list-group">
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>Ahmad has Submitted a new design</small>
                      <br />
                      <small className="text-danger">Pending</small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>Ahmad has Submitted a new design</small>
                      <br />
                      <small className="text-danger">Pending</small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item  list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>Ahmad has Submitted a new design</small>
                      <br />
                      <small className="text-success">Approved</small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>Ahmad has Submitted a new design</small>
                      <br />
                      <small className="">On Swing</small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>Ahmad has Submitted a new design</small>
                      <br />
                      <small className="text-info">Finished</small>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-xl-4">
                <div className="h-100 bg-falgun-middle rounded p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">Latest SOR's</h6>
                    <Link to="#" className="text-dark" href="">
                      Show All
                    </Link>
                  </div>
                  <div className="list-group">
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>Anik Das Submitted A SOR For NEXT</small>
                      <br />
                      <small className="text-danger">Pending</small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>Anik Das Submitted A SOR For CHAPS</small>
                      <br />
                      <small className="text-danger">Pending</small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>Anik Das Submitted A SOR For BASS PRO</small>
                      <br />
                      <small className="text-success">Confirmed</small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>Anik Das Submitted A SOR For NEXT</small>
                      <br />
                      <small className="">On Swing</small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>Anik Das Submitted A SOR For LC-YKK</small>
                      <br />
                      <small className="text-info">Finished</small>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-sm-12 col-md-6 col-xl-4">
                <div className="h-100 bg-modiste-blue-light rounded p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">Costing & Budget</h6>
                    <Link to="#" className="text-dark" href="">
                      Show All
                    </Link>
                  </div>
                  <div className="list-group">
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>
                        Faisal submitted a budget for 10000 pcs leggings of
                        CHAPS.
                      </small>
                      <br />
                      <small className="text-success">Approved</small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>
                        Faisal submitted a budget for 10000 pcs leggings of
                        CHAPS.
                      </small>
                      <br />
                      <small className="text-success">Approved</small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small>
                        Faisal submitted a budget for 10000 pcs leggings of
                        CHAPS.
                      </small>
                      <br />
                      <small className="text-success">Approved</small>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item list-group-item-action flex-column align-items-start"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1"></h5>
                        <small className="text-success">3 days ago</small>
                      </div>
                      <small className="">
                        Faisal submitted a budget for 10000 pcs leggings of
                        CHAPS.
                      </small>
                      <br />
                      <small className="text-success">Approved</small>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-xl-4">
                <div className="h-100 rounded p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">Orders QTY (PCS)</h6>
                    <select>
                      <option>All</option>
                      <option>NEXT</option>
                      <option>BASS PRO</option>
                      <option>CHAPS / O5</option>
                      <option>GARAN</option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-12  bg-modiste-blue-light p-3 text-center">
                      <small>TOTAL</small>
                      <h6>500000</h6>
                    </div>
                    <div className="col-6 bg-falgun-light p-3 text-center">
                      <small>CUTTING</small>
                      <h6>500</h6>
                    </div>
                    <div className="col-6 bg-falgun-middle p-3 text-center">
                      <small>SWING</small>
                      <h6>500</h6>
                    </div>
                    <div className="col-6 bg-modiste-purple-light p-3 text-center">
                      <small>FINISHING</small>
                      <h6>500</h6>
                    </div>
                    <div className="col-6 bg-modiste-purple p-3 text-center">
                      <small>SHIPPING</small>
                      <h6>500</h6>
                    </div>
                    <div className="col-12 bg-modiste-green p-3 text-center">
                      <small>COMPLETED</small>
                      <h6>50000</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="pt-4">
        <div className="row">
          <div className="col-sm-12 col-md-6 col-xl-4">
            <div className="h-100 bg-modiste-purple-light rounded p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="mb-0">To Do List</h6>
              </div>
              <form onSubmit={addTodo}>
                <div className="d-flex mb-2">
                  <input
                    className="form-control bg-transparent margin_bottom_0"
                    type="text"
                    placeholder="Enter todo"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-warning bg-falgun ms-2"
                  >
                    Add
                  </button>
                </div>
              </form>
              {todos.map((todo, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center border-bottom py-2"
                >
                  <div className="w-100 ms-1">
                    <div className="d-flex w-100 align-items-center justify-content-between">
                      <small className="">{todo}</small>
                      <button
                        onClick={() => removeTodo(index)}
                        className="btn btn-sm"
                      >
                        <i className="fa fa-times text-danger"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-xl-4">
            <div className="h-100 bg-falgun-middle rounded p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="mb-0">Item Does Go here</h6>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                rutrum ultrices libero, id vestibulum sapien lacinia et. Ut id
                nibh quis justo feugiat egestas ut faucibus turpis. Mauris
                volutpat finibus elit, in placerat nisl tristique vel. Nunc
                fermentum gravida tincidunt. Duis vitae lorem sed justo faucibus
                mattis.
              </p>
            </div>
          </div>

          <div className="col-sm-12 col-md-6 col-xl-4">
            <div className="h-100 bg-light rounded p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="mb-0">Overview</h6>
              </div>
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead>
                  <tr>
                    <th colSpan={1}>Name</th>
                    <th colSpan={1}>Designation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={1}>{props.userData?.full_name}</td>
                    <td colSpan={1}>{props.userData?.designation_title}</td>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <th colSpan={1}>Department</th>
                    <th colSpan={1}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={1}>{props.userData?.department_title}</td>
                    <td colSpan={1}></td>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <th colSpan={2}>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      {moment(props.userData?.last_login_at).format("LLL")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
