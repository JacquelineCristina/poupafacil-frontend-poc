import { DespesasService } from './../services/despesas.service';
import { GrupoService} from './../services/grupo.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Grupo } from '../models/grupo.model';

@Component({
  selector: 'app-cadastrar-despesa',
  templateUrl: './cadastrar-despesa.component.html',
  styleUrls: ['./cadastrar-despesa.component.css']
})
export class CadastrarDespesaComponent implements OnInit {

  inputNomeDespesa: string
  inputIdGrupo: number
  inputValor: number
  inputParcela: number
  inputData: string
  inputCategoria : string 
  isGrupo: boolean = false;
  isParcela: boolean=false;
 

  cadastroForm = new FormGroup({
    inputNomeDespesa: new FormControl(''),
    inputIdGrupo: new FormControl(''),
    inputValor: new FormControl(''),
    inputParcela: new FormControl(''),
    inputData: new FormControl(''),
    inputCategoria: new FormControl('')
  });

  grupos: any[];
  token: any;

  constructor(
    private httpClient: HttpClient, 
    private despesasService: DespesasService,
    private grupoService: GrupoService) {}

  ngOnInit(): void {
    this.carregarGrupos()
  }

  cadastrarDespesa() {
    let body
    let parcelaCompra
    if(this.cadastroForm.value.inputParcela== ""){
      parcelaCompra = 1
    }else{
      parcelaCompra = this.cadastroForm.value.inputParcela;
    }
    if(this.cadastroForm.value.inputIdGrupo != "0"){
      body = {
        nomeDespesa: this.cadastroForm.value.inputNomeDespesa,
        proprietarioDespesa: 2,
        valor: this.cadastroForm.value.inputValor, 
        parcela: parcelaCompra,
        data: this.cadastroForm.value.inputData,
        idGrupo: this.cadastroForm.value.inputIdGrupo,
        tag: this.cadastroForm.value.inputCategoria
      }
    } else {
      body = {
        nomeDespesa: this.cadastroForm.value.inputNomeDespesa,
        proprietarioDespesa: 2,
        valor: this.cadastroForm.value.inputValor,
        parcela: parcelaCompra,
        data: this.cadastroForm.value.inputData
      }
    } 
    console.log("TODO: ajustar body")
    console.log(body)
    this.token = localStorage.getItem("token");
    this.despesasService.createDespesa(body, this.token);

  }

  public carregarGrupos() {
    this.token = localStorage.getItem("token")
    this.grupoService.getGrupos(this.token ).subscribe(objeto => {
      this.grupos = objeto
    }) 
  }

  onCompraParcelada(){
  if(this.isParcela == true){
      this.isParcela = false;
    }else{
      this.isParcela = true;
    }
    console.log(this.isParcela)
  }

}
