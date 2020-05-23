import { OfertasService } from './../ofertas.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject, of} from 'rxjs';
import { Oferta } from '../shared/oferta.model';
import { switchMap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css'],
  providers: [ OfertasService ]
})
export class TopoComponent implements OnInit {

  public ofertas: Observable<Oferta[]>
  public ofertas2: Oferta[]
  private subjectPesquisa: Subject<string> = new Subject<string>()

  constructor(private ofertasService: OfertasService) { }

  ngOnInit(): void {
    this.ofertas = this.subjectPesquisa //retorno oferta[]
      .pipe(
        debounceTime(1000), //executa a ação do switvhMap após 1 segundo
        distinctUntilChanged(), //para fazer pesquisas distintas
        switchMap((termo: string) => {

          if(termo.trim() === ''){
            //retornar um observable de array de ofertas vazio
            return of<Oferta[]>([])
          }
          return this.ofertasService.pesquisaOfertas(termo)
        }),
        catchError((erro: any) => {
          return of<Oferta[]>([])
        })
      )
      
      /*
      //Atribui a resposta do subscribe ao atributo ofertas2 que pode ser iterado no template
      //bastando trocar ofertas por ofertas2 na diretiva *ngFor do template 
      this.ofertas.subscribe((ofertas: Oferta[]) => {
        this.ofertas2 =  ofertas
      })
      */

      //Nesse caso o pipe async presente na diretiva *ngFor do template já esta realizando o
      //subscribe e recebendo a resposta
  }

  public pesquisa(termoDaBusca: string): void{
    this.subjectPesquisa.next(termoDaBusca)
  }

  public limpaPesquisa(): void {
    this.subjectPesquisa.next('')
  }

}
