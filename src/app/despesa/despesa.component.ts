import { Tags } from './../models/tags.model';
import { Despesa } from './../models/despesa.model';
import { CompiladoDespesas } from './../models/compiladoDespesas.model';
import { Estimativas } from '../models/estimativas.model';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Grafico } from '../models/grafico.model';
import { DespesasService } from '../services/despesas.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-despesa',
  templateUrl: './despesa.component.html',
  styleUrls: ['./despesa.component.css']
})
export class DespesaComponent implements OnInit {

  despesas: Despesa[] = []
  token: any;

  exibirEstimativas: boolean = false;
  exibirTags: boolean = false;
  exibirListaDespesas: boolean = false
  exibirCarregamento: boolean = true;

  compiladoDespesas: CompiladoDespesas[]

  formularioCadastroDespesa: boolean = true;
  graficoEstimativas: Grafico = {
    nome: "Estimativas",
    tipo: "bar",
    labels: [],
    data: [],
    legend:false
  }
  graficoTags: any = {
    nome: "Categoria",
    tipo: "doughnut",
    labels: [],
    data: []
  }

  constructor(
    private router: Router, 
    private http: HttpClient,
    private despesasService: DespesasService) { }

  deletarDespesa(item: any){
    console.log(item.idCorrelacaoParcela)
    this.token = localStorage.getItem("token")
    this.despesasService.deleteDespesa(this.token, item.idCorrelacaoParcela).subscribe(response=>{
      console.log("deletado")
    },
    error=>{
      console.log("Erro ao deletar")
    })
    console.log(item)
  }


  async ngOnInit() {
    this.token = localStorage.getItem("token")
  
    await this.carregarDespesasPorPessoa();
    await this.carregarEstimativas();
    await this.carregarTags();
    
  }

  async carregarDespesasPorPessoa(){
    this.despesasService.getDespesasPorPessoa(this.token).subscribe(obj => {
      let estimativasLabels: string[] = []
      let estimativasData: string[] = []

      this.compiladoDespesas = obj
      this.compiladoDespesas[0].despesas.forEach(d => {
        this.despesas.push(d)
      })
    })
  }

  async carregarEstimativas(){
    await this.despesasService.getEstimativas(this.token ).subscribe(objeto => {
      console.log("Carregando estimativas")
      let estimativas: Estimativas[] = objeto
      let estimativasLabels: string[] = []
      let estimativasData: string[] = [];
     
      console.log(estimativas);
      estimativas.forEach(estimativa => {
        estimativasLabels.push(formatarDataExtenso(estimativa.data))
        estimativasData.push(estimativa.totalDespesasMes + '')
      })
      
      this.graficoEstimativas.labels = estimativasLabels
      this.graficoEstimativas.data = estimativasData
      this.graficoEstimativas.legend = false

      if(this.despesas.length != 0){
        this.exibirEstimativas = true
        this.exibirCarregamento = false;
      }else{
        this.exibirCarregamento = true;
        this.exibirEstimativas = false;     
      }
     console.log(objeto)

    },
    error =>{
      console.log('Erro ao carregar informações', error["message"])
      console.log("HTTP status: "+error.status)
      if(error.status == 403){
          alert("Sessão expirada, efetue login");
          this.router.navigate(['/login']);
      }
    } )
  }



 async carregarTags() {
  
    this.despesasService.getTags(this.token).subscribe(objeto => {
      console.log("Carregando Tags")
      let tags: Tags[] = objeto
      let estimativasLabels: string[] = []
      let estimativasData: string[] = [];
    
      tags.forEach(tag => {
        estimativasLabels.push(tag.tag)
        estimativasData.push(tag.total+'')
      })
    
      this.graficoTags.labels = estimativasLabels
      this.graficoTags.data = estimativasData
    
      if(tags.length!=0){
        this.exibirTags = true
      }else{
        this.exibirTags = false
      }
    
    })
  }
}



function formatarDataExtenso(periodo: string) {
  var data = new Date();
  let periodoAno = periodo.substring(0,4);
  let periodoMes = periodo.substring(5,7)
  
  data.setFullYear(parseInt(periodoAno));
  data.setMonth(parseInt(periodoMes));
  // Meses possíveis
  var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  var mes = data.getMonth();

  // Resultado
  var extenso =  meses[mes-1] + ' - ' + periodoAno;
  return extenso;

}







