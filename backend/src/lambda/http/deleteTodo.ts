import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todos'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    if (!(await deleteTodo(event))) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Item does not exist'
        })
      };
    }
  
    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    };
  }
).use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
