import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks.status.enum';
import { Task } from "./task.entity";
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) { }
  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  getTasks(filterDto : GetTaskFilterDto): Promise<Task[]>{
return this.taskRepository.getTask(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID:${id} does not exist`);
    }
    return found;
  }
  async deleteTaskById(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if(result.affected === 0){
      throw new NotFoundException(`Task with id ${id} not found`)
    }
  }
  // getTasksWithFilter(filterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status)
  //   }
  //   if (search) {
  //     tasks = tasks.filter(task => task.title.includes(search) || task.description.includes("search"));
  //   }
  //   return tasks
  // }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

}
