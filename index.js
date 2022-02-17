const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(logger)

let notes = [{
        'id': 1,
        'content': 'delectus aut autem',
        'important': false,
        'date': '2022-02-16T14:48:40.655Z'
    },
    {
        'id': 2,
        'content': 'quis ut nam facilis et officia qui',
        'important': false,
        'date': '2022-02-16T14:48:40.655Z'
    },
    {
        'id': 3,
        'content': 'fugiat veniam minus',
        'important': false,
        'date': '2022-02-16T14:48:40.655Z'
    }
]

//^ Definición de las rutas
app.get('/', (request, response) => {
    response.send('<h1>Bienvenido a la API de ZUX</h1>')
})
// ^ URL, principal
app.get('/api/notes', (request, response) => {
    response.json(notes)
})
// ^ URL con id especifico
app.get('/api/notes/:id', (request, response) => {
    // ! Obtenemos el parámetro mandado en la uri
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).json({
            error: 'La nota especificada no existe'
        })
    }
})
// ^ URL borrar recursos
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).json(notes)
})
// ^ URL crear recursos
app.post('/api/notes/', (request, response) => {
    const note = request.body
    if (!note || !note.content) {
        return response.status(400).json({
            error: 'Note Content is missing'
        })
    }
    const ids = notes.map(note => note.id)
    const maxId = Math.max(...ids)
    const newNote = {
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== 'undefined' ?
            note.important : false,
        date: new Date().toISOString()
    }
    notes = [...notes, newNote]
    response.status(201).json(newNote)
})
// ^ Retorno de error cada vez que enviamos una URL no valida
app.use((request, response) => {
    console.log(request.path)
    response.status(404).json({
        error: "Not found"
    })
})

//* Definición del servidor
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})