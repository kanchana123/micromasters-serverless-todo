import TodosAccess from './todosAcess'
import AttachmentUtils from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
import 'source-map-support/register';
// import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';

// dev imported
// import TodosAccess from '../dataLayer/todosAccess';
// import TodosStorage from '../dataLayer/todosStorage';
import { getUserId } from '../lambda/utils';
// import { CreateTodoRequest } from '../requests/CreateTodoRequest';
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
// import { TodoItem } from '../models/TodoItem';

const todosAccess = new TodosAccess();
const todosStorage = new AttachmentUtils();

export async function createTodo(event: APIGatewayProxyEvent,
                                 createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4();
    const userId = getUserId(event);
    
    const createdAt = new Date(Date.now()).toISOString();

    const todoItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: `https://${todosStorage.getBucketName()}.s3.amazonaws.com/${todoId}`,
        ...createTodoRequest
    };

    await todosAccess.addTodoToDB(todoItem);

    return todoItem;
}

export async function deleteTodo(event: APIGatewayProxyEvent) {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);

    if (!(await todosAccess.getTodoFromDB(todoId, userId))) {
        return false;
    }

    await todosAccess.deleteTodoFromDB(todoId, userId);

    return true;
}

export async function getTodo(event: APIGatewayProxyEvent) {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);

    return await todosAccess.getTodoFromDB(todoId, userId);
}

export async function getTodos(event: APIGatewayProxyEvent) {
    const userId = getUserId(event);

    return await todosAccess.getAllTodosFromDB(userId);
}

export async function getTodosForUser(event: APIGatewayProxyEvent) {
    const userId = getUserId(event);

    return await todosAccess.getAllTodosFromDB(userId);
}

export async function updateTodo(event: APIGatewayProxyEvent,
                                 updateTodoRequest: UpdateTodoRequest) {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);

    if (!(await todosAccess.getTodoFromDB(todoId, userId))) {
        return false;
    }

    await todosAccess.updateTodoInDB(todoId, userId, updateTodoRequest);

    return true;
}

export async function generateUploadUrl(event: APIGatewayProxyEvent) {
    const bucket = todosStorage.getBucketName();
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
    const todoId = event.pathParameters.todoId;

    const createSignedUrlRequest = {
        Bucket: bucket,
        Key: todoId,
        Expires: parseInt(urlExpiration)
    }

    return todosStorage.getPresignedUploadURL(createSignedUrlRequest);
}