import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { target: 10, duration: '30s' }, // sube a 10 usuarios en 30 segundos
    { target: 10, duration: '1m' },  // mantiene 10 usuarios por 1 minuto
    { target: 0,  duration: '30s' }, // baja a 0 usuarios
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de las requests deben responder en menos de 500ms
    http_req_failed: ['rate<0.01'],   // menos del 1% de errores
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // vista 1: health check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health status es 200': (r) => r.status === 200,
    'health responde ok': (r) => JSON.parse(r.body).status === 'OK',
  });

  sleep(1);

  // vista 2: lista de items
  const itemsRes = http.get(`${BASE_URL}/items`);
  check(itemsRes, {
    'items status es 200': (r) => r.status === 200,
    'items devuelve arreglo': (r) => JSON.parse(r.body).length > 0,
  });

  sleep(1);

  // vista 3: users
  const usersRes = http.get(`${BASE_URL}/users`);
  check(usersRes, {
    'users status es 200': (r) => r.status === 200,
  });

  sleep(1);
}