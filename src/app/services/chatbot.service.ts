import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export interface ChatbotResponse {
  messages: ChatMessage[];
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
      private baseUrl = `${environment.apiUrl}/api/ai`;
    
  private dummyMessages: ChatMessage[] = [
    {
      id: '1',
      text: 'Hello! Welcome to SellerPulse. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: '2',
      text: 'I can help you with inventory management, profit tracking, and order status.',
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: '3',
      text: 'Feel free to ask me anything about our platform!',
      sender: 'bot',
      timestamp: new Date()
    }
  ];

  constructor(private http: HttpClient) { }

  getDummyChatbotMessages(): Observable<ChatMessage[]> {
    return of(this.dummyMessages);
  }

  getChatbotResponse(userMessage: string, platform = 'meesho'): Observable<ChatbotResponse> {
    // const url = 'http://127.0.0.1:8000/api/ai/chat';
    const token = localStorage.getItem('token') || '';
    const headersConfig: { [header: string]: string } = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Skip-Loader': 'true' // Skip global loader for chatbot requests
    };

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    const headers = new HttpHeaders(headersConfig);
    const body = { message: userMessage, platform };

    return this.http.post<any>(`${this.baseUrl}/chat`, body, { headers }).pipe(
      map(response => {
        const botMessageText =
          response?.reply || response?.message || response?.answer || JSON.stringify(response);

        return {
          messages: [
            {
              id: Math.random().toString(),
              text: botMessageText,
              sender: 'bot',
              timestamp: new Date()
            }
          ],
          status: 'success'
        } as ChatbotResponse;
      }),
      catchError(error => {
        const errorText = error?.status === 401
          ? 'Authentication required. Please log in to use chat.'
          : 'Unable to reach the chat service. Please try again later.';

        return of({
          messages: [
            {
              id: Math.random().toString(),
              text: errorText,
              sender: 'bot',
              timestamp: new Date()
            }
          ],
          status: 'error'
        } as ChatbotResponse);
      })
    );
  }

  saveChatbotPosition(x: number, y: number): void {
    localStorage.setItem('chatbot_position', JSON.stringify({ x, y }));
  }

  getChatbotPosition(): { x: number; y: number } {
    const savedPosition = localStorage.getItem('chatbot_position');
    return savedPosition ? JSON.parse(savedPosition) : { x: 20, y: 20 };
  }
}
