import { TestBed } from '@angular/core/testing';
import { MasterService } from './master.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Task, ApiResponseModel } from '../model/task';

describe('MasterService', () => {
  let service: MasterService;
  let httpMock: HttpTestingController;

  const mockTasks: Task[] = [
    { itemId: 1, taskName: 'Test Task', taskDescription: 'Running', dueDate: new Date(), createdOn: new Date(), isCompleted: false, tags: 'Test', completedOn: new Date() }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MasterService]
    });

    service = TestBed.inject(MasterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all tasks', () => {
    service.getAllTaskList().subscribe((res: ApiResponseModel) => {
      expect(res.data).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(service.apiUrl + 'GetAllTaskList');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockTasks, message: 'Success', result: 'true' });
  });

  it('should add a new task', () => {
    const newTask: Task = new Task();
    service.addNewtask(newTask).subscribe((res: ApiResponseModel) => {
      expect(res.result).toBe('true');
    });

    const req = httpMock.expectOne(service.apiUrl + 'CreateNewTask');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Success', result: 'true', data: newTask });
  });

  it('should update a task', () => {
    const updatedTask: Task = { ...mockTasks[0], taskName: 'Updated Task' };
    service.updateTask(updatedTask).subscribe((res: ApiResponseModel) => {
      expect(res.result).toBe('true');
    });

    const req = httpMock.expectOne(service.apiUrl + 'UpdateTask');
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Success', result: 'true', data: updatedTask });
  });

  it('should delete a task', () => {
    const taskId = 1;
    service.deleteTask(taskId).subscribe((res: ApiResponseModel) => {
      expect(res.result).toBe('true');
    });

    const req = httpMock.expectOne(`${service.apiUrl}DeleteTask?itemId=${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Success', result: 'true' });
  });
});

