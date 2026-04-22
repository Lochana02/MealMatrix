import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:5000/api/time-slots";

function Notification() {
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    let data = [...slots];

    if (search) {
      data = data.filter((s) =>
        s.mealType.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dateFilter) {
      data = data.filter((s) => s.date === dateFilter);
    }

    setFilteredSlots(data);
  }, [search, dateFilter, slots]);

  const fetchTimeSlots = async () => {
    try {
      const res = await axios.get(API_URL);
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  };

  // PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    const rows = filteredSlots.map((s) => [
      s.mealType,
      s.pickupStartTime,
      s.pickupEndTime,
      s.maxOrders,
      s.currentOrders,
      s.status,
      s.date,
    ]);

    autoTable(doc, {
      head: [["Meal", "Start", "End", "Max", "Current", "Status", "Date"]],
      body: rows,
    });

    doc.save("Report.pdf");
  };

  // Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSlots);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Slots");
    XLSX.writeFile(workbook, "TimeSlots.xlsx");
  };

  // Charts
  const mealCounts = { Breakfast: 0, Lunch: 0, Dinner: 0 };
  const statusCounts = { Available: 0, Full: 0, Closed: 0 };

  filteredSlots.forEach((s) => {
    if (mealCounts[s.mealType] !== undefined) mealCounts[s.mealType]++;
    if (statusCounts[s.status] !== undefined) statusCounts[s.status]++;
  });

  const mealChart = {
    labels: ["Breakfast", "Lunch", "Dinner"],
    datasets: [
      {
        label: "Meals",
        data: [
          mealCounts.Breakfast,
          mealCounts.Lunch,
          mealCounts.Dinner,
        ],
        backgroundColor: ["#ff9a9e", "#a18cd1", "#fbc2eb"],
      },
    ],
  };

  const statusChart = {
    labels: ["Available", "Full", "Closed"],
    datasets: [
      {
        data: [
          statusCounts.Available,
          statusCounts.Full,
          statusCounts.Closed,
        ],
        backgroundColor: ["#28a745", "#dc3545", "#6c757d"],
      },
    ],
  };

  const orderChart = {
    labels: filteredSlots.map((s) => s.date),
    datasets: [
      {
        label: "Orders",
        data: filteredSlots.map((s) => s.currentOrders),
        borderColor: "#667eea",
        fill: false,
      },
    ],
  };

  if (loading) return <h2 className="p-10">Loading...</h2>;

  return (
    <div className="min-h-screen bg-[#f2eee4] flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#f7f5ef] border-r px-6 py-8">
        <h2 className="text-2xl font-bold mb-6 text-[#7d290f]">
          MealMatrix
        </h2>

        <nav className="space-y-2">
          <div className="text-gray-500">Dashboard</div>
          <div className="text-gray-500">Orders</div>

          {/* CLICK NAVIGATION */}
          <div
            onClick={() => navigate("/admin-time-slots")}
            className="font-semibold text-[#8f2f12] cursor-pointer hover:underline"
          >
            Time Slots
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold">
              Time Slot Management
            </h1>
            <p className="text-gray-600">
              Manage meal time slots
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={generatePDF}
              className="bg-orange-600 text-white px-4 py-2 rounded"
            >
              PDF
            </button>
            <button
              onClick={exportExcel}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Excel
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search meal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded">
            <Bar data={mealChart} />
          </div>
          <div className="bg-white p-4 rounded">
            <Pie data={statusChart} />
          </div>
          <div className="bg-white p-4 rounded">
            <Line data={orderChart} />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Meal</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3">Max</th>
                <th className="p-3">Current</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredSlots.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">{s.mealType}</td>
                  <td className="p-3">{s.pickupStartTime}</td>
                  <td className="p-3">{s.pickupEndTime}</td>
                  <td className="p-3">{s.maxOrders}</td>
                  <td className="p-3">{s.currentOrders}</td>
                  <td className="p-3">{s.status}</td>
                  <td className="p-3">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

export default Notification;