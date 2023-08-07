import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  private tasks: Task[] = []; // In-memory data stored as an array of tasks

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasks;
  }

  async findOne(id: number): Promise<Task | undefined> {
    return this.tasks.find((task) => task.id === id);
  }

  async create(taskData: Partial<Task>): Promise<Task> {
    const newTask: Task = {
      id: this.tasks.length > 0 ? this.tasks[this.tasks.length - 1].id + 1 : 1,
      title: '', // Provide default values for required properties
      description: '',
      status: '',
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...taskData, // Apply any additional properties provided in taskData
    };
    this.tasks.push(newTask);
    return newTask;
  }

  async update(id: number, taskData: Partial<Task>): Promise<Task | undefined> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex >= 0) {
      const updatedTask = { ...this.tasks[taskIndex], ...taskData, updatedAt: new Date() };
      this.tasks[taskIndex] = updatedTask;
      return updatedTask;
    }
    return undefined; // Task with the given ID not found
  }

  async delete(id: number): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
