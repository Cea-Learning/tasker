import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { TaskStatus } from './tasks.status.enum';
import {Task} from './task.entity';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) { }

  @Get()
  getTasks(@Query(ValidationPipe) filterDto:GetTaskFilterDto): Promise<Task[]> {
    return this.taskService.getTasks(filterDto);
  }

  @Get(":id")
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getTaskById(id)
  }
  @Delete(":id")
  deleteTaskById(@Param('id',ParseIntPipe) id: number): void {
    this.taskService.deleteTaskById(id)
  }
  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto)
  }
  @Patch(":id/status")
  updateTaskStatus(@Param("id",ParseIntPipe) id:number, @Body('status', TaskStatusValidationPipe) status:TaskStatus):Promise<Task>{
    return this.taskService.updateTaskStatus(id ,status);
  }

}
