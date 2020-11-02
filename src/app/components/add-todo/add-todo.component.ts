import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/Todo';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  title: string;

  constructor(private todoService: TodoService) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const todo: Todo = {
      title: this.title,
      completed: false
    };

    this.todoService.addTodo(todo);
  }

}
