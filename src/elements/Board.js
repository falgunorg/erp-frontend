import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "react-bootstrap/Dropdown";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import api from "services/api";

const initialData = {
  tasks: {
    task1: {
      id: "task1",
      title: "Task 1 Title",
      description: "Task 1 Description",
      status: "pending",
    },
    task2: {
      id: "task2",
      title: "Task 2 Title",
      description: "Task 2 Description",
      status: "processing",
    },
    // Add more tasks here
  },
  columns: {
    column1: {
      id: "column1",
      title: "Pending Task's",
      taskIds: ["task1", "task2"],
    },
    // Add more columns here
  },
  columnOrder: ["column1"], // Order of columns
};

const getTaskBackgroundColor = (status) => {
  switch (status) {
    case "pending":
      return "lightcoral";
    case "processing":
      return "lightyellow";
    case "complete":
      return "lightgreen";
    default:
      return "white";
  }
};

const Board = () => {
  const [data, setData] = React.useState(initialData);

  console.log("BoardData", data);
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const [newTaskDescription, setNewTaskDescription] = React.useState("");
  const [newTaskColumn, setNewTaskColumn] = React.useState("");
  const [newColumnName, setNewColumnName] = React.useState("");

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return; // The task was dropped outside a valid droppable area
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // The task was dropped in the same position
    }

    // Get source and destination columns
    const sourceColumn = data.columns[source.droppableId];
    const destColumn = data.columns[destination.droppableId];

    // Create new arrays for taskIds
    const newSourceTaskIds = Array.from(sourceColumn.taskIds);
    const newDestTaskIds = Array.from(destColumn.taskIds);

    // Remove the task from the source column and insert it into the destination column
    newSourceTaskIds.splice(source.index, 1);
    newDestTaskIds.splice(destination.index, 0, draggableId);

    // Create updated columns with the new taskIds arrays
    const updatedSourceColumn = { ...sourceColumn, taskIds: newSourceTaskIds };
    const updatedDestColumn = { ...destColumn, taskIds: newDestTaskIds };

    // Create updated columns object
    const updatedColumns = {
      ...data.columns,
      [updatedSourceColumn.id]: updatedSourceColumn,
      [updatedDestColumn.id]: updatedDestColumn,
    };

    // Update the state
    setData({
      ...data,
      columns: updatedColumns,
    });
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = { ...data.tasks };
    updatedTasks[taskId].status = newStatus;
    setData({
      ...data,
      tasks: updatedTasks,
    });
  };

  const removeTask = (taskId) => {
    const updatedTasks = { ...data.tasks };
    delete updatedTasks[taskId];
    const updatedColumns = { ...data.columns };
    for (const columnId in updatedColumns) {
      updatedColumns[columnId].taskIds = updatedColumns[
        columnId
      ].taskIds.filter((id) => id !== taskId);
    }
    setData({
      ...data,
      tasks: updatedTasks,
      columns: updatedColumns,
    });
  };

  const addNewTask = () => {
    console.log("newTaskColumn", newTaskColumn);
    if (newTaskTitle.trim() !== "") {
      const newTaskId = `task${Object.keys(data.tasks).length + 1}`;
      const newTask = {
        id: newTaskId,
        title: newTaskTitle,
        description: newTaskDescription,
        status: "pending",
      };

      const updatedTasks = { ...data.tasks, [newTaskId]: newTask };

      // Update the column with the correct columnId
      const updatedColumns = {
        ...data.columns,
        [newTaskColumn]: {
          ...data.columns[newTaskColumn],
          taskIds: [...data.columns[newTaskColumn].taskIds, newTaskId],
        },
      };

      setData({
        ...data,
        tasks: updatedTasks,
        columns: updatedColumns,
      });

      setNewTaskTitle(""); // Clear input after adding
      setNewTaskDescription(""); // Clear input after adding
      setNewTaskColumn("");
      setTaskModal(false);
    }
  };

  const addNewColumn = () => {
    if (newColumnName.trim() !== "") {
      const newColumnId = `column${Object.keys(data.columns).length + 1}`;
      const newColumn = {
        id: newColumnId,
        title: newColumnName,
        taskIds: [],
      };

      const updatedColumns = {
        ...data.columns,
        [newColumnId]: newColumn,
      };

      const newColumnOrder = [...data.columnOrder, newColumnId]; // Add the new column to the order

      setData({
        ...data,
        columns: updatedColumns,
        columnOrder: newColumnOrder, // Update the column order
      });
      handleSubmit();

      setNewColumnName("");
      setColumnModal(false);
    }
  };

  const handleColumnTitleChange = (e, columnId) => {
    const updatedColumns = { ...data.columns };
    updatedColumns[columnId].title = e.target.value;

    setData({
      ...data,
      columns: updatedColumns,
    });
  };

  const toggleEditing = (columnId) => {
    const updatedColumns = { ...data.columns };
    updatedColumns[columnId].editing = !updatedColumns[columnId].editing;

    setData({
      ...data,
      columns: updatedColumns,
    });
  };

  const [taskModal, setTaskModal] = useState(false);
  const closeTaskModal = () => {
    setTaskModal(false);
    setNewTaskTitle(""); // Clear input after adding
    setNewTaskDescription(""); // Clear input after adding
  };

  const [columnModal, setColumnModal] = useState(false);
  const closeColumnModal = () => {
    setColumnModal(false);
    setNewColumnName("");
  };
  // edit task

  // Inside the Board component

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedTaskId, setEditedTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [editedTaskDescription, setEditedTaskDescription] = useState("");

  // Function to open the edit modal
  const openEditModal = (taskId, title, description) => {
    setEditedTaskId(taskId);
    setEditedTaskTitle(title);
    setEditedTaskDescription(description);
    setEditModalOpen(true);
  };

  // Function to save edited task
  const saveEditedTask = () => {
    if (editedTaskId) {
      const updatedTasks = { ...data.tasks };
      updatedTasks[editedTaskId].title = editedTaskTitle;
      updatedTasks[editedTaskId].description = editedTaskDescription;
      setData({
        ...data,
        tasks: updatedTasks,
      });
      setEditModalOpen(false);
    }
  };

  const handleSubmit = async () => {
    var response = await api.post("/admin/employees-create", data);
    if (response.status === 200 && response.data) {
      //   history.push("/employees");
    } else {
      console.log(response.data.errors);
    }
  };

  return (
    <div>
      <div style={{ textAlign: "right" }} className="text-right">
        <button
          className="btn btn-success btn-sm"
          onClick={() => setColumnModal(true)}
        >
          Add Column
        </button>
      </div>
      <br></br>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <div key={column.id} className="col-lg-3 mb-10">
                {column.editing ? (
                  <h6>
                    <input
                      type="text"
                      value={column.title}
                      onChange={(e) => handleColumnTitleChange(e, columnId)}
                      onBlur={() => toggleEditing(columnId)}
                      autoFocus
                    />
                  </h6>
                ) : (
                  <>
                    <h6>
                      {column.title}
                      <span style={{ fontSize: "15px" }}>
                        <i
                          onClick={() => toggleEditing(columnId)}
                          style={{ marginLeft: "5px", cursor: "pointer" }}
                          className="fas fa-pen"
                        ></i>
                      </span>
                    </h6>
                  </>
                )}

                <Droppable droppableId={column.id} key={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        backgroundColor: "lightgrey",
                        padding: 8,
                        minHeight: "300px",
                      }}
                    >
                      <div className="text-end mb-10">
                        <Button
                          onClick={() => {
                            setTaskModal(true);
                            setNewTaskColumn(columnId);
                          }}
                          variant="success"
                          size="sm"
                        >
                          <i className="fal fa-plus"></i>
                        </Button>
                      </div>

                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              style={{
                                userSelect: "none",
                                padding: 16,
                                margin: "0 0 8px 0",
                                backgroundColor: getTaskBackgroundColor(
                                  task.status
                                ),
                                border: "1px solid lightgrey",
                                borderRadius: "2px",
                                ...provided.draggableProps.style,
                              }}
                            >
                              <div className="d-flex justify-content-between">
                                <h6>
                                  <strong>{task.title}</strong>
                                </h6>

                                <Dropdown className="dropdown_on_task_board">
                                  <Dropdown.Toggle
                                    className="dropdown_btn_task"
                                    id="dropdown-basic"
                                    style={{
                                      background: "none",
                                      padding: "0",
                                      border: "none",
                                      color: "black",
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faEllipsisH} />
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    <Dropdown.Item
                                      onClick={() =>
                                        updateTaskStatus(task.id, "pending")
                                      }
                                    >
                                      Pending
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        updateTaskStatus(task.id, "processing")
                                      }
                                    >
                                      Processing
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        updateTaskStatus(task.id, "complete")
                                      }
                                    >
                                      Complete
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                      onClick={() =>
                                        openEditModal(
                                          task.id,
                                          task.title,
                                          task.description
                                        )
                                      }
                                    >
                                      Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() => removeTask(task.id)}
                                    >
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                              <p>{task.description}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>



      
      <Modal size="sm" show={taskModal} onHide={closeTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add new Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeTaskModal}>
            Close
          </Button>
          <Button variant="primary" onClick={addNewTask}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="sm" show={columnModal} onHide={closeColumnModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add new Column</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter column title"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeColumnModal}>
            Close
          </Button>
          <Button variant="primary" onClick={addNewColumn}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={editedTaskTitle}
              onChange={(e) => setEditedTaskTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={editedTaskDescription}
              onChange={(e) => setEditedTaskDescription(e.target.value)}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={saveEditedTask}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Board;
