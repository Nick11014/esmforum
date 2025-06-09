const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de resposta', () => {
  // Primeiro, cadastra uma pergunta para poder responder
  const id_pergunta = modelo.cadastrar_pergunta('Como fazer um teste?');
  
  // Cadastra uma resposta para a pergunta
  const id_resposta = modelo.cadastrar_resposta(id_pergunta, 'Use Jest para testar.');
    // Verifica se o ID da resposta foi retornado
  expect(id_resposta).toBeDefined();
  expect(typeof id_resposta).toBe('number');
});

test('Testando get_pergunta', () => {
  // Cadastra uma pergunta
  const id_pergunta = modelo.cadastrar_pergunta('Qual é o melhor framework de testes?');
  
  // Busca a pergunta pelo ID
  const pergunta = modelo.get_pergunta(id_pergunta);
  
  // Verifica se a pergunta foi retornada corretamente
  expect(pergunta).toBeDefined();
  expect(pergunta.id_pergunta).toBe(id_pergunta);
  expect(pergunta.texto).toBe('Qual é o melhor framework de testes?');
  expect(pergunta.id_usuario).toBe(1);
});

test('Testando get_respostas', () => {
  // Cadastra uma pergunta
  const id_pergunta = modelo.cadastrar_pergunta('O que é integração contínua?');
  
  // Cadastra algumas respostas para a pergunta
  modelo.cadastrar_resposta(id_pergunta, 'É uma prática de desenvolvimento de software.');
  modelo.cadastrar_resposta(id_pergunta, 'Envolve testes automatizados.');
  
  // Busca as respostas da pergunta
  const respostas = modelo.get_respostas(id_pergunta);
  
  // Verifica se as respostas foram retornadas corretamente
  expect(respostas).toBeDefined();
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('É uma prática de desenvolvimento de software.');
  expect(respostas[1].texto).toBe('Envolve testes automatizados.');
  expect(respostas[0].id_pergunta).toBe(id_pergunta);
  expect(respostas[1].id_pergunta).toBe(id_pergunta);
});

test('Testando integração completa: pergunta com resposta', () => {
  // Cadastra uma pergunta
  const id_pergunta = modelo.cadastrar_pergunta('Como testar integração?');
  
  // Cadastra uma resposta
  const id_resposta = modelo.cadastrar_resposta(id_pergunta, 'Teste o modelo com o banco de dados.');
  
  // Verifica se a pergunta e resposta estão relacionadas
  const pergunta = modelo.get_pergunta(id_pergunta);
  const respostas = modelo.get_respostas(id_pergunta);
  
  expect(pergunta.texto).toBe('Como testar integração?');
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('Teste o modelo com o banco de dados.');
  expect(respostas[0].id_resposta).toBe(id_resposta);
  
  // Verifica se o número de respostas é calculado corretamente
  const perguntas = modelo.listar_perguntas();
  const pergunta_encontrada = perguntas.find(p => p.id_pergunta === id_pergunta);
  expect(pergunta_encontrada.num_respostas).toBe(1);
});
