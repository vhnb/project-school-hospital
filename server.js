const fs = require('fs')
const path = require('path')
const express = require('express')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const medicamentosPath = path.join(__dirname, 'datas', 'medicamentos.json')
const pacientesPath = path.join(__dirname, 'datas', 'pacientes.json')

let medicamentosData = fs.readFileSync(medicamentosPath, 'utf-8')
let medicamentos = JSON.parse(medicamentosData)

let pacientesData = fs.readFileSync(pacientesPath, 'utf-8')
let pacientes = JSON.parse(pacientesData)

function buscarMedicamentos(nome_medicamento) {
    return medicamentos.find(medicamentos => medicamentos.nome_medicamento.toLowerCase() === nome_medicamento.toLowerCase())
}
function buscarPacientes(nome_paciente) {
    return pacientes.find(pacientes => pacientes.nome_paciente.toLowerCase() === nome_paciente.toLowerCase())
}

const public = path.join(__dirname, 'public')

app.use(express.static(public))

function salvarDados() {
    fs.writeFileSync(pacientesPath, JSON.stringify(pacientes, null, 2))
    fs.writeFileSync(medicamentosPath, JSON.stringify(medicamentos, null, 2))
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'main.html'))
})

app.get('/medicamentos', (req, res) => {
    res.send(`<h1>Medicamentos:</h1><a href="/">Voltar</a><pre>${JSON.stringify(medicamentos, null, 2)}</pre>`);
    res.sendFile(path.join(__dirname, 'pages', 'medicamentos.html'))
})

app.get('/pacientes', (req, res) => {
    res.send(`<h1>Pacientes:</h1><a href="/">Voltar</a><pre>${JSON.stringify(pacientes, null, 2)}</pre>`);
    res.sendFile(path.join(__dirname, 'pages', 'pacientes.html'))
})

app.get('/buscar', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'buscar.html'))
})

app.post('/adicionar-medicamento', (req, res) => {
    const novoMedicamento = req.body

    medicamentos.push(novoMedicamento)
    salvarDados()
    res.sendFile(path.join(__dirname, 'pages', 'notificações', 'sucessomedicamento.html'))
})

app.get('/adicionar-medicamento', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'adicionarmedicamento.html'))
})

app.post('/adicionar-paciente', (req, res) => {
    const novoPaciente = req.body

    pacientes.push(novoPaciente)
    salvarDados()
    res.sendFile(path.join(__dirname, 'pages', 'notificações', 'sucessopaciente.html'))
})

app.get('/adicionar-paciente', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'adicionarpaciente.html'))
})

app.get('/buscar-medicamento/:nome_medicamento', (req, res) => {
    const nomeDoMedicamentoBuscado = req.query.nome_medicamento
    const medicamentoEncontrado = buscarMedicamentos(nomeDoMedicamentoBuscado)

    if (medicamentoEncontrado) {
        res.send(`<h1>Medicamentos encontrados:</h1><a href="/buscar">Voltar</a><pre>${JSON.stringify(medicamentoEncontrado, null, 2)}</pre>`)
    } else {
        res.sendFile(path.join(__dirname, 'pages', 'notificações', 'errorbuscarmedicamento.html'))
    }
})

app.get('/buscar-paciente/:nome_paciente', (req, res) => {
    const nomeDoPacienteBuscado = req.query.nome_paciente
    const pacienteEncontrado = buscarPacientes(nomeDoPacienteBuscado)

    if (pacienteEncontrado) {
        res.send(`<h1>Pacientes encontrados:</h1><a href="/buscar">Voltar</a><pre>${JSON.stringify(pacienteEncontrado, null, 2)}</pre>`)
    } else {
        res.sendFile(path.join(__dirname, 'pages', 'notificações', 'errorbuscarpaciente.html'))
    }
})

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
})
