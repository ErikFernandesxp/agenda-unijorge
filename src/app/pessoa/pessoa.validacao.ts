import { ErrosPessoa, PessoaCadastro, RascunhoPessoa } from './pessoa.model';

export function obrigatorio(valor: string, campo: string): string | null {
  return valor.trim().length === 0 ? `${campo} nao pode ficar em branco.` : null;
}

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

export function tamanhoEntre(
  valor: string,
  min: number,
  max: number,
  campo: string
): string | null {
  const texto = valor.trim();

  if (texto.length === 0) {
    return null;
  }

  if (texto.length < min || texto.length > max) {
    return `${campo} deve ter entre ${min} e ${max} caracteres.`;
  }

  return null;
}

export function quantidadeDeDigitos(
  valor: string,
  quantidade: number,
  campo: string
): string | null {
  const digitos = apenasDigitos(valor);

  if (digitos.length === 0) {
    return null;
  }

  return digitos.length === quantidade ? null : `${campo} deve ter ${quantidade} digitos.`;
}

export function primeiroErro(...verificacoes: Array<string | null>): string | null {
  return verificacoes.find(mensagem => mensagem !== null) ?? null;
}

export function validarNomeCompleto(nome: string): string | null {
  return primeiroErro(
    obrigatorio(nome, 'O nome completo'),
    tamanhoEntre(nome, 3, 120, 'O nome completo'),
    /\d/.test(nome) ? 'O nome completo nao pode conter numeros.' : null
  );
}

export function validarDataNascimento(data: string): string | null {
  const vazio = obrigatorio(data, 'A data de nascimento');
  if (vazio !== null) {
    return vazio;
  }

  const nascimento = new Date(`${data}T00:00:00`);
  if (Number.isNaN(nascimento.getTime())) {
    return 'Data de nascimento invalida.';
  }

  const hoje = new Date();
  if (nascimento > hoje) {
    return 'A data de nascimento nao pode estar no futuro.';
  }

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  const aindaNaoFezAniversario =
    mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate());

  if (aindaNaoFezAniversario) {
    idade -= 1;
  }

  if (idade < 0 || idade > 120) {
    return 'A idade deve estar entre 0 e 120 anos.';
  }

  return null;
}

export function validarCpf(cpf: string): string | null {
  return primeiroErro(
    obrigatorio(cpf, 'O CPF'),
    quantidadeDeDigitos(cpf, 11, 'O CPF')
  );
}

export function validarRg(rg: string): string | null {
  return primeiroErro(
    obrigatorio(rg, 'O RG'),
    tamanhoEntre(rg, 5, 12, 'O RG'),
    apenasDigitos(rg).length > 0 && apenasDigitos(rg).length < 5
      ? 'O RG deve ter pelo menos 5 digitos.'
      : null
  );
}

export function validarNomePessoa(nome: string, campo: string): string | null {
  return primeiroErro(
    obrigatorio(nome, campo),
    tamanhoEntre(nome, 3, 120, campo),
    /\d/.test(nome) ? `${campo} nao pode conter numeros.` : null
  );
}

export function validarEmail(email: string): string | null {
  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  return primeiroErro(
    obrigatorio(email, 'O e-mail'),
    email.trim().length > 0 && !formato.test(email.trim())
      ? 'E-mail em formato invalido.'
      : null
  );
}

export function validarTelefone(telefone: string): string | null {
  return primeiroErro(
    obrigatorio(telefone, 'O telefone'),
    quantidadeDeDigitos(telefone, 10, 'O telefone')
  );
}

export function validarHomepage(homepage: string): string | null {
  const url = homepage.trim();
  const regex = /^https?:\/\/[\w.-]+(?:\.[\w.-]+)+(?:[\w\-._~:/?#[\]@!$&'()*+,;=]+)*$/i;

  return primeiroErro(
    obrigatorio(homepage, 'A home page'),
    url.length > 0 && !regex.test(url) ? 'A home page deve ser uma URL valida.' : null
  );
}

export function validarUf(uf: string): string | null {
  return primeiroErro(
    obrigatorio(uf, 'A UF de origem'),
    uf.trim().length > 0 && !/^[A-Z]{2}$/.test(uf.trim().toUpperCase())
      ? 'A UF deve conter 2 letras.'
      : null
  );
}

export function validarRascunho(
  rascunho: RascunhoPessoa,
  jaCadastrados: PessoaCadastro[]
): ErrosPessoa {
  const erros: ErrosPessoa = {};

  const defina = (campo: keyof ErrosPessoa, mensagem: string | null): void => {
    if (mensagem !== null) {
      erros[campo] = mensagem;
    }
  };

  defina('nomeCompleto', validarNomeCompleto(rascunho.nomeCompleto));
  defina('dataNascimento', validarDataNascimento(rascunho.dataNascimento));
  defina('cpf', validarCpf(rascunho.cpf));
  defina('rg', validarRg(rascunho.rg));
  defina('nomeMae', validarNomePessoa(rascunho.nomeMae, 'O nome da mae'));
  defina('nomePai', validarNomePessoa(rascunho.nomePai, 'O nome do pai'));
  defina('paisOrigem', obrigatorio(rascunho.paisOrigem, 'O pais de origem'));
  defina('ufOrigem', validarUf(rascunho.ufOrigem));
  defina('cidadeOrigem', obrigatorio(rascunho.cidadeOrigem, 'A cidade de origem'));

  const jaExiste = jaCadastrados.some(
    pessoa => pessoa.email.trim().toLowerCase() === rascunho.email.trim().toLowerCase()
  );
  defina(
    'email',
    primeiroErro(validarEmail(rascunho.email), jaExiste ? 'Este e-mail ja foi cadastrado.' : null)
  );

  defina('telefone', validarTelefone(rascunho.telefone));
  defina('homepage', validarHomepage(rascunho.homepage));

  return erros;
}
