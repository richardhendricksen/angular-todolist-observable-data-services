import { Injectable } from '@angular/core';
import { Todo } from '../models/Todo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private _todos = new BehaviorSubject<Todo[]>([]);
  public readonly todos = this._todos.asObservable();
  private localTodos: Todo[] = [];

  private baseUrl = 'https://jsonplaceholder.typicode.com/todos';
  private limit = '?_limit=5';

  constructor(private http: HttpClient) {
    // load initial data
    this.getTodos();
  }

  getTodos(): void {
    // call endpoint
    const obs = this.http.get<Todo[]>(`${this.baseUrl}${this.limit}`);

    // update subscribers
    obs.subscribe(todos => {
        this.localTodos = todos;
        this._todos.next(this.localTodos);
      },
      error => console.error('Could not load todos.'));
  }

  toggleCompleted(todo: Todo): void {
    // inverse completed status
    todo.completed = !todo.completed;

    // update local collection
    this.localTodos.map(t => {
      if (t.id === todo.id) {
        return todo;
      }
      return t;
    });

    // call endpoint
    const url = `${this.baseUrl}/${todo.id}`;
    const obs = this.http.put<Todo>(url, todo, httpOptions);

    // update subscribers
    obs.subscribe(
      () => {
        this._todos.next(this.localTodos);
      });

  }

  deleteTodo(todo: Todo): void {
    // update local collection
    this.localTodos = this.localTodos.filter(t => t.id !== todo.id);

    // call endpoint
    const url = `${this.baseUrl}/${todo.id}`;
    const obs = this.http.delete<Todo>(url, httpOptions);

    // update subscribers
    obs.subscribe(
      () => this._todos.next(this.localTodos)
    );
  }

  addTodo(todo: Todo): void {
    // update local collection
    this.localTodos.push(todo);

    // call endpoint
    const obs = this.http.post<Todo>(this.baseUrl, todo, httpOptions);

    // update subscribers
    obs.subscribe(
      () => {
        this._todos.next(this.localTodos);
      });
  }
}
