import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { Chart } from 'chart.js/src/chart';
import { ServicioDepartamento } from '../servicios/departamento';
import { ServicioUsuario } from '../servicios/usuario';
import { ServicioSala } from '../servicios/sala';
import { ServicioSolicitudSala } from '../servicios/solicitudSala';
import { ServicioSolicitudVehiculo } from '../servicios/solicitudVehiculo';
import { ServicioVehiculo } from '../servicios/vehiculo';
import { NgbDateStruct, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudSala } from '../modelos/solicitudSala';
import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [
    ServicioDepartamento,
    ServicioUsuario,
    ServicioSala,
    ServicioSolicitudSala,
    ServicioVehiculo,
    ServicioSolicitudVehiculo
    , PdfmakeService]
})
export class ReportesComponent implements OnInit {
  @ViewChild('modalSalas') modalSalas: TemplateRef<any>;
  @ViewChild('modalVehiculos') modalVehiculos: TemplateRef<any>;

  usuarios = [];
  departamentos = [];
  salas = [];
  vehiculos = [];
  identity;
  currentUser;
  vehiculoFiltro = "";
  salaFiltro = "";
  solicitanteFiltro = "";
  departamentoFiltro = "";
  solicitanteFiltroVehiculo = "";
  departamentoFiltroVehiculo = "";
  usuarioGenerador = "";
  reporteSala = true;

  solicitudesSalasFiltradas = [];
  solicitudesVehiculosFiltradas = [];
  public mr: NgbModalRef;
  solicitudSala: SolicitudSala;

  modelFechaInicio: NgbDateStruct;
  modelFechaFinal: NgbDateStruct;
  modelFechaInicioVehiculo: NgbDateStruct;
  modelFechaFinalVehiculo: NgbDateStruct;


  reporteFiltros = [];//{sala:any,fechaInicio:any,fechaFin:any,solicitante:any,departamento:any,usuarioGenerador:any};


  constructor(
    private _servUsuario: ServicioUsuario,
    private _servDepartamento: ServicioDepartamento,
    private _servSala: ServicioSala,
    private _servSolicitudSala: ServicioSolicitudSala,
    private _servSolicitudVehiculo: ServicioSolicitudVehiculo,
    private _servVehiculo: ServicioVehiculo,
    private modal: NgbModal,
    private pdfmake: PdfmakeService
  ) {
    //this.reporteFiltros.solicitante="";
  }

  abrir(modal) {
    this.mr = this.modal.open(modal);
  }
  cerrar() {
    this.mr.close();

  }
  openPdf() {
    // this.pdfmake.download();
    this.pdfmake.open();
  }

  printPdf() {
    this.pdfmake.print();
  }

  downloadPDF() {
    this.pdfmake.download();
  }

  downloadPdfWithName(customName: string) {
    this.pdfmake.download(customName);
  }
  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerDepartamentos();
    this.obtenerSalas();
    this.obtenerVehiculos();
    this.pdfmake.configureStyles({ header: { fontSize: 18, bold: true } });

    // Add a text with style
    this.pdfmake.addText('This is a header, using header style', 'header');
    this.pdfmake.addImage('http://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png');
  }

  setSalaSeleccionda(nombreSala: string) {
    this.salaFiltro = nombreSala;
  }
  setVehiculoSelecciondo(vehiculoPlaca: string) {
    this.vehiculoFiltro = vehiculoPlaca;
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
  getNombreUsuario(id: any) {

    for (var i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i]._id === id) {
        return this.usuarios[i].nombre + " " + this.usuarios[i].apellidos;
      }

    }
  }

  getIdUsuario(nombre) {

    let usuarioSelected = "";
    for (let i = 0; i < nombre.length; i++) {
      if (nombre.charAt(i) === " ") {
      } else {
        usuarioSelected += nombre.charAt(i);
      }
    }
    let cadena = "";
    for (var index = 0; index < this.usuarios.length; index++) {
      let comparar = "";
      cadena = "";
      comparar = this.usuarios[index].nombre + "" + this.usuarios[index].apellidos;
      for (let j = 0; j < comparar.length; j++) {
        if (comparar.charAt(j) === " ") {
        } else {
          cadena += comparar.charAt(j);
        }
      }
      if (usuarioSelected == cadena) {
        return this.usuarios[index]._id;
      }
    }
  }

  getDepartamento(id) {
    let departamento;
    for (var j = 0; j < this.usuarios.length; j++) {
      if (this.usuarios[j]._id == id) {
        departamento = this.usuarios[j].departamento;
        break;
      }

    }
    for (var i = 0; i < this.departamentos.length; i++) {
      if (this.departamentos[i]._id == departamento) {
        return this.departamentos[i].nombre;
      }
    }
  }

  obternerMarcaAutomovil(placa: any) {
    for (var i = 0; i < this.vehiculos.length; i++) {
      if (this.vehiculos[i].placa == placa) {
        return this.vehiculos[i].marca;
      }

    }
  }

  obternerTipoAutomovil(placa: any) {
    for (var i = 0; i < this.vehiculos.length; i++) {
      if (this.vehiculos[i].placa == placa) {
        return this.vehiculos[i].tipo;
      }

    }
  }

  limpiarFiltros() {
    this.solicitanteFiltro = "";
    this.salaFiltro = "";
    this.departamentoFiltro = "";
    this.modelFechaInicio = null;
    this.modelFechaFinal = null;
    this.solicitudesSalasFiltradas = [];
  }

  limpiarFiltrosVehiculo() {
    this.solicitanteFiltroVehiculo = "";
    this.vehiculoFiltro = "";
    this.departamentoFiltroVehiculo = "";
    this.modelFechaInicioVehiculo = null;
    this.modelFechaFinalVehiculo = null;
    this.solicitudesVehiculosFiltradas = [];
  }

  //fitro para solicitudes de salas
  fitlroReporteSalas() {
    this.reporteFiltros = [];
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    if (user != null) {
      this.usuarioGenerador = user.nombre + " " + user.apellidos;
    }
    else {
      this.usuarioGenerador = "";
    }
    this._servSolicitudSala.obtenerTodasSolicitudes().subscribe(
      response => {
        if (response.message) {
          let array = response.message;

          if (this.salaFiltro != "" && this.modelFechaInicio != null && this.modelFechaFinal != null && this.solicitanteFiltro != "" && this.departamentoFiltro != "") {
            let solicitante = this.getIdUsuario(this.solicitanteFiltro);
            let arryTemp = [];
            for (let index = 0; index < array.length; index++) {
              let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
              let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
              let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
              let departamento = this.getDepartamento(array[index].usuario);
              if (array[index].sala == this.salaFiltro && (fechaIncio <= fechaSolicitud && fechaFin >= fechaSolicitud)
                && array[index].usuario == solicitante && departamento == this.departamentoFiltro) {
                console.log(array[index].usuario);
                arryTemp.push(array[index]);
              }
            }
            this.solicitudesSalasFiltradas = arryTemp;

          } else {

            let arrayTemporal = [];
            let arrayTemporal2 = [];
            let arrayTemporal3 = [];
            let arrayTemporal4 = [];
            let arrayTemporal5 = [];
            let arrayTemporal6 = [];

            if (this.salaFiltro != "") {// filtro de sala
              for (let index = 0; index < array.length; index++) {
                if (array[index].sala === this.salaFiltro) {
                  arrayTemporal2.push(array[index]);
                }
              }
              arrayTemporal = arrayTemporal2;
            }

            if (this.modelFechaInicio != null) {// filtro de fecha inicio

              if (arrayTemporal2.length > 0) {
                if (this.modelFechaFinal != null) {
                  for (let index = 0; index < arrayTemporal2.length; index++) {
                    let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                    let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                    let fechaSolicitud = ((arrayTemporal2[index].fecha.year * 365) + (arrayTemporal2[index].fecha.month * 30) + arrayTemporal2[index].fecha.day);
                    if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin) {
                      arrayTemporal3.push(arrayTemporal2[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal3;
                } else {
                  for (let index = 0; index < arrayTemporal2.length; index++) {
                    let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                    let fechaSolicitud = ((arrayTemporal2[index].fecha.year * 365) + (arrayTemporal2[index].fecha.month * 30) + arrayTemporal2[index].fecha.day);

                    if (fechaSolicitud == fechaIncio) {
                      arrayTemporal3.push(arrayTemporal2[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal3;
                }

              } else {

                if (this.modelFechaInicio != null && this.modelFechaFinal != null) {
                  for (let index = 0; index < array.length; index++) {
                    let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                    let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                    let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                    if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin) {
                      arrayTemporal3.push(array[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal3;
                } else {

                  for (let j = 0; j < array.length; j++) {
                    let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                    let fechaSolicitud = ((array[j].fecha.year * 365) + (array[j].fecha.month * 30) + array[j].fecha.day);

                    if (fechaSolicitud == fechaIncio) {
                      arrayTemporal3.push(array[j]);
                    }
                  }
                  arrayTemporal = arrayTemporal3;
                }
              }
            }

            if (this.modelFechaFinal != null) {// filtro de fecha final
              if (arrayTemporal3.length > 0) {
                if (this.modelFechaInicio != null) {
                  console.log("selccionó sala y fecha de incio también");
                  for (let index = 0; index < arrayTemporal3.length; index++) {
                    let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                    let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                    let fechaSolicitud = ((arrayTemporal3[index].fecha.year * 365) + (arrayTemporal3[index].fecha.month * 30) + arrayTemporal3[index].fecha.day);
                    if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin) {
                      arrayTemporal4.push(arrayTemporal3[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal4;
                } else {
                  console.log("seleccionó fecha salida");

                  for (let index = 0; index < arrayTemporal3.length; index++) {
                    let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                    let fechaSolicitud = ((arrayTemporal3[index].fecha.year * 365) + (arrayTemporal3[index].fecha.month * 30) + arrayTemporal3[index].fecha.day);

                    if (fechaSolicitud == fechaIncio) {
                      arrayTemporal4.push(arrayTemporal3[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal4;
                }

              } else {
                console.log('aquí');

                if (this.modelFechaInicio != null && this.modelFechaFinal != null) {
                  for (let index = 0; index < array.length; index++) {
                    let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                    let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                    let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                    if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && this.salaFiltro == array[index].sala) {
                      arrayTemporal4.push(array[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal4;
                }
                if (this.modelFechaFinal != null && this.salaFiltro == "") {
                  console.log('ddd');
                  // }
                  // else {
                  for (let z = 0; z < array.length; z++) {
                    let fechaFinal = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                    let fechaSolicitud = ((array[z].fecha.year * 365) + (array[z].fecha.month * 30) + array[z].fecha.day);

                    if (fechaSolicitud == fechaFinal) {
                      arrayTemporal4.push(array[z]);
                    }
                  }
                  arrayTemporal = arrayTemporal4;
                }
                else {
                  console.log("sss");
                  for (let z = 0; z < array.length; z++) {
                    let fechaFinal = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                    let fechaSolicitud = ((array[z].fecha.year * 365) + (array[z].fecha.month * 30) + array[z].fecha.day);

                    if (fechaSolicitud == fechaFinal && this.salaFiltro == array[z].sala) {
                      arrayTemporal4.push(array[z]);
                    }
                  }
                  arrayTemporal = arrayTemporal4;
                }
              }
            }

            if (this.solicitanteFiltro != "") {// filtro de solicitante

              if (arrayTemporal4.length > 0 && arrayTemporal2.length > 0 && arrayTemporal3.length == 0) {
                let solicitante = this.getIdUsuario(this.solicitanteFiltro);
                for (let index = 0; index < arrayTemporal4.length; index++) {

                  let fechaIncio = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                  let fechaSolicitud = ((arrayTemporal4[index].fecha.year * 365) + (arrayTemporal4[index].fecha.month * 30) + arrayTemporal4[index].fecha.day);

                  if (arrayTemporal4[index].usuario == solicitante
                    && arrayTemporal4[index].sala == this.salaFiltro &&
                    fechaIncio == fechaSolicitud) {
                    arrayTemporal5.push(arrayTemporal4[index]);
                  }
                }
                arrayTemporal = arrayTemporal5;
              }

              if (arrayTemporal4.length == 0 && arrayTemporal2.length > 0 && arrayTemporal3.length > 0) {
                let solicitante = this.getIdUsuario(this.solicitanteFiltro);
                for (let index = 0; index < arrayTemporal3.length; index++) {

                  let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                  let fechaSolicitud = ((arrayTemporal3[index].fecha.year * 365) + (arrayTemporal3[index].fecha.month * 30) + arrayTemporal3[index].fecha.day);

                  if (arrayTemporal3[index].usuario == solicitante
                    && arrayTemporal3[index].sala == this.salaFiltro &&
                    fechaIncio == fechaSolicitud) {
                    arrayTemporal5.push(arrayTemporal3[index]);
                  }
                }
                arrayTemporal = arrayTemporal5;
              }

              if (arrayTemporal4.length > 0 && arrayTemporal2.length > 0 && arrayTemporal3.length > 0) {
                let solicitante = this.getIdUsuario(this.solicitanteFiltro);
                for (let index = 0; index < arrayTemporal4.length; index++) {

                  if (arrayTemporal4[index].usuario == solicitante) {
                    arrayTemporal5.push(arrayTemporal4[index]);
                  }
                }
                arrayTemporal = arrayTemporal5;
              }

              if (arrayTemporal2.length == 0 && arrayTemporal3.length > 0 && arrayTemporal4.length > 0) {
                let solicitante = this.getIdUsuario(this.solicitanteFiltro);
                for (let index = 0; index < arrayTemporal4.length; index++) {
                  let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                  let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                  let fechaSolicitud = ((arrayTemporal4[index].fecha.year * 365) + (arrayTemporal4[index].fecha.month * 30) + arrayTemporal4[index].fecha.day);
                  if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && solicitante == arrayTemporal4[index].usuario) {
                    arrayTemporal5.push(arrayTemporal4[index]);
                  }
                }
                arrayTemporal = arrayTemporal5;
              }

              if (arrayTemporal4.length == 0 && arrayTemporal2.length == 0 && arrayTemporal3.length == 0) {
                let solicitante = this.getIdUsuario(this.solicitanteFiltro);
                for (let index = 0; index < array.length; index++) {

                  if (array[index].usuario == solicitante) {
                    arrayTemporal5.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal5;
              }
            }
            if (this.departamentoFiltro != "") {// filtro de departamento
              if (arrayTemporal2.length == 0 && arrayTemporal3.length == 0 && arrayTemporal4.length == 0 && arrayTemporal5.length == 0) {
                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  if (departamento == this.departamentoFiltro) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }

              if (this.salaFiltro != "") {
                console.log("seleccionó sala");
                arrayTemporal6 = [];
                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  if (departamento == this.departamentoFiltro && this.salaFiltro == array[index].sala) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }

              if (this.modelFechaInicio != null) {
                // console.log("seleccionó fecha inicio");

                arrayTemporal6 = [];

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);

                  if (departamento == this.departamentoFiltro && fechaIncio == fechaSolicitud) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }

              if (this.modelFechaFinal != null) {
                //console.log("seleccionó fecha final");

                arrayTemporal6 = [];

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);

                  if (departamento == this.departamentoFiltro && fechaFin == fechaSolicitud) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }

              if (this.solicitanteFiltro != "") {
                // console.log("seleccionó fecha solicitante");
                arrayTemporal6 = [];
                let solicitante = this.getIdUsuario(this.solicitanteFiltro);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);

                  if (solicitante == array[index].usuario && departamento == this.departamentoFiltro) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;

              }
              if (this.salaFiltro != "" && this.modelFechaInicio != null) {
                // console.log("seleccionó sala y fecha de inicio");
                arrayTemporal6 = [];

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);

                  if (departamento == this.departamentoFiltro && this.salaFiltro == array[index].sala && fechaIncio == fechaSolicitud) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.salaFiltro != "" && this.modelFechaFinal != null) {
                // console.log("seleccionó sala y fecha de fin");
                arrayTemporal6 = [];

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);

                  if (departamento == this.departamentoFiltro && this.salaFiltro == array[index].sala && fechaFin == fechaSolicitud) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.salaFiltro != "" && this.solicitanteFiltro != "") {
                // console.log("seleccionó sala y solicitante");
                arrayTemporal6 = [];
                let solicitante = this.getIdUsuario(this.solicitanteFiltro);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);

                  if (array[index].sala == this.salaFiltro && solicitante == array[index].usuario && departamento == this.departamentoFiltro) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.modelFechaInicio != null && this.modelFechaFinal != null) {
                // console.log("seleccionó fecha de inicio y fecha final");
                arrayTemporal6 = [];

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                  let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && departamento == this.departamentoFiltro) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.modelFechaFinal != null && this.solicitanteFiltro != "") {
                // console.log("seleccionó fecha final  y  solicitante");
                arrayTemporal6 = [];
                let solicitante = this.getIdUsuario(this.solicitanteFiltro);
                let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (solicitante == array[index].usuario && departamento == this.departamentoFiltro && fechaFin == fechaSolicitud) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.salaFiltro != "" && this.modelFechaFinal != null && this.solicitanteFiltro != "") {
                // console.log("seleccionó sala fecha final  y  solicitante");
                arrayTemporal6 = [];
                let solicitante = this.getIdUsuario(this.solicitanteFiltro);
                let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (solicitante == array[index].usuario && departamento == this.departamentoFiltro && fechaFin == fechaSolicitud && this.salaFiltro == array[index].sala) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.salaFiltro != "" && this.modelFechaInicio != null && this.solicitanteFiltro != "") {
                // console.log("seleccionó sala fecha inicio  y  solicitante");
                arrayTemporal6 = [];

                let solicitante = this.getIdUsuario(this.solicitanteFiltro);
                let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (solicitante == array[index].usuario && departamento == this.departamentoFiltro && fechaIncio == fechaSolicitud && this.salaFiltro == array[index].sala) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.salaFiltro != "" && this.modelFechaInicio != null && this.modelFechaFinal != null) {
                // console.log("seleccionó sala, fecha incio y fecha final");
                arrayTemporal6 = [];
                let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && departamento == this.departamentoFiltro && this.salaFiltro == array[index].sala) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.salaFiltro != null && this.modelFechaInicio != null && this.modelFechaFinal != null && this.solicitanteFiltro != "") {
                // console.log("seleccionó sala, fecha incio y fecha final y solicitante");
                arrayTemporal6 = [];
                let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                let solicitante = this.getIdUsuario(this.solicitanteFiltro);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && departamento == this.departamentoFiltro &&
                    this.salaFiltro == array[index].sala && array[index].usuario == solicitante) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;

              }
              if (this.modelFechaInicio != null && this.modelFechaFinal != null && this.solicitanteFiltro != "") {
                // console.log("seleccionó fecha incio y fecha final y solicitante");
                arrayTemporal6 = [];

                let fechaIncio = ((this.modelFechaInicio.year * 365) + (this.modelFechaInicio.month * 30) + this.modelFechaInicio.day);
                let fechaFin = ((this.modelFechaFinal.year * 365) + (this.modelFechaFinal.month * 30) + this.modelFechaFinal.day);
                let solicitante = this.getIdUsuario(this.solicitanteFiltro);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && departamento == this.departamentoFiltro &&
                    array[index].usuario == solicitante) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }
            }
            this.solicitudesSalasFiltradas = arrayTemporal;

          }
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

  //filtro para  solicitudes de vehículos
  fitlroReporteVehiculos() {
    this.reporteFiltros = [];
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    if (user != null) {
      this.usuarioGenerador = user.nombre + " " + user.apellidos;
    }
    else {
      this.usuarioGenerador = "";
    }

    this._servSolicitudVehiculo.obtenerTodasSolicitudes().subscribe(
      response => {
        if (response.message) {
          let array = response.message;

          if (this.vehiculoFiltro != "" && this.modelFechaInicioVehiculo != null && this.modelFechaFinalVehiculo != null && this.solicitanteFiltroVehiculo != "" && this.departamentoFiltroVehiculo != "") {
            // console.log('todos los filtros');
            let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);
            let arryTemp = [];
            for (let index = 0; index < array.length; index++) {
              let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
              let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
              let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
              let departamento = this.getDepartamento(array[index].usuario);

              if (array[index].sala == this.vehiculoFiltro && (fechaIncio <= fechaSolicitud && fechaFin >= fechaSolicitud)
                && array[index].usuario == solicitante && departamento == this.departamentoFiltroVehiculo) {
                //  console.log(array[index].usuario);
                arryTemp.push(array[index]);
              }
            }
            this.solicitudesVehiculosFiltradas = arryTemp;

          } else {

            let arrayTemporal = [];
            let arrayTemporal2 = [];
            let arrayTemporal3 = [];
            let arrayTemporal4 = [];
            let arrayTemporal5 = [];
            let arrayTemporal6 = [];

            if (this.vehiculoFiltro != "") {// filtro de sala
              // console.log('solo sala');
              for (let index = 0; index < array.length; index++) {
                if (array[index].vehiculo === this.vehiculoFiltro) {
                  arrayTemporal2.push(array[index]);
                }
              }
              arrayTemporal = arrayTemporal2;
            }

            if (this.modelFechaInicioVehiculo != null) {// filtro de fecha inicio

              if (arrayTemporal2.length > 0) {
                if (this.modelFechaFinalVehiculo != null) {
                  for (let index = 0; index < arrayTemporal2.length; index++) {
                    let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                    let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                    let fechaSolicitud = ((arrayTemporal2[index].fecha.year * 365) + (arrayTemporal2[index].fecha.month * 30) + arrayTemporal2[index].fecha.day);
                    if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin) {
                      arrayTemporal3.push(arrayTemporal2[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal3;
                } else {
                  for (let index = 0; index < arrayTemporal2.length; index++) {
                    let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                    let fechaSolicitud = ((arrayTemporal2[index].fecha.year * 365) + (arrayTemporal2[index].fecha.month * 30) + arrayTemporal2[index].fecha.day);

                    if (fechaSolicitud == fechaIncio) {
                      arrayTemporal3.push(arrayTemporal2[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal3;
                }

              } else {

                if (this.modelFechaInicioVehiculo != null && this.modelFechaFinalVehiculo != null) {
                  for (let index = 0; index < array.length; index++) {
                    let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                    let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                    let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                    if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin) {
                      arrayTemporal3.push(array[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal3;
                } else {

                  for (let j = 0; j < array.length; j++) {
                    let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                    let fechaSolicitud = ((array[j].fecha.year * 365) + (array[j].fecha.month * 30) + array[j].fecha.day);

                    if (fechaSolicitud == fechaIncio) {
                      arrayTemporal3.push(array[j]);
                    }
                  }
                  arrayTemporal = arrayTemporal3;
                }
              }
            }

            if (this.modelFechaFinalVehiculo != null) {// filtro de fecha final
              if (arrayTemporal3.length > 0) {
                if (this.modelFechaInicioVehiculo != null) {
                  // console.log("selccionó sala y fecha de incio también");
                  for (let index = 0; index < arrayTemporal3.length; index++) {
                    let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                    let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                    let fechaSolicitud = ((arrayTemporal3[index].fecha.year * 365) + (arrayTemporal3[index].fecha.month * 30) + arrayTemporal3[index].fecha.day);
                    if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin) {
                      arrayTemporal4.push(arrayTemporal3[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal4;
                } else {
                  //console.log("seleccionó fecha salida");

                  for (let index = 0; index < arrayTemporal3.length; index++) {
                    let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                    let fechaSolicitud = ((arrayTemporal3[index].fecha.year * 365) + (arrayTemporal3[index].fecha.month * 30) + arrayTemporal3[index].fecha.day);

                    if (fechaSolicitud == fechaIncio) {
                      arrayTemporal4.push(arrayTemporal3[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal4;
                }

              } else {
                //console.log('aquí');

                if (this.modelFechaInicioVehiculo != null && this.modelFechaFinalVehiculo != null) {
                  for (let index = 0; index < array.length; index++) {
                    let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                    let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                    let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                    if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && this.vehiculoFiltro == array[index].vehiculo) {
                      arrayTemporal4.push(array[index]);
                    }
                  }
                  arrayTemporal = arrayTemporal4;
                }
                if (this.modelFechaFinalVehiculo != null && this.vehiculoFiltro == "") {
                  //  console.log('ddd');
                  // }
                  // else {
                  for (let z = 0; z < array.length; z++) {
                    let fechaFinal = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                    let fechaSolicitud = ((array[z].fecha.year * 365) + (array[z].fecha.month * 30) + array[z].fecha.day);

                    if (fechaSolicitud == fechaFinal) {
                      arrayTemporal4.push(array[z]);
                    }
                  }
                  arrayTemporal = arrayTemporal4;
                }
                else {
                  // console.log("sss");
                  for (let z = 0; z < array.length; z++) {
                    let fechaFinal = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                    let fechaSolicitud = ((array[z].fecha.year * 365) + (array[z].fecha.month * 30) + array[z].fecha.day);

                    if (fechaSolicitud == fechaFinal && this.vehiculoFiltro == array[z].vehiculo) {
                      arrayTemporal4.push(array[z]);
                    }
                  }
                  arrayTemporal = arrayTemporal4;
                }
              }
            }

            if (this.solicitanteFiltroVehiculo != "") {// filtro de solicitante

              if (arrayTemporal4.length > 0 && arrayTemporal2.length > 0 && arrayTemporal3.length == 0) {
                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);
                for (let index = 0; index < arrayTemporal4.length; index++) {

                  let fechaIncio = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                  let fechaSolicitud = ((arrayTemporal4[index].fecha.year * 365) + (arrayTemporal4[index].fecha.month * 30) + arrayTemporal4[index].fecha.day);

                  if (arrayTemporal4[index].usuario == solicitante
                    && arrayTemporal4[index].vehiculo == this.vehiculoFiltro &&
                    fechaIncio == fechaSolicitud) {
                    arrayTemporal5.push(arrayTemporal4[index]);
                  }
                }
                arrayTemporal = arrayTemporal5;
              }

              if (arrayTemporal4.length == 0 && arrayTemporal2.length > 0 && arrayTemporal3.length > 0) {
                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);
                for (let index = 0; index < arrayTemporal3.length; index++) {

                  let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                  let fechaSolicitud = ((arrayTemporal3[index].fecha.year * 365) + (arrayTemporal3[index].fecha.month * 30) + arrayTemporal3[index].fecha.day);

                  if (arrayTemporal3[index].usuario == solicitante
                    && arrayTemporal3[index].vehiculo == this.vehiculoFiltro &&
                    fechaIncio == fechaSolicitud) {
                    arrayTemporal5.push(arrayTemporal3[index]);
                  }
                }
                arrayTemporal = arrayTemporal5;
              }

              if (arrayTemporal4.length > 0 && arrayTemporal2.length > 0 && arrayTemporal3.length > 0) {
                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);
                for (let index = 0; index < arrayTemporal4.length; index++) {

                  if (arrayTemporal4[index].usuario == solicitante) {
                    arrayTemporal5.push(arrayTemporal4[index]);
                  }
                }
                arrayTemporal = arrayTemporal5;
              }

              if (arrayTemporal2.length == 0 && arrayTemporal3.length > 0 && arrayTemporal4.length > 0) {
                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);
                for (let index = 0; index < arrayTemporal4.length; index++) {
                  let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                  let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                  let fechaSolicitud = ((arrayTemporal4[index].fecha.year * 365) + (arrayTemporal4[index].fecha.month * 30) + arrayTemporal4[index].fecha.day);
                  if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && solicitante == arrayTemporal4[index].usuario) {
                    arrayTemporal5.push(arrayTemporal4[index]);
                  }
                }
                arrayTemporal = arrayTemporal5;
              }

              if (arrayTemporal4.length == 0 && arrayTemporal2.length == 0 && arrayTemporal3.length == 0) {
                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);
                for (let index = 0; index < array.length; index++) {

                  if (array[index].usuario == solicitante) {
                    arrayTemporal5.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal5;
              }
            }
            if (this.departamentoFiltroVehiculo != "") {// filtro de departamento
              if (arrayTemporal2.length == 0 && arrayTemporal3.length == 0 && arrayTemporal4.length == 0 && arrayTemporal5.length == 0) {
                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  if (departamento == this.departamentoFiltroVehiculo) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }

              if (this.vehiculoFiltro != "") {
                //  console.log("seleccionó sala");
                arrayTemporal6 = [];
                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  if (departamento == this.departamentoFiltroVehiculo && this.vehiculoFiltro == array[index].vehiculo) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }

              if (this.modelFechaInicioVehiculo != null) {
                // console.log("seleccionó fecha inicio");

                arrayTemporal6 = [];

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);

                  if (departamento == this.departamentoFiltroVehiculo && fechaIncio == fechaSolicitud) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }

              if (this.modelFechaFinalVehiculo != null) {
                //console.log("seleccionó fecha final");

                arrayTemporal6 = [];

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);

                  if (departamento == this.departamentoFiltroVehiculo && fechaFin == fechaSolicitud) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }

              if (this.solicitanteFiltroVehiculo != "") {
                // console.log("seleccionó fecha solicitante");
                arrayTemporal6 = [];
                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);

                  if (solicitante == array[index].usuario && departamento == this.departamentoFiltroVehiculo) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;

              }
              if (this.vehiculoFiltro != "" && this.modelFechaInicioVehiculo != null) {
                // console.log("seleccionó sala y fecha de inicio");
                arrayTemporal6 = [];

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);

                  if (departamento == this.departamentoFiltroVehiculo && this.vehiculoFiltro == array[index].vehiculo && fechaIncio == fechaSolicitud) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.vehiculoFiltro != "" && this.modelFechaFinalVehiculo != null) {
                // console.log("seleccionó sala y fecha de fin");
                arrayTemporal6 = [];

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);

                  if (departamento == this.departamentoFiltroVehiculo && this.vehiculoFiltro == array[index].vehiculo && fechaFin == fechaSolicitud) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.vehiculoFiltro != "" && this.solicitanteFiltroVehiculo != "") {
                // console.log("seleccionó sala y solicitante");
                arrayTemporal6 = [];
                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);

                  if (array[index].vehiculo == this.vehiculoFiltro && solicitante == array[index].usuario && departamento == this.departamentoFiltroVehiculo) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.modelFechaInicioVehiculo != null && this.modelFechaFinalVehiculo != null) {
                // console.log("seleccionó fecha de inicio y fecha final");
                arrayTemporal6 = [];

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                  let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && departamento == this.departamentoFiltroVehiculo) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.modelFechaFinalVehiculo != null && this.solicitanteFiltroVehiculo != "") {
                // console.log("seleccionó fecha final  y  solicitante");
                arrayTemporal6 = [];
                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);
                let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (solicitante == array[index].usuario && departamento == this.departamentoFiltroVehiculo && fechaFin == fechaSolicitud) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.vehiculoFiltro != "" && this.modelFechaFinalVehiculo != null && this.solicitanteFiltroVehiculo != "") {
                // console.log("seleccionó sala fecha final  y  solicitante");
                arrayTemporal6 = [];
                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);
                let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (solicitante == array[index].usuario && departamento == this.departamentoFiltroVehiculo && fechaFin == fechaSolicitud && this.vehiculoFiltro == array[index].vehiculo) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.vehiculoFiltro != "" && this.modelFechaInicioVehiculo != null && this.solicitanteFiltroVehiculo != "") {
                // console.log("seleccionó sala fecha inicio  y  solicitante");
                arrayTemporal6 = [];

                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);
                let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (solicitante == array[index].usuario && departamento == this.departamentoFiltroVehiculo && fechaIncio == fechaSolicitud && this.vehiculoFiltro == array[index].vehiculo) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.vehiculoFiltro != "" && this.modelFechaInicioVehiculo != null && this.modelFechaFinalVehiculo != null) {
                // console.log("seleccionó sala, fecha incio y fecha final");
                arrayTemporal6 = [];
                let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && departamento == this.departamentoFiltroVehiculo && this.vehiculoFiltro == array[index].vehiculo) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;
              }
              if (this.vehiculoFiltro != null && this.modelFechaInicioVehiculo != null && this.modelFechaFinalVehiculo != null && this.solicitanteFiltroVehiculo != "") {
                // console.log("seleccionó sala, fecha incio y fecha final y solicitante");
                arrayTemporal6 = [];
                let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && departamento == this.departamentoFiltroVehiculo &&
                    this.vehiculoFiltro == array[index].vehiculo && array[index].usuario == solicitante) {
                    arrayTemporal6.push(array[index]);
                  }

                }
                arrayTemporal = arrayTemporal6;

              }
              if (this.modelFechaInicioVehiculo != null && this.modelFechaFinalVehiculo != null && this.solicitanteFiltroVehiculo != "") {
                // console.log("seleccionó fecha incio y fecha final y solicitante");
                arrayTemporal6 = [];

                let fechaIncio = ((this.modelFechaInicioVehiculo.year * 365) + (this.modelFechaInicioVehiculo.month * 30) + this.modelFechaInicioVehiculo.day);
                let fechaFin = ((this.modelFechaFinalVehiculo.year * 365) + (this.modelFechaFinalVehiculo.month * 30) + this.modelFechaFinalVehiculo.day);
                let solicitante = this.getIdUsuario(this.solicitanteFiltroVehiculo);

                for (let index = 0; index < array.length; index++) {
                  let departamento = this.getDepartamento(array[index].usuario);
                  let fechaSolicitud = ((array[index].fecha.year * 365) + (array[index].fecha.month * 30) + array[index].fecha.day);
                  if (fechaSolicitud >= fechaIncio && fechaSolicitud <= fechaFin && departamento == this.departamentoFiltroVehiculo &&
                    array[index].usuario == solicitante) {
                    arrayTemporal6.push(array[index]);
                  }
                }
                arrayTemporal = arrayTemporal6;
              }
            }
            this.solicitudesVehiculosFiltradas = arrayTemporal;

          }
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

  //cambia el tab de solicitar salas a lista de solitudes, según día seleccionado, y vicebersa, en el modal de solicitar sala
  solicitud(num: any) {
    if (num === 1) {
      this.reporteSala = true;
    } else {
      this.reporteSala = false;
    }
  }

  ordenarSolicitudesSala(filtro: string) {
    if (filtro === 'Horario') {
      this.ordenarPorHorario(this.solicitudesSalasFiltradas);
    }
    else if (filtro === 'Fecha') {
      this.ordenarPorFecha(this.solicitudesSalasFiltradas);
    }
    else if (filtro === 'Sala') {
      this.ordenarPorSala(this.solicitudesSalasFiltradas);
    }
    else if (filtro === 'Solicitante') {
      this.ordenarPorUsuario(this.solicitudesSalasFiltradas);
    } else if (filtro === 'Motivo') {
      this.ordenarPorMotivo(this.solicitudesSalasFiltradas);
    }

  }

  ordenarSolicitudesVehiculo(filtro: string) {
    if (filtro === 'Horario') {
     // this.ordenarPorHorarioVehiculo(this.solicitudesVehiculosFiltradas);
     //No
    }
    else if (filtro === 'Placa') {
      this.ordenarPorPlaca(this.solicitudesVehiculosFiltradas);
    } else if (filtro === 'Fecha') {
       this.ordenarPorFecha(this.solicitudesVehiculosFiltradas);
    }
    else if (filtro === 'Destino') {
      this.ordenarPorDestino(this.solicitudesVehiculosFiltradas);
    }
    else if (filtro === 'Solicitante') {
     this.ordenarPorUsuario(this.solicitudesVehiculosFiltradas);
    } 
    else if (filtro === 'Tipo') {
      //NO
    }
    else if (filtro === 'Marca') {
      // NO
    }
  }

  ordenarPorHorario(array: any) {
    let k = [];
    for (let i = 1; i < array.length; i++) {
      for (var j = 0; j < (array.length - i); j++) {
        if (array[j].horaInicio.hour > array[j + 1].horaInicio.hour) {
          k = array[j + 1];
          array[j + 1] = array[j];
          array[j] = k;
        }
      }
    }
    return array;
  }
  ordenarPorSala(array: any) {
    array.sort(function (a, b) {
      var keyA = a.sala,
        keyB = b.sala;
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    return array;
  }

  ordenarPorUsuario(array: any) {
    array.sort(function (a, b) {
      var keyA = a.usuario,
        keyB = b.usuario;
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    return array;
  }

  ordenarPorMotivo(array: any) {
    array.sort(function (a, b) {
      var keyA = a.descripcion,
        keyB = b.descripcion;
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    return array;
  }

  ordenarPorFecha(array: any) {
    let k = [];
    for (let i = 1; i < array.length; i++) {
      for (var j = 0; j < (array.length - i); j++) {
        if ((array[j].fecha.year + (array[j].fecha.month * 30) + array[j].fecha.day) < (array[j + 1].fecha.year + (array[j + 1].fecha.month * 30) + array[j + 1].fecha.day)) {
          k = array[j + 1];
          array[j + 1] = array[j];
          array[j] = k;
        }
      }
    }
    return array;
  }
  ordenarPorPlaca(array: any) {
    array.sort(function (a, b) {
      var keyA = a.vehiculo,
        keyB = b.vehiculo;
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    return array;
  }
  ordenarPorHorarioVehiculo(array:any){
    let k = [];
    for (let i = 1; i < array.length; i++) {
      for (var j = 0; j < (array.length - i); j++) {
        if (array[j].horaSalida.hour > array[j + 1].horaSalida.hour) {
          k = array[j + 1];
          array[j + 1] = array[j];
          array[j] = k;
        }
      }
    }
    return array;
  }
  ordenarPorDestino(array:any){
    array.sort(function(a, b){
      var keyA = a.destino,
          keyB = b.destino;
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
      });
      return array;
    }

  /*horaFormato12Horas(horario){
    let meridianoInit;
    let meridianoFin;
    let meridNumIni;
    let meridNumFin;

    var p=horario.minute;
    var g=p.toString();
    console.log(g.length);
    if(g<2){
        horario.minute= '0'+horario.minute;
    }

    if (parseInt(horario.hour) < 12) {
      meridianoInit = "AM";
      meridNumIni = parseInt(horario.hour);
    } else if (parseInt(horario.hour) >= 12) {
      meridianoInit = "PM";
      meridNumIni = (parseInt(horario.hour) - 12);
    }
    if (parseInt(horario.hour) == 24) {
      meridianoFin = "AM";
      meridNumFin = (parseInt(horario.hour) - 12);
    }
    if (parseInt(horario.hour) > 12 && parseInt(horario.hour) < 24) {
      meridianoFin = "PM";
      meridNumFin = (parseInt(horario.hour) - 12);
    } else if (parseInt(horario.hour) < 12) {
      meridianoFin = "AM";
      meridNumFin = parseInt(horario.hour);
    }
    if (meridNumIni == 0) {
      meridNumIni = meridNumIni + 12;
    }
    return meridNumIni+':'+horario.minute+' '+ meridianoInit;
  }*/

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
