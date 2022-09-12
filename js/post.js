const baseURL = 'https://nf-api.onrender.com/api/v1/social';
import { getSessionStorage } from './index.js';

const ss = getSessionStorage();
console.log(ss.token);
function post() {
  const res = fetch(`${baseURL}/posts`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 0,
      owner: 'string',
      created: '2022-09-04T16:21:02.042Z',
      updated: '2022-09-04T16:21:02.042Z',
      title: 'string',
      body: 'string',
      tags: ['string'],
      media: 'string',
    }),
  });
  const data = res.json();
  console.log('ssfsefr:::::', data);
}
// post();
