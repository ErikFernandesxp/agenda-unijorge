/**
 * MODELO DE REFERENCIA PARA PESSOA
 *
 * Aqui mora o FORMATO dos dados da ficha de pessoa. Nada de regra,
 * nada de tela. Este arquivo descreve "o que existe" no formulario.
 *
 * Repare em tres decisoes que se repetem na estrutura de qualquer
 * cadastro:
 *
 *   1. As strings ficam vazias por padrao, porque os campos do HTML
 *      começam sem valor.
 *   2. As datas sao string, nao Date: um <input type="date"> devolve
 *      texto no formato 'aaaa-mm-dd'.
 *   3. O id so existe depois de salvar a ficha, por isso ele fica fora
 *      do rascunho.
 */

export interface PessoaCadastro {
  id: number;
  nomeCompleto: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  nomeMae: string;
  nomePai: string;
  paisOrigem: string;
  ufOrigem: string;
  cidadeOrigem: string;
  email: string;
  telefone: string;
  homepage: string;
}

/**
 * O que fica sendo digitado enquanto a pessoa ainda nao salvou.
 * Omit tira o id, que so existe depois de persistir a ficha.
 */
export type RascunhoPessoa = Omit<PessoaCadastro, 'id'>;

/**
 * Os nomes dos campos do formulario de pessoa.
 */
export type CampoPessoa = keyof RascunhoPessoa;

/**
 * Mapa de erros: de cada campo para a sua mensagem.
 * Partial porque um formulario valido e um objeto vazio: {}.
 */
export type ErrosPessoa = Partial<Record<CampoPessoa, string>>;

/**
 * Idem para marcar em quais campos a pessoa ja entrou e saiu.
 */
export type CamposTocados = Partial<Record<CampoPessoa, boolean>>;

/**
 * Uma ficha zerada. Funcao, e nao constante, para cada chamada devolver um objeto novo.
 */
export function rascunhoPessoaEmBranco(): RascunhoPessoa {
  return {
    nomeCompleto: '',
    dataNascimento: '',
    cpf: '',
    rg: '',
    nomeMae: '',
    nomePai: '',
    paisOrigem: '',
    ufOrigem: '',
    cidadeOrigem: '',
    email: '',
    telefone: '',
    homepage: ''
  };
}
