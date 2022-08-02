# hackthon
Repositório criado durante o Hackthon do Programa de Formação da FCamara Season 3

Tivemos como objetivo buscar uma solução para facilitar o contato das pessoas que estão na área de tecnologia por meio de uma plataforma onde fosse possível interagir, buscar mentores, tirar dúvidas, gerar networking, encontrar orientações entre outras funcionalidades para os seus usuários buscarem crescimento.  

Link para a documentação da API criada:
https://documenter.getpostman.com/view/20510257/Uyr4JKMh

Essa API foi criada para auxiliar na elaboração do Front end do projeto pelo grupo, por ser uma versão inicial da API e buscando um MVP não focamos em rotas que não fossem agregar no nosso projeto, por esse motivo acabamos deixando um pouco de lado algumas validações que poderiam ser realizadas para melhorar o funcionamento, rotas de edição e para deletar informações pois não estavam no escopo inicial.

Na parte de usuários foi criada algumas rotas extras com o objetivo de poder nos auxiliar a criar teste do funcionamento da API e poder cuidar do nosso banvo de dados. Escolhemos o Heroku para hospedar o nosso banco de dados e fazer o deploy da nossa API com o objetivo de facilitar a utilização e integração com o front. O link base da nossa API é https://hackthon-squad15.herokuapp.com/ e temos uma documentação que se encontra no link disponibilizado no início do README, ela detalha um pouco melhor o funcionamento das rotas e o que é necessário enviar de requisição e como será o seu retorno.

Apesar de ter sido desenvolvido um midleware para que possamos validar se o usuário está logado e utilizar esse Token para buscar algumas informações do mesmo, foi deixado como comentário essa verificação para que não afete no funcionamento do Front end, pois como não seria criado uma tela de login para entrar na plataforma a outra solução seria deixar já definido o token dentro do código o que também geraria uma falha de segurança e podendo causar problemas quando ele expirasse, por esse motivo preferimos alterar o código para não usar o token e deixar como comentário o que seria utilizado caso fosse implementado.

Membros do squad:
UX/UI:
- Erica Neres
- Isabela Viega
- João Curtinova

Desenvolvedores:
- Adriano Silva
- Eduardo Pezzi
- Felipe Moreira Souza
- Guilherme Vaz
