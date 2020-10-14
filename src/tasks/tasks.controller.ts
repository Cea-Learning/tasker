import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) { }

  @Get()
  getTasks(@Query() filterDto:GetTaskFilterDto): Task[] {
    if (Object.keys(filterDto).length){
      return this.taskService.getTasksWithFilter(filterDto);
    }
    return this.taskService.getAllTasks();
  }

  @Get(":id")
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id)
  }
  @Delete(":id")
  deleteTaskById(@Param('id') id: string): void {
    this.taskService.deleteTaskById(id)
  }
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto)
  }
  @Patch(":id/status")
  updateTaskStatus(@Param("id") id:string, @Body('status') status:TaskStatus):Task{
    return this.taskService.updateTaskStatus(id ,status);
  }

}
