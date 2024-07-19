import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MasterService } from './Service/master.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { of } from 'rxjs';
import { Task, ApiResponseModel } from './model/task';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let masterService: MasterService;

  const mockTasks: Task[] = [
    { itemId: 1, taskName: 'Test Task', taskDescription: 'Running', dueDate: new Date(), createdOn: new Date(), isCompleted: false, tags: 'Test', completedOn: new Date() }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, NgxPaginationModule],
      
      providers: [MasterService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    masterService = TestBed.inject(MasterService);

    spyOn(masterService, 'getAllTaskList').and.returnValue(of({ data: mockTasks, message: 'Success', result: 'true' }));
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should load all tasks on initialization', () => {
    component.ngOnInit();
    expect(component.taskList).toEqual(mockTasks);
    expect(component.filteredTasks).toEqual(mockTasks);
  });

  it('should filter tasks based on search term and filter type', () => {
    component.taskList = mockTasks;
    component.searchTerm = 'Test';
    component.filterWorkoutType = 'Running';
    component.filterTasks();

    expect(component.filteredTasks).toEqual(mockTasks);
  });
});
