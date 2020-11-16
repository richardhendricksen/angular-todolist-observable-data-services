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

    obs.subscribe(todos => {
        // update local collection
        this.localTodos = todos;

        // update subscribers
        this._todos.next(this.localTodos);
      });
  }

  toggleCompleted(todo: Todo): void {
    // inverse completed status
    todo.completed = !todo.completed;

    // call endpoint
    const url = `${this.baseUrl}/${todo.id}`;
    const obs = this.http.put<Todo>(url, todo, httpOptions);

    obs.subscribe(
      () => {
        // update local collection
        this.localTodos = this.localTodos.map(t => {
          if (t.id === todo.id) {
            return todo;
          }
          return t;
        });

        // update subscribers
        this._todos.next(this.localTodos);
      });

  }

  deleteTodo(todo: Todo): void {

    // call endpoint
    const url = `${this.baseUrl}/${todo.id}`;
    const obs = this.http.delete<Todo>(url, httpOptions);

    obs.subscribe(
      () => {
        // update local collection
        this.localTodos = this.localTodos.filter(t => t.id !== todo.id);

        // update subscribers
        this._todos.next(this.localTodos);
      }
    );
  }

  addTodo(todo: Todo): void {

    // call endpoint
    const obs = this.http.post<Todo>(this.baseUrl, todo, httpOptions);

    obs.subscribe(
      () => {
        // update local collection
        this.localTodos.push(todo);

        // update subscribers
        this._todos.next(this.localTodos);
      });
  }
}
