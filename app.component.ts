import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MasterService } from './Service/master.service';
import { ApiResponseModel, Task } from './model/task';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

interface ITask {
  itemId: number;
  taskName: string;
  taskDescription: string;
  dueDate: Date;
  createdOn: Date;
  isCompleted: boolean;
  tags: string;
  completedOn: Date;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,DatePipe,FormsModule,NgxPaginationModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  searchTerm: string = '';
  filterWorkoutType: string = 'All';
  filteredTasks: Task[] = [];
  p: number = 1; // Current page number
  itemsPerPage: number = 10; // Items per page
  taskObj: Task = new Task();
  taskList: ITask[] = [];



  masterService = inject(MasterService);
  

  ngOnInit(): void {
    this.loadAllTask();
    this.filteredTasks = this.taskList;
  }

  ngOnChanges() {
    this.filterTasks();
  }

  filterTasks(): void {

    const searchTermLower = this.searchTerm.toLowerCase();
    const filterTypeLower = this.filterWorkoutType.toLowerCase();

    this.filteredTasks = this.taskList.filter(task => {
      const matchesSearchTerm = task.taskName.toLowerCase().includes(searchTermLower) ||
                                task.taskDescription.toLowerCase().includes(searchTermLower);

      const matchesFilterType = filterTypeLower === 'all' || task.taskDescription.toLowerCase().includes(filterTypeLower);

      return matchesSearchTerm && matchesFilterType;
    });
  }


  loadAllTask() {
    this.masterService.getAllTaskList().subscribe((res: ApiResponseModel) => {
      this.taskList = res.data;
    })
  }
  addTask(): void  {
    this.masterService.addNewtask(this.taskObj).subscribe((res:ApiResponseModel)=>{
      if(res.result) {
        alert('Task Created Success');
        this.loadAllTask();
        this.taskObj = new Task();
      }
    },error=> {
      alert('API Call Error')
    })
  }
  updateTask(): void  {
    this.masterService.updateTask(this.taskObj).subscribe((res:ApiResponseModel)=>{
      if(res.result) {
        alert('Task Updated Success');
        this.loadAllTask();
        this.taskObj = new Task();
      }
    },error=> {
      alert('API Call Error')
    })
  }

  onDelete(id: number): void  {
    const isConfirm = confirm("Are you sure Want to Delete");
    if(isConfirm) {
      this.masterService.deleteTask(id).subscribe((res:ApiResponseModel)=>{
        if(res.result) {
          alert('Task Delete Success');
          this.loadAllTask();
        }
      },error=> {
        alert('API Call Error')
      })
    }

  }
   

  onEdit(item:Task ): void {
    this.taskObj = item;
    setTimeout(() => {
      const dat = new Date(this.taskObj.dueDate);
      const day = ('0' + dat.getDate()).slice(-2);
      const month = ('0' + (dat.getMonth() + 1)).slice(-2);
      const today = dat.getFullYear() + '-' + (month) + '-' + (day);
      (<HTMLInputElement>document.getElementById('textDate')).value = today
    },1000);
  }
}
