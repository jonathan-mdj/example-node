var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var itemsRouter = require('./routes/items')

const client = require('prom-client')

var app = express()

// 1. Habilitar métricas por defecto de Node.js
client.collectDefaultMetrics()

// 2. Crear métricas personalizadas
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP procesadas',
  labelNames: ['metodo', 'ruta', 'estado_http'],
})

const activeUsersGauge = new client.Gauge({
  name: 'active_users_current',
  help: 'Número actual de usuarios activos simulados'
})

// 3. Endpoint /metrics para Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.send(await client.register.metrics())
})

// 4. Middleware para registrar peticiones
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      metodo: req.method,
      ruta: req.path,
      estado_http: res.statusCode.toString(),
    })
  })
  next()
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/items', itemsRouter)

module.exports = app
