import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,
  getSeconds,getMinutes,getHours,getDate,getMonth,getYear,setSeconds,setMinutes,setHours,setDate,setMonth,setYear } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent} from 'angular-calendar';
import * as $ from 'jquery';
import { Usuario } from '../modelos/usuario';
import { SolicitudSala } from '../modelos/solicitudSala';
import { ServicioSala } from '../servicios/sala';
import { ServicioSolicitudSala } from '../servicios/solicitudSala';
import { ServicioRecursos } from '../servicios/recurso';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { ChangeDetectorRef, forwardRef, Input, OnInit } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl } from '@angular/forms'; 
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};  


@Component({
  selector: 'app-solicitud-vehiculo',
  templateUrl: './solicitud-vehiculo.component.html',
  styleUrls: ['./solicitud-vehiculo.component.css'],
  providers: [ServicioSolicitudSala,ServicioSala, ServicioRecursos]  
})
export class SolicitudVehiculoComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  view = 'month';
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Editar', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Eliminar', event);
      }
    }
  ];


  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [ ];
  locale: string = 'es';
  activeDayIsOpen = true;

  //*********************************************AGREGADOS***************************** */
  ngOnInit(){
    this.estiloBotones();
    console.log('cargó el calendario');
    this.obtenerSolicitudSalas();
  }
  solicitudSala: SolicitudSala;
  title;//
  start;//
  end;//
  salas = [];
  recursos = [];
  tempRecursos = [];
  currentDate;
  private solicSala = true;
  public solicitudesdia=[];

  @Input() placeholder: string;
  date: Date;
  dateStruct: NgbDateStruct;
  timeStruct: NgbTimeStruct;
  datePicker: any;

  private onChangeCallback: (date: Date) => void = () => { };

  constructor(
    private modal: NgbModal,
    private _servSala: ServicioSala,
    private _servRecurso: ServicioRecursos,
    private _servSolicitud: ServicioSolicitudSala,
    private cdr: ChangeDetectorRef
  ) {
    this.solicitudSala = new SolicitudSala('', '', '', null, null, null, '', '', '', null, '', '');
    this.obtenerRecursos();
    this.obtenerSalas();
    this.estiloBotones();
  }
  solicitud(num: any) {
    if (num === 1) {
      this.solicSala = true;
    } else {
      this.solicSala = false;
    }
  }
  
  estiloBotones(){
    $('#bnt-lista').css('background', '#0069d9');
    $('#bnt-solicitud').css('background', '#eee');

    $('#bnt-lista').click(function(){
      $('#bnt-lista').css('background', '#0069d9');
      $('#bnt-solicitud').css('background', '#eee');
    });

    $('#bnt-vehiculo').click(function(){
      $('#bnt-solicitud').css('background', '#0069d9');
      $('#bnt-lista').css('background', '#eee');
    });
  }

  // obtiene todas las solicitudes
  obtenerSolicitudSalas() {
    this._servSolicitud.obtenerTodasSolicitudes().subscribe(
      response => {
        if (response.message) {
          let listaSolicitudes=response.message;
          this.events=[];
         for (var index = 0; index < listaSolicitudes.length; index++) {
           this.addEvent(listaSolicitudes[index]);
         }  
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

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {
    this.solicitudSala.fecha=date;
    this.solicitudSala.horaInicio = { hour: 7, minute: 0 };
    this.solicitudSala.horaFin = { hour: 11, minute: 0 };
    this.activeDayIsOpen = false;
    this._servSolicitud.fechaActual().subscribe(
      response => {
        if (response.currentDate) {
          this.currentDate = response.currentDate;
          var momentDate = moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss');
          let serverDate = momentDate.toDate();

          if (date.getFullYear() < serverDate.getFullYear()) {
            this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual 1');
          } else if (((date.getMonth() + 1) < (serverDate.getMonth() + 1))) {
            this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual 2');
          } else if (((date.getMonth() + 1) == (serverDate.getMonth() + 1))) {
            if (date.getDate()+1 < serverDate.getDate()) {
              this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual 3'+date.getDate()+"---"+serverDate.getDate());
            } else {
             // alert('entra aqui 1');
             this.obtenerSolicitudes(date);
             // this.writeValue(date);
              //this.abrirModal('#modal-add-new-request');
             
            }
          } else {
          // alert('entra aqui 2');
          this.obtenerSolicitudes(date);
           //this.writeValue(date);
           // this.abrirModal('#modal-add-new-request');            
          }
        } else {
        }
      }, error => {
        var errorMensaje = <any>error;
        // if (errorMensaje != null) {
        //   var body = JSON.parse(error._body);
        // }
      }
   );

    // this.prueba(date);
    // console.log(this.solicitudesdia);
 

    // if (isSameMonth(date, this.viewDate)) {
    //   if (
    //     (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
    //     events.length === 0
    //   ) {
    //     this.activeDayIsOpen = false;
    //   } else {
    //     this.activeDayIsOpen = true;
    //     this.viewDate = date;
    //   }
    // }
  }
  obtenerSolicitudes(userDate) {
    let array;
     this.solicitudSala.fecha = userDate;
     this._servSolicitud.obtenerSolicitudes(this.solicitudSala).subscribe(
       response => {
         if (!response.message) {         
          // alert('no hay registros');
         } else {//no hay Salas registradas
           //alert(' hay registros');
           //console.log('solicitudes salas');
            array = response.message;
           this.solicitudesdia=array;
           this.abrirModal('#modal-add-new-request');
           //console.log(array);
         }
       }, error => {
       // alert('erro');
       }
     );
   }
    //este método verificaque la fecha seleccionada sea mayor o igual a la fecha del servidor, para poder realizar la solicitud correctamente.
    verificarFechaSeleccionada(userDate: Date) {
      this._servSolicitud.fechaActual().subscribe(
        response => {
          if (response.currentDate) {
            this.currentDate = response.currentDate;
            var momentDate = moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss');
            let serverDate = momentDate.toDate();
  
            if (userDate.getFullYear() < serverDate.getFullYear()) {
              this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual');
            } else if (((userDate.getMonth() + 1) < (serverDate.getMonth() + 1))) {
              this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual');
            } else if (((userDate.getMonth() + 1) == (serverDate.getMonth() + 1))) {
              if (userDate.getDate() < serverDate.getDate()) {
                this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual');
              } else {
               // alert('entra aqui 1');
                //this.obtenerRecursos();

                 //this.abrirModal('#modal-add-new-request');
               
                 this.writeValue(userDate);
                 this.obtenerSolicitudes(userDate);
               
              }
            } else {
             //alert('entra aqui 2');

             this.writeValue(userDate);
             this.obtenerSolicitudes(userDate);
            //   //this.obtenerRecursos();
            //  this.obtenerSolicitudes(userDate);
            //   this.writeValue(userDate);
              
            }
          } else {
          }
        }, error => {
          var errorMensaje = <any>error;
          if (errorMensaje != null) {
            var body = JSON.parse(error._body);
          }
        }
      );
  
    }

  eventTimesChanged({
    event,
    newStart,
    newEnd

  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;

    this.solicitudSala.horaInicio = event.start;//
    this.solicitudSala.horaFin = event.end;//

    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(solicitud): void {
    let fechaInicio = new Date();
    fechaInicio.setFullYear(solicitud.fecha.year);
    fechaInicio.setMonth(solicitud.fecha.month-1);
    fechaInicio.setDate(solicitud.fecha.day);
    //fechaInicio.setHours(solicitud.horaInicio.hour);
    //fechaInicio.setMinutes(solicitud.horaInicio.minute);
    this.events.push({
      title: solicitud.descripcion,
      start: startOfDay(fechaInicio),
      end: endOfDay(fechaInicio),
      color: colors.yellow,
      actions: this.actions,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
   this.activeDayIsOpen=false;
    this.refresh.next();
  }

  ///***************************************************METODOS AGREGADOS***********************************
  obtenerSalas() {
    this._servSala.obtenerSalasHabilitadas().subscribe(
      response => {
        if (response.message) {
          this.salas = response.message;
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

  obtenerRecursos() {
    this._servRecurso.obtenerRecursosHabilitados().subscribe(
      response => {
        if (response.message) {
          this.recursos = response.message;
          console.log('recursos hábiles');
          console.log(this.recursos);
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

  agregarSolicitud() {
    var minInicial=((this.solicitudSala.horaInicio.hour*60)+this.solicitudSala.horaInicio.minute);
    var minFinal=((this.solicitudSala.horaFin.hour*60)+this.solicitudSala.horaFin.minute);
    if (minFinal-minInicial<=0) {
      //alert('no puede agregar');
   }else {
     if(minFinal-minInicial>0 && minFinal-minInicial<30){
     // alert('no puede agregar 2');
     }
    else{
    //alert('puede agregar');
      let identity = localStorage.getItem('identity');
      let user = JSON.parse(identity);
      let recordar = localStorage.getItem('remember');
      let recordarValue = JSON.parse(recordar);
      let recursos = JSON.parse(identity);
      if (user != null) {
        this.solicitudSala.fecha = this.dateStruct;
        this.solicitudSala.usuario = user._id;
        this.solicitudSala.recursos = this.tempRecursos;
        this._servSolicitud.registrarSolicitud(this.solicitudSala).subscribe(
          response => {
            if (!response.message._id) {
              this.msjError(response.message);
            } else {
              this.msjExitoso("Solicitud Agregada Exitosamente");
              this.solicitudSala = new SolicitudSala('', '', '', null, null, null, '', '', '', null, '', '');
              this.obtenerSolicitudSalas();
              this.cerrarModal('#modal-add-new-request');
              // this.obtenerSalas();
            }
          }, error => {
            var alertMessage = <any>error;
            if (alertMessage != null) {
              var body = JSON.parse(error._body);
              this.msjError('Solicitud no registrada r');
            }
          }
        );
      } else {
        this.msjError('Debe validar sus credenciales');
      }

   }

    }

  }
  cerrarModal(modalId: any) {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $(modalId).removeClass('show');
    $(modalId).css('display', 'none');
    this.solicSala=true;
  }

  abrirModal(modalId: any) {
    $('body').append('<div class="modal-backdrop fade show" ></div>');
    $('body').addClass('modal-open');
    $(modalId).addClass('show');
    $(modalId).css('display', 'block');
  }

  msjExitoso(texto: string) {
    swal({
      position: 'top',
      type: 'success',
      title: texto,
      showConfirmButton: false,
      timer: 2500
    })
  }

  msjError(texto: string) {
    swal(
      'Oops...',
      texto,
      'error'
    )
  }
  msInfo(texto: String) {
    swal({
      title: '',
      type: 'info',
      html: texto + '',
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'OK'
    })
  }

  changeRecursos(event: any, _id: any) {
    if (event.target.checked) {
      this.tempRecursos.push(_id);
    } else {
      this.tempRecursos = this.tempRecursos.filter(item => item !== _id);
    }
  }

  ///////////////////////////////////////////////////TIMPE PICKER///////////////////////////////////////////////////////////////////
  writeValue(date: Date): void {
    this.date = date;
    this.dateStruct = {
      day: getDate(date),
      month: getMonth(date) + 1,
      year: getYear(date)
    };
    this.timeStruct = {
      second: getSeconds(date),
      minute: getMinutes(date),
      hour: getHours(date)
    };
    this.cdr.detectChanges();
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void { }



  // validar el dataPicker de hora de inicio en el modal de agregar solicitudes
  ctrlInitDate = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour < 12) {
      return { tooEarly: true };
    }
    if (value.hour > 13) {
      return { tooLate: true };
    }

    return null;
  });
  // validar el dataPicker de hora de fin en el modal de agregar solicitudes
  ctrlFinishDate = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour < 12) {
      return { tooEarly: true };
    }
    if (value.hour > 13) {
      return { tooLate: true };
    }
    return null;
  });


  //actualiza la hora de inicio al escribir
  updateInitDateOnInput(): void {

    //     console.log('value');
    //     console.log(this.solicitudSala.horaInicio.hour=='');
    // else{

    // }    

    // if (this.solicitudSala.horaInicio == null || this.solicitudSala.horaInicio == undefined) {
    //   this.solicitudSala.horaInicio = { hour: 0, minute: 0 };
    // } else {

    //   if (!parseInt(this.solicitudSala.horaInicio.hour) ) {
    //     console.log('fomato de hora incorrecto'+this.solicitudSala.horaInicio.hour);

    //   // } else if (isNaN(parseInt(this.solicitudSala.horaInicio.minute))) {
    //   //   console.log('fomato de minuto incorrecto');
    //   }
    //   else {
    //     console.log('hora inicio' + this.solicitudSala.horaInicio);
    //   }
    // }

  }

  updateFinishDateOnInput(): void {

    // if (this.solicitudSala.horaFin == null || this.solicitudSala.horaFin == undefined) {
    //   // alert('la fecha de fin no tiene  formato correcto');
    //   this.solicitudSala.horaFin = { hour: 0, minute: 0 };
    // } else {
    //   //alert('hora inicio'+this.solicitudSala.horaFin);
    // }
  }

  updateDate(): void {
    const newDate: Date = setYear(
      setMonth(
        setDate(this.date, this.dateStruct.day),
        this.dateStruct.month - 1
      ),
      this.dateStruct.year
    );
    this.onChangeCallback(newDate);
    //alert(newDate);
    // this._servSolicitud.fechaActual().subscribe(
    //   response => {
    //     if (response.currentDate) {
    //       this.currentDate = response.currentDate;
    //       //fecha parseada del servidor
    //       var momentDate = moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss');
    //       let serverDate = momentDate.toDate();

    //       if (this.date.getFullYear() < serverDate.getFullYear()
    //         || ((this.date.getMonth() + 1) < (serverDate.getMonth() + 1))
    //         || this.date.getDate() < serverDate.getDate()) {
    //         this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual');
    //       } else {
    //         // this.solicitudSala.horaInicio = serverDate;//
    //         // this.solicitudSala.horaFin = new Date();//
    //         // this.solicitudSala.fecha ;
    //         this.writeValue(this.date);
    //       }
    //     } else {//error
    //     }
    //   }, error => {
    //     var errorMensaje = <any>error;
    //     if (errorMensaje != null) {
    //       var body = JSON.parse(error._body);
    //     }
    //   }
    // );


  }

  updateTime(): void {



    // var intevarlo = 30;
    // var hora = 60;

    // if (this.solicitudSala.horaInicio.hour == this.solicitudSala.horaFin.hour) {

    //   if(this.solicitudSala.horaInicio.minute > this.solicitudSala.horaFin.minute){
    //     this.solicitudSala.horaFin.minute=this.solicitudSala.horaFin.minute-(-this.solicitudSala.horaFin.minute-intevarlo);
    //     var restaMin = this.solicitudSala.horaInicio.minute - this.solicitudSala.horaFin.minute;
    //   }

    // else{
    //   restaMin = this.solicitudSala.horaInicio.minute - this.solicitudSala.horaFin.minute;
    //   alert('hora es igual'+restaMin);

    //   if (restaMin==0)
    //   {
    //     alert('hora y minuto exactamente iguales');
    //     this.solicitudSala.horaFin.minute=this.solicitudSala.horaFin.minute+intevarlo;
    //     var resultado =this.solicitudSala.horaFin.minute;

    //     if(resultado==hora){
    //       this.solicitudSala.horaFin.hour=this.solicitudSala.horaFin.hour+1;
    //     } else  if(resultado>hora){
    //       this.solicitudSala.horaFin.hour=this.solicitudSala.horaFin.hour+1;
    //       this.solicitudSala.horaFin.minute= resultado-hora;
    //     }else{
    //       this.solicitudSala.horaFin.minute= resultado;
    //     }
    //   }
    //   else if(restaMin<0)
    //     {
    //       var sumaMin = this.solicitudSala.horaFin.minute-(restaMin);
    //       alert('hora es igual pero minutos no'+sumaMin +'..'+restaMin);
    //       if(sumaMin>=hora){
    //         this.solicitudSala.horaFin.hour=this.solicitudSala.horaFin.hour+1;
    //         this.solicitudSala.horaFin.minute=sumaMin-hora;
    //       }else{
    //         this.solicitudSala.horaFin.minute=sumaMin;
    //       }
    //     } else if(restaMin>0){
    //       this.solicitudSala.horaFin.minute=this.solicitudSala.horaFin.minute+intevarlo;
    //     }
    //   }
    //  }
    // else if(this.solicitudSala.horaInicio.hour < this.solicitudSala.horaFin.hour){
    //   alert('validar minutos');
    // }
    // else if(this.solicitudSala.horaInicio.hour > this.solicitudSala.horaFin.hour){
    //   alert('validar minutos y sumar hora');
    // }
    //sigue validadr más

    //  alert('hora inicio' + this.solicitudSala.horaInicio.hour+':'+this.solicitudSala.horaInicio.minute +
    //   "\n" + 'hora fin' + this.solicitudSala.horaFin.hour +':'+this.solicitudSala.horaFin.minute);
    // if (this.solicitudSala.horaInicio.hour == this.solicitudSala.horaFin.hour) {
    //   var resultadoRestaMinutos = (this.solicitudSala.horaInicio.minute - this.solicitudSala.horaFin.minute);
    //  alert(resultadoRestaMinutos);
    //   if (resultadoRestaMinutos < 0) {
    //     var sumaHoras = (this.solicitudSala.horaFin.minute + intevarlo);
    //     alert('sumar'+sumaHoras);
    //     if (sumaHoras > 60) {
    //      // this.solicitudSala.horaFin=(this.solicitudSala.horaFin+1);
    //       var minRestantes=(sumaHoras-60);
    //       alert('minutos restantes'+(minRestantes));
    //       alert('sumar a horas y a minutos tambi');

    //       this.solicitudSala.horaFin.hour=(this.solicitudSala.horaFin.hour+1);
    //       this.solicitudSala.horaFin.minute=minRestantes;
    //      // alert('validar intervalo');
    //     }else if(sumaHoras = 60){
    //       alert('sumarle solo 1 hora');
    //       this.solicitudSala.horaFin.hour=(this.solicitudSala.horaFin.hour+1);
    //     }
    //   } else if(resultadoRestaMinutos == 0){
    //     this.solicitudSala.horaFin.minute=(this.solicitudSala.horaFin.minute+intevarlo);
    //     alert('los minutos son iguales');
    //   }else{
    //     alert('todo bien');
    //   }

    // } else if (this.solicitudSala.horaInicio.hour > this.solicitudSala.horaFin.hour) {
    //   alert('no puede ser menor la hora final');
    // }
    // else {
    //   alert('son diferentes');
    // }
    // alert('hoa final'+this.solicitudSala.horaFin.hour+':'+this.solicitudSala.horaFin.minute);

    //this.timeStruct.minute=30;
    const newDate: Date = setHours(
      setMinutes(
        setSeconds(this.date, this.timeStruct.second),
        this.solicitudSala.horaFin.minute
      ),
      this.solicitudSala.horaFin.hour
    );
    console.log(newDate);
    this.onChangeCallback(newDate);
  }
}