import Head from 'next/head'
import { useState, FormEvent } from 'react'
import { mutate, trigger } from 'swr'
import fetch from 'lib/fetch'

import { useQuerySubscription, fetchQueryData } from 'hooks/useQuerySubscription'

const todosQuery = `
    query TODOS {
      todos: Todo {
        id
        task
        status
      }
    }
  `

const todosSub = `
    subscription TODOS {
      todos: Todo {
        id
        task
        status
      }
    }
  `

export default function Home(props) {
  const { data } = useQuerySubscription(
    { query: todosQuery, document: todosSub },
    { initialData: props.data }
  )
  console.log({ data })
  const [task, setTask] = useState('')
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    mutate(
      todosQuery,
      { todos: [...data.todos, { id: data.todos.length + 1, task, status: 'Pending' }] },
      false
    )
    const mutation = {
      query: `
      mutation ADD_TASK($task: String!) {
        addTodo: insert_Todo_one(object: {task: $task}) {
          id
          task
          status
        }
      }    
      `,
      variables: {
        task,
      },
    }
    await fetch(mutation)
    trigger(mutation)
    setTask('')
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Hello</h1>
        <form noValidate onSubmit={handleSubmit}>
          <input type="text" value={task} onChange={(e) => setTask(e.target.value)} />
          <button>Add Task</button>
        </form>
        <ul>
          {data?.todos?.map((todo) => {
            return (
              <li key={todo.id}>
                {todo.task} -- {todo.status}
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const data = await fetchQueryData(todosQuery)
  return {
    props: { data },
  }
}
