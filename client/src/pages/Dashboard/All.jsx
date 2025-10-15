import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Form, Input, Row, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
// import Toastify from '../../components/message';
import { message } from "antd";

const All = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

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
    axios
      .get(`${URL}/readTodos`)
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

  const handleEdit = (todo) => {
    console.log("todo for edit");
    axios
      .post(`${URL}/updateTodo`, todo)
      .then((res) => {
        console.log("res", res);
        message.success("Todo Updated successfully", "success");
        setDocuments(todo);
      });
  };
  const handleDelete = (todo) => {
    console.log("todo for delete");
    axios
      .post(`${URL}/deleteTodo`, todo)
      .then((res) => {
        console.log("res", res);
        if (res.data === "Todo Deleted") {
          let documentsAfterdelete = documents.filter(
            (doc) => doc._id !== todo._id
          );
          setDocuments(documentsAfterdelete);
          setFilteredDocuments(documentsAfterdelete);
        }
        message.success("Todo Deleted successfully", "success");
      });
  };

  return (
    <main>
      <div className="card p-3 p-md-4">
        <h2 className="text-center text-primary py-3">All Todos</h2>
        <div>
          <Row className="text-center">
            <Col span={24}>
              <Input.Search className="w-25" onChange={handleSearch} />
            </Col>
          </Row>
        </div>
        <hr />
        {!isLoading ? (
          <table className="table text-center container">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Location</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((todo, i) => {
                return (
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
                        onClick={() => {
                          handleEdit(todo);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={() => {
                          handleDelete(todo);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="d-flex justify-content-center">
            <span>
              <Spin />
            </span>
          </div>
        )}
      </div>
      <div>
        <Row className="text-center py-2">
          <Col span={24}>
            <Button
              type="primary"
              onClick={() => {
                navigate("/dashboard/add");
              }}
            >
              Add Todo
            </Button>
          </Col>
        </Row>
      </div>
    </main>
  );
};

export default All;
