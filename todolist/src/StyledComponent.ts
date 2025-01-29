import styled from 'styled-components';

interface TodoItemProps {
  completed: boolean;
}
interface TodoCompleteProps {
  disabled: boolean;
}

export const TodoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

export const TodoList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const TodoItem = styled.li<TodoItemProps>`
  background-color: ${(props) => (props.completed ? '#d4edda' : '#f0f0f0')};
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
`;

export const TodoButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin: 5px;
  &:hover {
    background-color: #0056b3;
  }
`;
export const DeleteButton = styled.button<TodoCompleteProps>`
  background-color: ${(props) => (props.disabled ? '#ccc' : '#007bff')};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin: 5px;
  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : '#0056b3')};
  }
`;

export const AddTodoInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 300px;
  margin: 10px 0;
`;
export const ErrorMessage= styled.div`
color:red; 
font-size:18px; 
font-weight:500;
`