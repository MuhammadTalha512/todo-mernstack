import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Input, Row, Spin, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Header/Navbar";
import Footer from "../../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const All = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
  });

  const URL = import.meta.env.VITE_API_URL;

  const handleSearch = (e) => {
    let text = e.target.value;
    setFilteredDocuments(
      documents.filter((doc) =>
        doc.title.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${URL}/api/todo/readTodos`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const { data } = res;
        setDocuments(data);
        setFilteredDocuments(data);
      })
      .catch((err) => {
        console.error("Error fetching todos:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const openEditModal = (todo) => {
    setSelectedTodo(todo);
    setFormData({
      title: todo.title,
      location: todo.location,
      description: todo.description,
    });
    const modal = new window.bootstrap.Modal(
      document.getElementById("editModal")
    );
    modal.show();
  };
const handleUpdate = async () => {
  if (!selectedTodo) return;

  try {
    const updatedTodo = {
      ...selectedTodo,
      title: formData.title,
      location: formData.location,
      description: formData.description,
    };

    const res = await axios.post(`${URL}/api/todo/updateTodo`, updatedTodo);

    if (res.data) {
      message.success("Todo updated successfully!");

      const updatedList = documents.map((doc) =>
        doc._id === selectedTodo._id ? res.data : doc
      );
      setDocuments(updatedList);
      setFilteredDocuments(updatedList);

      const modalEl = document.getElementById("editModal");
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    }
  } catch (error) {
    console.error(error);
    message.error("Failed to update todo");
  }
};

  const handleDelete = (todo) => {
    axios
      .post(`${URL}/api/todo/deleteTodo`, todo)
      .then((res) => {
        if (res.data === "Todo Deleted") {
          const newDocs = documents.filter((doc) => doc._id !== todo._id);
          setDocuments(newDocs);
          setFilteredDocuments(newDocs);
          message.success("Todo Deleted successfully");
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Delete failed");
      });
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="card p-3 p-md-4">
          <h2 className="text-center  py-3">All Todos</h2>

          <Row className="text-center mb-3">
            <Col span={24}>
              <Input.Search
                placeholder="Search Todos..."
                className="w-25"
                onChange={handleSearch}
              />
            </Col>
          </Row>

          {!isLoading ? (
            <table className="table text-center container">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((todo, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{todo.title}</td>
                    <td>{todo.location}</td>
                    <td>{todo.description}</td>
                    <td>{todo.status}</td>
                    <td>
                      <Button
                        className="me-2"
                        type="primary"
                        size="small"
                        onClick={() => openEditModal(todo)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={() => handleDelete(todo)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="d-flex justify-content-center">
              <Spin />
            </div>
          )}

          <Row className="text-center py-2">
            <Col span={24}>
              <Button
                type="primary"
                onClick={() => navigate("/dashboard/add")}
              >
                Add Todo
              </Button>
            </Col>
          </Row>
        </div>
      </main>

      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">
                Edit Todo
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="primary"
                onClick={handleUpdate}
                className="btn btn-primary "
              >
                Update
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default All;
