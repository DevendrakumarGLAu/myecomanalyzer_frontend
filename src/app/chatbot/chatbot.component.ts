import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  userInput = '';
  chatMessages: ChatMessage[] = [];
  isLoading = false;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.chatbotService.getDummyChatbotMessages().subscribe(messages => {
      this.chatMessages = messages;
    });
  }

  toggleChatbot(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    if (this.userInput.trim()) {
      const userText = this.userInput;
      
      // Add user message immediately
      this.chatMessages.push({
        id: Math.random().toString(),
        text: userText,
        sender: 'user',
        timestamp: new Date()
      });
      
      // Show loading indicator
      this.isLoading = true;
      const loadingMessageId = Math.random().toString();
      this.chatMessages.push({
        id: loadingMessageId,
        text: '...',
        sender: 'bot',
        timestamp: new Date()
      });
      
      this.userInput = '';
      this.scrollToBottom();
      
      // Get bot response
      this.chatbotService.getChatbotResponse(userText).subscribe({
        next: (response) => {
          // Remove loading message
          const loadingIndex = this.chatMessages.findIndex(msg => msg.id === loadingMessageId);
          if (loadingIndex !== -1) {
            this.chatMessages.splice(loadingIndex, 1);
          }
          
          // Add actual response
          if (response.messages && response.messages.length > 0) {
            this.chatMessages.push(response.messages[0]);
          }
          
          this.isLoading = false;
          this.scrollToBottom();
        },
        error: (error) => {
          // Remove loading message
          const loadingIndex = this.chatMessages.findIndex(msg => msg.id === loadingMessageId);
          if (loadingIndex !== -1) {
            this.chatMessages.splice(loadingIndex, 1);
          }
          
          // Add error message
          this.chatMessages.push({
            id: Math.random().toString(),
            text: 'Sorry, I could not process your request. Please try again.',
            sender: 'bot',
            timestamp: new Date()
          });
          
          this.isLoading = false;
          this.scrollToBottom();
        }
      });
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  }

  clearChat(): void {
    this.chatMessages = [];
    this.chatbotService.getDummyChatbotMessages().subscribe(messages => {
      this.chatMessages = messages;
    });
  }
}
