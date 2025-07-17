import { test, expect, request } from '@playwright/test';

const BASE_URL = 'https://reqres.in/api';

async function authenticate() {
  const apiRequest = await request.newContext();
  const response = await apiRequest.post(`${BASE_URL}/login`, {
    data: {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka'
    }
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.token).toBeTruthy();
  return { token: body.token, apiRequest };
}

test('API: authenticate, create, verify, and update a task', async () => {
  const { token, apiRequest } = await authenticate();

  const createRes = await apiRequest.post(`${BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { title: 'Test Task', completed: false }
  });
  expect(createRes.ok()).toBeTruthy();
  const createdTask = await createRes.json();
  expect(createdTask.id).toBeTruthy();

  const getRes = await apiRequest.get(`${BASE_URL}/tasks`);
  expect(getRes.ok()).toBeTruthy();
  const tasks = await getRes.json();
  const found = Array.isArray(tasks.data)
    ? tasks.data.find(t => t.id === createdTask.id)
    : undefined;
  expect(found).toBeTruthy();

  const updateRes = await apiRequest.put(`${BASE_URL}/tasks/${createdTask.id}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { ...createdTask, completed: true }
  });
  expect(updateRes.ok()).toBeTruthy();
  const updatedTask = await updateRes.json();
  expect(updatedTask.completed).toBe(true);

  await apiRequest.dispose();
});
