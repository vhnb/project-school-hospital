const fs = require('fs')
const path = require('path')
const express = require('express')

const app = express()
const port = 3002

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

//ir para a pagina inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'main.html'))
})

//remover pacientes
app.get('/remover-paciente', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'remover', 'removerpacientes.html'))
})

app.post('/remover-paciente', (req, res) => {
    const { nome_paciente } = req.body

    const removerPacienteIndex = pacientes.findIndex(paciente => paciente.nome_paciente.toLowerCase() === nome_paciente.toLowerCase())

    if(removerPacienteIndex === -1) {
        res.sendFile(path.join(__dirname, 'pages', 'notificações', 'errorbuscarpaciente.html'))
        return
    }

    res.redirect(`/remover-paciente-confirmar?nome_paciente=${encodeURIComponent(nome_paciente)}`)
})

app.get('/remover-paciente-confirmar', (req, res) => {
    const nome_paciente = req.query.nome_paciente

    const removerPacienteIndex = pacientes.findIndex(paciente => paciente.nome_paciente.toLowerCase() === nome_paciente.toLocaleLowerCase())

    pacientes.splice(removerPacienteIndex, 1)

    salvarDados(pacientes)

    res.sendFile(path.join(__dirname, 'pages', 'notificações', 'remover', 'removidopaciente.html'))
})

//remover medicamentos
app.get('/remover-medicamento', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'remover', 'removermedicamentos.html'))
})

app.post('/remover-medicamento', (req, res) => {
    const { nome_medicamento } = req.body

    const removerMedicamentoIndex = medicamentos.findIndex(medicamento => medicamento.nome_medicamento.toLowerCase() === nome_medicamento.toLowerCase())

    if (removerMedicamentoIndex === -1) {
        res.sendFile(path.join(__dirname, 'pages', 'notificações', 'errorbuscarmedicamento.html'))
        return
    }

    res.redirect(`/remover-medicamento-confirmar?nome_medicamento=${encodeURIComponent(nome_medicamento)}`)
})

app.get('/remover-medicamento-confirmar', (req, res) => {
    const nome_medicamento = req.query.nome_medicamento

    const removerMedicamentoIndex = medicamentos.findIndex(medicamento => medicamento.nome_medicamento.toLowerCase() === nome_medicamento.toLowerCase())

    medicamentos.splice(removerMedicamentoIndex, 1)

    salvarDados(medicamentos)

    res.sendFile(path.join(__dirname, 'pages', 'notificações', 'remover', 'removidomedicamento.html'))
})

// alteração de medicamentos
app.get('/alterar-medicamento', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'alterar', 'alterarmedicamentos.html'))
})

app.post('/alterar-medicamento', (req, res) => {
    const { nome_medicamento, novoPrecoMedicamento } = req.body

    let medicamentoIndex = medicamentos.findIndex(medicamento => medicamento.nome_medicamento.toLowerCase() === nome_medicamento.toLowerCase())

    if (medicamentoIndex === -1) {
        res.sendFile(path.join(__dirname, 'pages', 'notificações', 'errorbuscarmedicamento.html'))
        return
    }

    medicamentos[medicamentoIndex].preco_medicamento = novoPrecoMedicamento

    salvarDados(medicamentos)

    res.sendFile(path.join(__dirname, 'pages', 'notificações', 'alteração', 'alteradomedicamento.html'))
})

// alteração de pacientes
app.get('/alterar-paciente', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'alterar', 'alterarpacientes.html'))
})

app.post('/alterar-paciente', (req, res) => {
    const { nome_paciente, novaDataPaciente } = req.body

    let pacienteIndex = pacientes.findIndex(paciente => paciente.nome_paciente.toLowerCase() === nome_paciente.toLowerCase())

    if (pacienteIndex === -1) {
        res.sendFile(path.join(__dirname, 'pages', 'notificações', 'errorbuscarpaciente.html'))
        return
    }

    pacientes[pacienteIndex].data_paciente = novaDataPaciente

    salvarDados(pacientes)

    res.sendFile(path.join(__dirname, 'pages', 'notificações', 'alteração', 'alteradopaciente.html'))
})

//metodo de fazer percorrer a lista de medicamentos dentro de medicamentos.html
app.get('/medicamentos', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'medicamentos.html'))
})
app.get('/medicamentos-data', (req, res) => {
    res.json(medicamentos);
});

//metodo de fazer percorrer a lista de pacientes dentro de pacientes.html
app.get('/pacientes', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'pacientes.html'))
})
app.get('/pacientes-data', (req, res) => {
    res.json(pacientes)
})

//pagina de pesquisas
app.get('/buscar', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'buscar.html'))
})

//metodo de adicionar medicamento
app.post('/adicionar-medicamento', (req, res) => {
    const novoMedicamento = req.body

    medicamentos.push(novoMedicamento)
    salvarDados()
    res.sendFile(path.join(__dirname, 'pages', 'notificações', 'sucessomedicamento.html'))
})

app.get('/adicionar-medicamento', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'adicionarmedicamento.html'))
})

//metodo de adicionar paciente
app.post('/adicionar-paciente', (req, res) => {
    const novoPaciente = req.body

    pacientes.push(novoPaciente)
    salvarDados()
    res.sendFile(path.join(__dirname, 'pages', 'notificações', 'sucessopaciente.html'))
})

app.get('/adicionar-paciente', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'adicionarpaciente.html'))
})

// buscar medicamento
app.get('/buscar-medicamento/:nome_medicamento', (req, res) => {
    const nomeDoMedicamentoBuscado = req.query.nome_medicamento
    const medicamentoEncontrado = buscarMedicamentos(nomeDoMedicamentoBuscado)

    if (medicamentoEncontrado) {
        const templateMedicamentoPath = path.join(__dirname, 'pages', 'results', 'resultmedicamentos.html')
        const templateMedicamentoData = fs.readFileSync(templateMedicamentoPath, 'utf-8')

        const htmlMedicamentos = templateMedicamentoData
            .replace('{{nome_medicamento}}', medicamentoEncontrado.nome_medicamento)
            .replace('{{preco_medicamento}}', medicamentoEncontrado.preco_medicamento)

        res.send(htmlMedicamentos)

    } else {
        res.sendFile(path.join(__dirname, 'pages', 'notificações', 'errorbuscarmedicamento.html'))
    }
})

//buscar paciente
app.get('/buscar-paciente/:nome_paciente', (req, res) => {
    const nomeDoPacienteBuscado = req.query.nome_paciente
    const pacienteEncontrado = buscarPacientes(nomeDoPacienteBuscado)

    if (pacienteEncontrado) {
        const templatePacientePath = path.join(__dirname, 'pages', 'results', 'resultpacientes.html')
        const templatePacienteData = fs.readFileSync(templatePacientePath, 'utf-8')

        const htmlPacientes = templatePacienteData
            .replace('{{nome_paciente}}', pacienteEncontrado.nome_paciente)
            .replace('{{data_paciente}}', pacienteEncontrado.data_paciente)

        res.send(htmlPacientes)

    } else {
        res.sendFile(path.join(__dirname, 'pages', 'notificações', 'errorbuscarpaciente.html'))
    }
})

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
})
