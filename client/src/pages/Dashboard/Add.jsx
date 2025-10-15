import React, { useState } from 'react';
import axios from 'axios';
import { Button, Col, Form, Input, Row } from 'antd';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Toastify from '../../components/message';

const initialState = { title: "", location: "", description: "" };

const Add = () => {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [todos, setTodos] = useState([]); // store fetched todos
  const navigate =useNavigate()
  const URL = "http://localhost:8000";

  const handleChange = e =>
    setState(s => ({ ...s, [e.target.name]: e.target.value }));

 
  const handleAdd = async () => {
    let { title, location, description } = state;

    title = title.trim();
    location = location.trim();
    description = description.trim();

    if (title.length < 3) return Toastify('Title must be at least 3 characters long', 'error');
    if (location.length < 3) return Toastify('Location must be at least 3 characters long', 'error');
    if (description.length < 10) return Toastify('Description must be at least 10 characters long', 'error');

    setIsProcessing(true);

    const todoData = { title, location, description,status:"Incompleted" };

    axios.post(`${process.env.REACT_APP_API_END_POINT}/createTodo`, todoData)
      .then((res) => {
        console.log('Todo Added:', res.data);
        Toastify('Todo added successfully', 'success');
        setTodos(prev => [...prev, res.data.todo]);
        setState(initialState)
      })
      .catch((err) => {
        console.error('Error:', err);
        Toastify('Error adding todo', 'error');
      })
      .finally(() => setIsProcessing(false));
  };

  return (
    <main className='auth'>
      <div className="card p-3 p-md-4">
        <h2 className='text-center text-primary py-3'>Add Todo</h2>
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label='Title'>
                <Input
                  type='text'
                  placeholder='Please enter your Title'
                  value={state.title}
                  name='title'
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Location'>
                <Input
                  type='text'
                  placeholder='Please enter your Location'
                  value={state.location}
                  name='location'
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Description'>
                <Input.TextArea
                  type='text'
                  placeholder='Please enter your Description'
                  value={state.description}
                  name='description'
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button
                type='primary'
                loading={isProcessing}
                block
                onClick={handleAdd}
              >
                Add
              </Button>
            </Col >
            <Col span={12}>
              <Button
                type='primary'
                block
                onClick={()=>{navigate("/dashboard/all")}}
              >
                All
              </Button>
            </Col >
          </Row>
        </Form>
      </div>
    </main>
  );
};

export default Add;
