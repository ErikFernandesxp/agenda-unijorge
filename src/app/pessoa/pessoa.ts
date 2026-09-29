import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CampoPessoa,
  CamposTocados,
  ErrosPessoa,
  PessoaCadastro,
  RascunhoPessoa,
  rascunhoPessoaEmBranco
} from './pessoa.model';
import { validarRascunho } from './pessoa.validacao';

/**
 * COMPONENTE DE PESSOA
 *
 * Este e o desenho do formulario de cadastro da pessoa.
 * Nao ha regra de validacao nenhuma aqui dentro: quem sabe validar e o
 * pessoa.validacao.ts. A classe so guarda o estado e conversa com a tela.
 *
 * Quatro membros e o coracao de tudo:
 *
 *   rascunho  o que esta sendo digitado agora
 *   tocados   em quais campos a pessoa ja entrou e saiu
 *   erros     GETTER, recalculado a cada verificacao de tela
 *   salvar()  o que acontece quando o formulario e enviado
 */
@Component({
  selector: 'app-pessoa',
  imports: [FormsModule],
  templateUrl: './pessoa.html',
  styleUrl: './pessoa.css'
})
export class Pessoa {
  readonly titulo = 'Cadastro de pessoa';

  /** exposto para o template montar os campos sem repetir logica */
  rascunho: RascunhoPessoa = rascunhoPessoaEmBranco();

  tocados: CamposTocados = {};

  cadastrados: PessoaCadastro[] = [];

  /**
   * GETTER, e nao campo.
   * Campo e calculado uma vez, na construcao. Getter e recalculado toda
   * vez que alguem o le -- e quem le e o Angular, a cada verificacao.
   * E por isso que a mensagem acompanha a digitacao sem ninguem
   * chamar "revalidar".
   */
  get erros(): ErrosPessoa {
    return validarRascunho(this.rascunho, this.cadastrados);
  }

  get quantidadeDeErros(): number {
    return Object.keys(this.erros).length;
  }

  get temErro(): boolean {
    return this.quantidadeDeErros > 0;
  }

  /** So mostra a mensagem se a pessoa JA SAIU do campo. */
  deveMostrar(campo: CampoPessoa): boolean {
    return this.tocados[campo] === true && this.erros[campo] !== undefined;
  }

  mensagem(campo: CampoPessoa): string {
    return this.erros[campo] ?? '';
  }

  marcarTocado(campo: CampoPessoa): void {
    this.tocados[campo] = true;
  }

  /** Ao enviar, todo campo passa a ser "tocado": e o que um formulario faz. */
  mostrarTudo(): void {
    const campos = Object.keys(this.rascunho) as CampoPessoa[];
    for (const campo of campos) {
      this.tocados[campo] = true;
    }
  }

  salvar(): void {
    if (this.temErro) {
      this.mostrarTudo();
      return;
    }

    this.cadastrados = [
      ...this.cadastrados,
      { id: this.proximoId(), ...this.rascunho }
    ];

    this.limpar();
  }

  limpar(): void {
    this.rascunho = rascunhoPessoaEmBranco();
    this.tocados = {};
  }

  remover(id: number): void {
    this.cadastrados = this.cadastrados.filter(c => c.id !== id);
  }

  private proximoId(): number {
    const maior = this.cadastrados.reduce((max, c) => Math.max(max, c.id), 0);
    return maior + 1;
  }
}
