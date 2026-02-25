const request = require('supertest');
const app = require('../app');
const { calculateValue } = require('../lib/logic');

describe('Suite de Pruebas de Calidad de Software', () => {
  describe('Pruebas Unitarias - Lógica de Inventario', () => {
    test('Debe calcular correctamente el valor total (10 * 5 = 50)', () => {
      const result = calculateValue(10, 5);
      expect(result).toBe(50);
    });

    test('Debe retornar 0 si se ingresan valores negativos', () => {
      const result = calculateValue(-10, 5);
      expect(result).toBe(0);
    });

    // Pruebas unitarias adicionales
    test('Debe retornar 0 si ambos valores son negativos', () => {
      const result = calculateValue(-10, -5);
      expect(result).toBe(0);
    });

    test('Debe manejar correctamente valores decimales', () => {
      const result = calculateValue(10.5, 3);
      expect(result).toBe(31.5);
    });

    test('Debe retornar 0 cuando el stock es negativo aunque el precio sea positivo', () => {
      const result = calculateValue(10, -5);
      expect(result).toBe(0);
    });

    test('Debe calcular correctamente con valores grandes', () => {
      const result = calculateValue(1000, 500);
      expect(result).toBe(500000);
    });
  });

  describe('Pruebas de Integración - API Endpoints', () => {
    test('GET /health - Debe responder con status 200 y JSON correcto', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
    });

    test('GET /items - Debe validar la estructura del inventario', async () => {
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Validamos que el primer objeto tenga las propiedades requeridas
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('stock');
    });

    // Pruebas de integración adicionales
    test('GET /items - Debe retornar al menos un item en el inventario', async () => {
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('name');
    });

    test('GET /items - Debe validar que todos los items tengan las propiedades requeridas', async () => {
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(200);
      response.body.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('stock');
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
        expect(typeof item.stock).toBe('number');
      });
    });

    test('GET /health - Debe incluir la propiedad uptime en la respuesta', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });

    test('GET /items - Debe retornar Content-Type application/json', async () => {
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});
