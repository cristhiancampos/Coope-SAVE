import { Component, OnInit,ViewChild,TemplateRef } from '@angular/core';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import {Chart } from 'chart.js/src/chart';
import { ServicioDepartamento } from '../servicios/departamento';
import { ServicioUsuario } from '../servicios/usuario';
import { ServicioSala } from '../servicios/sala';
import { ServicioSolicitudSala } from '../servicios/solicitudSala';
import { ServicioVehiculo } from '../servicios/vehiculo';
import { NgbDateStruct, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [ServicioDepartamento,ServicioUsuario,ServicioSala,ServicioSolicitudSala,ServicioVehiculo]
})
export class ReportesComponent implements OnInit {
  @ViewChild('modalSalas') modalSalas: TemplateRef<any>;
  @ViewChild('modalVehiculos') modalVehiculos: TemplateRef<any>;

  usuarios=[];
  departamentos=[];
  salas=[];
  vehiculos=[];
  identity;
  currentUser;
  vehiculoFiltro="";
  salaFiltro="";
  public mr: NgbModalRef;

  modelFechaInicio: NgbDateStruct;
  dateInicio: {year: number, month: number};
  modelFechaFinal: NgbDateStruct;
  dateFinal: {year: number, month: number};


  modelFechaInicioVehiculo: NgbDateStruct;
  dateInicioVehiculo: {year: number, month: number};
  modelFechaFinalVehiculo: NgbDateStruct;
  dateFinalVehiculo: {year: number, month: number};
  
  constructor(
    private _servUsuario: ServicioUsuario,
    private _servDepartamento: ServicioDepartamento,
    private _servSala: ServicioSala,
    private _servSolicitud: ServicioSolicitudSala,
    private _servVehiculo: ServicioVehiculo,
    private modal: NgbModal
  ) { 

    
  }
 
  abrir(modal) {
    this.mr = this.modal.open(modal);
  }
  cerrar() {
    this.mr.close();

  }

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerDepartamentos();
    this.obtenerSalas();
    this.obtenerVehiculos();
    $('#infoTable').on('click', 'tbody tr', function(event) {
      $(this).addClass('highlight').siblings().removeClass('highlight');
    });
  }
  
  setSalaSeleccionda(nombreSala:string){
    this.salaFiltro=nombreSala;
  }
  setVehiculoSelecciondo(vehiculoPlaca:string){
    this.vehiculoFiltro=vehiculoPlaca;
  }
  obtenerSalas() {
    this._servSala.obtenerSalasHabilitadas().subscribe(
      response => {
        if (response.message) {
          this.salas = response.message;
          //console.log(this.salas);
        } else {//no hay Salas registradas
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerDepartamentos() {
    this._servDepartamento.obtenerDepartamentos().subscribe(
      response => {
        if (response.message) {
          this.departamentos = response.message;
        } else {//ho hay departamentos registrados
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );

  }

  obtenerUsuarios() {
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    if (user != null) {
      this.identity = user;

      this.currentUser = user.correo.trim();
    } else { this.currentUser = "" }

    this._servUsuario.obtenerUsuarios().subscribe(
      response => {
        if (response.message) {
          this.usuarios = response.message;
        } else {//no hay Usuarios registradas
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }
  obtenerVehiculos() {
    this._servVehiculo.obtenerVehiculos().subscribe(
      response => {
        if (response.message) {
          this.vehiculos = response.message;
        } else {//ho hay vehiculos registrados
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }
  // ////////////////////////////////////////////LINE CHART///////////////////////////////////////////////
  // public lineChartData:Array<any> = [
  //   {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //   {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
  //   {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  // ];
  // public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  // public lineChartOptions:any = {
  //   responsive: true
  // };
  // public lineChartColors:Array<any> = [
  //   { // grey
  //     backgroundColor: 'rgba(148,159,177,0.2)',
  //     borderColor: 'rgba(148,159,177,1)',
  //     pointBackgroundColor: 'rgba(148,159,177,1)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  //   },
  //   { // dark grey
  //     backgroundColor: 'rgba(77,83,96,0.2)',
  //     borderColor: 'rgba(77,83,96,1)',
  //     pointBackgroundColor: 'rgba(77,83,96,1)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(77,83,96,1)'
  //   },
  //   { // grey
  //     backgroundColor: 'rgba(148,159,177,0.2)',
  //     borderColor: 'rgba(148,159,177,1)',
  //     pointBackgroundColor: 'rgba(148,159,177,1)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  //   }
  // ];
  // public lineChartLegend:boolean = true;
  // public lineChartType:string = 'line';
 
  // public randomize():void {
  //   let _lineChartData:Array<any> = new Array(this.lineChartData.length);
  //   for (let i = 0; i < this.lineChartData.length; i++) {
  //     _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
  //     for (let j = 0; j < this.lineChartData[i].data.length; j++) {
  //       _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
  //     }
  //   }
  //   this.lineChartData = _lineChartData;
  // }
 
  // // events
  // public chartClicked(e:any):void {
  //   console.log(e);
  // }
 
  // public chartHovered(e:any):void {
  //   console.log(e);
  // }

  // /////////////////////////////////////////////////////BAR CHART /////////////////////////////////////
  // public barChartOptions:any = {
  //   scaleShowVerticalLines: false,
  //   responsive: true
  // };
  // public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  // public barChartType:string = 'bar';
  // public barChartLegend:boolean = true;
 
  // public barChartData:any[] = [
  //   {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //   {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  // ];
 
  // // events
  // public chartClickedBar(e:any):void {
  //   console.log(e);
  // }
 
  // public chartHoveredBar(e:any):void {
  //   console.log(e);
  // }
 
  // public randomizeBar():void {
  //   // Only Change 3 values
  //   let data = [
  //     Math.round(Math.random() * 100),
  //     59,
  //     80,
  //     (Math.random() * 100),
  //     56,
  //     (Math.random() * 100),
  //     40];
  //   let clone = JSON.parse(JSON.stringify(this.barChartData));
  //   clone[0].data = data;
  //   this.barChartData = clone;
  //   /**
  //    * (My guess), for Angular to recognize the change in the dataset
  //    * it has to change the dataset variable directly,
  //    * so one way around it, is to clone the data, change it and then
  //    * assign it;
  //    */
  // }

  // ////////////////////////////////////////////////Doughnut Chart///////////////////////////////////////////////

  // // Doughnut
  // public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  // public doughnutChartData:number[] = [350, 450, 100];
  // public doughnutChartType:string = 'doughnut';
 
  // // events
  // public chartClickedDo(e:any):void {
  //   console.log(e);
  // }
 
  // public chartHoveredDo(e:any):void {
  //   console.log(e);
  // }



  //  /////////////////////////////////////////////////////////// Radar//////////////////////////////////////
  //  public radarChartLabels:string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];
   
  //   public radarChartData:any = [
  //     {data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A'},
  //     {data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B'}
  //   ];
  //   public radarChartType:string = 'radar';
   
  //   // events
  //   public chartClickedRa(e:any):void {
  //     console.log(e);
  //   }
   
  //   public chartHoveredRa(e:any):void {
  //     console.log(e);
  //   }

  //   // ////////////////////////////////////////////////////////Pie/////////////////////////////////
  // public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  // public pieChartData:number[] = [300, 500, 100];
  // public pieChartType:string = 'pie';
 
  // // events
  // public chartClickedPi(e:any):void {
  //   console.log(e);
  // }
 
  // public chartHoveredPi(e:any):void {
  //   console.log(e);
  // }
}
