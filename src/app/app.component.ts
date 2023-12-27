import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'coding-challenge-v2';
  tasks = [
    {
      title: 'task 1',
      completed: false,
    },
    {
      title: 'task 2',
      completed: false,
    },
    {
      title: 'task 3',
      completed: false,
    },
    {
      title: 'task 4',
      completed: false,
    },
  ];

  completedTasks = [
    {
      title: 'task 5',
      completed: false,
    },
    {
      title: 'task 6',
      completed: false,
    },
    {
      title: 'task 7',
      completed: false,
    },
    {
      title: 'task 8',
      completed: false,
    },
  ];
  contentUrl!: any;
  serverDown!: string;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    const url = "http://amazon.com";
    this.contentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  addTask(description: string, event: any) {
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();
    this.tasks.push({
      title: description,
      completed: false,
    });
  }

  deleteTask(task: any, event: any) {
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();
    let index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
  onIframeError(event: any) {
    console.log('iframe failed');
   }
}
