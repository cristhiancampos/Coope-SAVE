import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, Pipe, PipeTransform } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportesComponent } from './reportes.component';
import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';
import {ImgBases64} from '../solicitud-vehiculo/imgBase64';

export class PDFReportes {

getLogo: ImgBases64 = new ImgBases64;
identity;
user;
hoy;

  constructor(
    private pdfmake: PdfmakeService,
   
  ) {
 
      this.identity = localStorage.getItem('identity');
     this.user = JSON.parse(this.identity);
      this.hoy= new Date();
  }


  horaFormato12Horas(horario) {
    let meridianoInit;
    let meridianoFin;
    let meridNumIni=0;
    let meridNumFin=0;

    console.log(horario);

    if (parseInt(horario.minute) < 10) {
      
      horario.minute = '0' + horario.minute;
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
    return meridNumIni + ':' + horario.minute + ' ' + meridianoInit;

  }



  //Traptor Tabla

  table(data, columns) {
    return {
      
      table: {

        widths: [15,80,90,50,60,'*'],
        headerRows: 1,
        body: this.buildTableBody(data, columns),
        layout: 'lightHorizontalLines',
      },
      layout: 'lightHorizontalLines'
    };
  }

  tableVehiculo(data, columns) {
    return {
      
      table: {
        alignment: 'center',
        widths: [15,55,45,60,75,70,'*'],
        headerRows: 1,
        body: this.buildTableBodyVehiculo(data, columns),
        layout: 'lightHorizontalLines',
      },
      layout: 'lightHorizontalLines'
    };
  }




  generateRows(listaSolicitudes) {

    console.log(listaSolicitudes);
    var tempObj = {}
    var tempArr = [];
    for (var i = 0; i < listaSolicitudes.length; i++) {

      tempArr.push(
        {
          sala: listaSolicitudes[i].sala,
          usuario: listaSolicitudes[i].usuario,
          fecha: listaSolicitudes[i].fecha.day + '-' + listaSolicitudes[i].fecha.month + '-' + listaSolicitudes[i].fecha.year,
          horario: this.horaFormato12Horas(listaSolicitudes[i].horaInicio) + ' - ' + this.horaFormato12Horas(listaSolicitudes[i].horaFin),
          motivo: listaSolicitudes[i].descripcion
        }
      );
    }

    return tempArr;

  }

  generateRowsVehiculo(listaSolicitudes) {
    
        console.log(listaSolicitudes);
        var tempObj = {}
        var tempArr = [];
        for (var i = 0; i < listaSolicitudes.length; i++) {
    
          tempArr.push(
            {
              placa: listaSolicitudes[i].placa,
              tipo: listaSolicitudes[i].tipo,
              marca: listaSolicitudes[i].marca,
              usuario: listaSolicitudes[i].usuario,
              fecha: listaSolicitudes[i].fecha,
              destino: listaSolicitudes[i].destino

            }
          );
        }
    
        return tempArr;
    
      }

  buildTableBody(data, columns) {
    var body = [];
    var i = 0;
    var numLinea=0;
    body.push(columns);


    data.forEach(function (row) {
      var linea= true;
      var dataRow = [];
      i = 0;
      numLinea++;
      columns.forEach(function (column) {

      if(linea){
        dataRow.push(numLinea)
        linea=false;
      }else{
        if (i < 1) {
          dataRow.push(row.sala);
          i++
        } else {
          if (i < 2) {
            dataRow.push(row.usuario);
            i++;
          } else {
            if (i < 3) {
              dataRow.push(row.fecha);
              i++;
            } else {
              if (i < 4) {
                dataRow.push(row.horario);
                i++;
              } else {
                dataRow.push(row.motivo);
                i++;
              }
            }
          }

        }
      }
    }
    )

      body.push(dataRow);
    });

    return body;
  }

  buildTableBodyVehiculo(data, columns) {
    var body = [];
    var i = 0;
    var numLinea=0;
    body.push(columns);


    data.forEach(function (row) {
      var linea= true;
      var dataRow = [];
      i = 0;
      numLinea++;
      columns.forEach(function (column) {

      if(linea){
        dataRow.push(numLinea)
        linea=false;
      }else{
        if (i < 1) {
          dataRow.push(row.placa);
          i++
        } else {
          if (i < 2) {
            dataRow.push(row.tipo);
            i++;
          } else {
            if (i < 3) {
              dataRow.push(row.marca);
              i++;
            } else {
              if (i < 4) {
                dataRow.push(row.usuario);
                i++;
              } else {
                if(i<5){
                  dataRow.push(row.fecha);
                  i++;
                }else {
                  dataRow.push(row.destino);
                  i++;
                }
                
              }
            }
          }

        }
      }
    }
    )

      body.push(dataRow);
    });

    return body;
  }

  generarPDF(solicitudesSalasFiltradas, accion) {



    this.pdfmake.docDefinition = {

      content: [


        {
          columns: [
            {
                image: ''+ this.getLogo.getImgLogo()+'',
                width: 50,
                height: 50,
              
            },
            {
                
               text: 'COOPESPARTA R.L', style: 'header',
        
            }
          ]
        },
      

        { text: 'Reporte de solicitud de salas', style: 'subheader' },


    
            { text:  'Fecha: '+this.hoy.getDate()+'/'+(this.hoy.getMonth()+1)+'/'+ this.hoy.getFullYear(), style: 'textos' },
            { text: 'Generado por: '+this.user.nombre+' '+ this.user.apellidos, style: 'textos' },
        
        
        //Tabla de solicitudes filtradas
        
          this.table(this.generateRows(solicitudesSalasFiltradas), ['#','SALA', 'SOLICITANTE', ' FECHA', 'HORARIO', 'MOTIVO']),
        
        

        {text: 'Sistema de control de Salas y Vehículos  SAVE', style: 'footer'},
        




      ], styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [120, 0, 0, 20]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [150, 0, 0, 20]
        },
        tabla: {
          margin: [0, 5, 0, 15]
        },
        textos: {
          bold: true,
          alignment: 'right',
          fontSize: 14,
          margin: [0,0,15,0]
        },
        footer:{
          width: '100%',
          height: '100%',
          alignment: 'center',
          margin: [0, 30, 0,0],
          fontSize: 16,
          bold: true

        } 

      }




    }//Final de definicion de PDF

    if(accion<1){
      this.pdfmake.download();
    }else{
      if(accion<2){
        this.pdfmake.print();
      }
      else{
          if(accion<3){
            this.pdfmake.open();
          }
      }
    }
  }//Final del metodo generarPDF()

  generarPDFVehiculo(solicitudesSalasFiltradas, accion) {
    
    console.log(solicitudesSalasFiltradas);
    
        this.pdfmake.docDefinition = {
    
          content: [
    
    
            {
              columns: [
                {
                    image: ''+ this.getLogo.getImgLogo()+'',
                    width: 50,
                    height: 50,
                  
                },
                {
                    
                   text: 'COOPESPARTA R.L', style: 'header',
            
                }
              ]
            },
          
    
            { text: 'Reporte de solicitud de Vehículos', style: 'subheader' },
    
    
        
                { text:  'Fecha: '+this.hoy.getDate()+'/'+(this.hoy.getMonth()+1)+'/'+ this.hoy.getFullYear(), style: 'textos' },
                { text: 'Generado por: '+this.user.nombre+' '+ this.user.apellidos, style: 'textos' },
            
            
            //Tabla de solicitudes filtradas
            
              this.tableVehiculo(this.generateRowsVehiculo(solicitudesSalasFiltradas), ['#','PLACA', 'TIPO', ' MARCA', 'SOLICITANTE', 'FECHA', 'DESTINO']),
            
            
    
            {text: 'Sistema de control de Salas y Vehículos SAVE', style: 'footer'},
           
    
    
    
    
          ], styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [120, 0, 0, 20]
            },
            subheader: {
              fontSize: 16,
              bold: true,
              margin: [150, 0, 0, 20]
            },
            tabla: {
              margin: [0, 5, 0, 15]
            },
            textos: {
              bold: true,
              alignment: 'right',
              fontSize: 14,
              margin: [0,0,0,15]
            },
            footer:{
              width: '100%',
              height: '100%',
              alignment: 'center',
              margin: [0, 30, 0,0],
              fontSize: 16,
              bold: true
    
            } 
    
          }
    
    
    
    
        }//Final de definicion de PDF
    
        if(accion<1){
          this.pdfmake.download();
        }else{
          if(accion<2){
            this.pdfmake.print();
          }
          else{
              if(accion<3){
                this.pdfmake.open();
              }
          }
        }
      }//Final del metodo generarPDF()

}// Final de la Clase





