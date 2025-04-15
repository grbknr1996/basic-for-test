import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'api/users'; // Replace with your actual API URL
  private selectedUserSubject = new BehaviorSubject<User | null>(null);

  // Mock data for demo purposes (remove in production)
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'wo-johnd9h4w',
      email: 'john1.doe@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
      createdOn: '1/13/2024',
      updatedOn: '1/13/2024',
      status: 'Unconfirmed',
    },
    {
      id: '2',
      username: 'jane-smith',
      email: 'jane.smith@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
      createdOn: '12/15/2023',
      updatedOn: '1/10/2024',
      status: 'Active',
    },
    {
      id: '4',
      username: 'alice-williams',
      email: 'alice.williams@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
      createdOn: '1/2/2024',
      updatedOn: '1/12/2024',
      status: 'Active',
    },
    {
      id: '6',
      username: 'emma-davis',
      email: 'emma.davis@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces',
      createdOn: '9/15/2023',
      updatedOn: '1/3/2024',
      status: 'Active',
    },
    {
      id: '8',
      username: 'sophia-martinez',
      email: 'sophia.martinez@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=faces',
      createdOn: '11/8/2023',
      updatedOn: '12/20/2023',
      status: 'Deactivated',
    },
    {
      id: '10',
      username: 'olivia-miller',
      email: 'olivia.miller@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces',
      createdOn: '7/12/2023',
      updatedOn: '10/29/2023',
      status: 'Unconfirmed',
    },
    {
      id: '12',
      username: 'ava-anderson',
      email: 'ava.anderson@example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=faces',
      createdOn: '5/18/2023',
      updatedOn: '8/22/2023',
      status: 'Deactivated',
    },
  ];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    // For demo purposes, return mock data
    // In production, uncomment this to use the actual API
    // return this.http.get<User[]>(this.apiUrl)
    //   .pipe(
    //     catchError(this.handleError<User[]>('getUsers', []))
    //   );

    return of(this.mockUsers);
  }

  getUserById(id: string): Observable<User> {
    // For demo, find from mock data
    // In production: return this.http.get<User>(`${this.apiUrl}/${id}`)
    const user = this.mockUsers.find((u) => u.id === id);
    return of(user as User);
  }

  createUser(user: User): Observable<User> {
    // In production: return this.http.post<User>(this.apiUrl, user)
    return of({ ...user, id: (Math.random() * 1000).toString() });
  }

  updateUser(user: User): Observable<User> {
    // In production: return this.http.put<User>(`${this.apiUrl}/${user.id}`, user)
    return of(user);
  }

  deactivateUser(id: string): Observable<any> {
    // In production: return this.http.put(`${this.apiUrl}/${id}/deactivate`, {})
    this.mockUsers = this.mockUsers.map((u) =>
      u.id === id
        ? {
            ...u,
            status: 'Deactivated' as const,
            updatedOn: new Date().toLocaleDateString(),
          }
        : u
    );
    return of({ success: true });
  }

  resendActivationEmail(id: string): Observable<any> {
    // In production: return this.http.post(`${this.apiUrl}/${id}/resend-activation`, {})
    return of({ success: true, message: 'Activation email sent' });
  }

  setSelectedUser(user: User | null) {
    this.selectedUserSubject.next(user);
  }

  getSelectedUser(): Observable<User | null> {
    return this.selectedUserSubject.asObservable();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
