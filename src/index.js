// -------------------- Conf. iniciais ------------------------

import express from 'express';
import cors  from 'cors';
import bcrypt from 'bcrypt';

const app = express()

app.use(cors())

app.use(express.json())

// -----------------------Desafio final pág 7 ------------------

app.get('/', (req, res) => {
    res.status(200).send('Bem vindo à aplicação');
});

// --------------------Criar pessoa usuária ------------------
let users = [];
let userId = 1;

app.post('/signup', async (req, res) =>{
    const personName = req.body.personName;
    const personEmail = req.body.personEmail;
    const personPassword = req.body.personPassword;

    if(!personName){
        return res
        .status(400)
        .send(JSON.stringify({Mensagem: "Por favor, verifique se passou o nome."}))
    }

    if(!personEmail){
        return res
        .status(400)
        .send(JSON.stringify({Mensagem: "Por favor, verifique se passou o email."}))
    }

    const existingUser = users.find(user => user.personEmail === personEmail);
    if (existingUser) {
        return res.status(400).send(JSON.stringify({ Mensagem: "Email já cadastrado, insira outro." }));
    }

    if(!personPassword){
        return res
        .status(400)
        .send(JSON.stringify({Mensagem: "Por favor, verifique se passou a senha."}))
    }

    const safePassword = await bcrypt.hash(personPassword, 10)

    let newUser = {
        id: userId,
        personName: personName,
        personEmail: personEmail,
        personPassword: safePassword,
    }

    users.push(newUser)

    userId++

    res.status(201).send({Mensagem: `Seja bem vindo ${personName}! Pessoa usuária registrada com sucesso!`})
})

// ----------------------- Logar usuário ---------------------

app.post('/login', async (req, res) => {
    const {personEmail, personPassword} = req.body;

    if (!personEmail){
        return res
            .status(400)
            .send(JSON.stringify({Mensagem: "Insira um e-mail válido"}));
    }

    if (!personPassword){
        return res
            .status(400)
            .send(JSON.stringify({Mensagem: "Insira uma senha válida"}));
    }
    
    const findUser = users.find(user => user.personEmail === personEmail)

    if (!findUser){
        return res
            .status(404)
            .send(JSON.stringify({Mensagem: "Email não encontrado no sistema, verifique ou crie uma conta"}));
    }
    
    const matchPassword = await bcrypt.compare(personPassword, findUser.personPassword);

    if (!matchPassword){
        return res
            .status(401)
            .send(JSON.stringify({Mensagem: "Insira uma senha válida"}))
    }

    res.status(200).send(JSON.stringify({Mensagem: `Seja vem vindo ${findUser.personName} ! Pessoa usuária logada com sucesso!`}))
})

// ----------------------- Criar recado ---------------------
let messages = [];
let messageId = 1;

app.post('/massage',(req,res)=>{
    const email = req.body.email;
    const title = req.body.title;
    const description = req.body.description;

    if (!email) {
        return res.status(400).send(JSON.stringify({
            Mensagem: 'Informe um e-mail'
        }));
    }

    if (!title) {
        res.status(400).send(JSON.stringify({
            Mensagem: 'Informe um título'
        }))
    }

    if (!description) {
      res.status(400).send(JSON.stringify({
          Mensagem: 'Informe uma descrição'
      }))
    }

    const findUser = users.find(user => user.personEmail === email);

    if (!findUser) {
        return res.status(404).send(JSON.stringify({
            Mensagem: 'Email não encontrado, verifique ou crie uma conta'
        }));
    }

    let newMassage ={
        id: messageId,
        messageTitle: title,
        messageDescription: description,
        userEmail: email,
    }

    messages.push(newMassage)

    messageId ++

    response.status(201).send(JSON.stringify({Mensagem: `Mensagem criado com sucesso! <br> ${newMassage.messageDescription}`}))
})

// ------------------------- Ler recado -----------------------

app.get('/massage/:email', (req, res) => {
    const email = req.params.email; /* pegar parametro da URL*/

    const findUser = users.find(user => user.personEmail === email);

    if (!findUser) {
        return res.status(404).send(JSON.stringify({
            Mensagem: 'Email não encontrado, verifique ou crie uma conta'
        }));
    }

    const userMessages = messages.filter(message => message.userEmail === email);

    if (userMessages.length === 0) {
      return res.status(400).send(JSON.stringify({
        Mensagem: 'Não há mensagens',
      }))
    }
  
    const mappedData = messages.map((messages) => `Título: ${messages.messageTitle} - Descrição: ${messages.messageDescription}`)
  
    res.status(200).send({ Mensagem: `Seja bem-vinde! Mensagens do usuário: <br>${mappedData.join('<br>')}` });
})

// ---------------------- Alterar recado ---------------------

app.put('/massage/:id', (req, res) => {
    const searchId = Number(request.params.id);

    if (!searchId) {
        return res.status(400).send({ Mensagem: 'Por favor, informe um id válido da mensagem'});
    }

    const updatedMessage = messages.find(message => message.id === searchId);

    if (!updatedMessage) {
        return res.status(404).json({ Mensagem: "Por favor, informe um id válido da mensagem" });
    }

    const newTitle = req.body.newTitle;
    const newDescription = req.body.newDescription;

    if (!newTitle) {
        return res.status(400).send({ Mensagem: 'Informe um novo título válido' });
    }

    if (!newDescription) {
        return res.status(400).send({ Mensagem: 'Informe uma nova descrição válida' });
    }

    if (newTitle) {
        updatedMessage.messageTitle = newTitle;
    }

    if (newDescription) {
        updatedMessage.messageDescription = newDescription;
    }

    response.status(200).send({ Mensagem: 'Mensagem atualizada com sucesso !', messages: updatedMessage });
});

//-------------------- Remover recado -------------------------

app.delete('/massage/:id',(req, res)=>{
    const searchId = Number(request.params.id);

    if (!searchId) {
        return res.status(400).send({ Mensagem: 'Mensagem não encontrada, verifique o identificador em nosso banco'});
    }

    const updatedMessage = users.find(message => message.id === searchId);

    if (!updatedMessage) {
        return res.status(404).json({ Mensagem: "Mensagem não encontrada, verifique o identificador em nosso banco" });
    }
  
    const deletedMessageIndex = messages.findIndex(message => message.id === searchId)
  
    if(deletedMessageIndex  === -1){
      return res
          .status(400)
          .send(JSON.stringify({ Mensagem: "Mensagem não encontrada, verifique o identificador em nosso banco" }))
    }else{
      messages.splice(deletedMessageIndex, 1)
      res
      .status(200)
      .send(JSON.stringify({ Mensagem: "Mensagem apagada com sucesso" }))
    }
  
  })

// ----------------------- Verificar API ---------------------

app.listen(8080, () => console.log('Servidor iniciado'));