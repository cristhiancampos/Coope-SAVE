import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, Pipe, PipeTransform } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportesComponent} from './reportes.component';
import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';



@Component({ 
    providers: [PdfmakeService],
  })
export class PDFReportes {
   



    
constructor(
    private pdfmake: PdfmakeService
  ) {
    
  }

  
  horaFormato12Horas(horario){
    let meridianoInit;
    let meridianoFin;
    let meridNumIni;
    let meridNumFin;
    console.log(horario);
    if(parseInt(horario.minute) < 10){
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
  }

  

  //Traptor Tabla

  generateRows(listaSolicitudes){

    console.log('Metodo para crear objeto');
    var tempObj = {}
    var tempArr = [];
    for(var i=0; i<listaSolicitudes.length; i++){
    
       tempArr.push(
         { 
           sala: listaSolicitudes[i].sala, 
           usuario: listaSolicitudes[i].usuario,
           fecha: listaSolicitudes[i].fecha.year,
           horario: listaSolicitudes[i].horaInicio.hour,
           motivo: listaSolicitudes[i].descripcion
          }
      );
    }
    console.log('temArr');
    console.log(tempArr);
    return tempArr;
   
    }

    buildTableBody(data, columns) {
        var body = [];
    
        body.push(columns);
    
        data.forEach(function(row) {
            var dataRow = [];
    
            columns.forEach(function(column) {
                dataRow.push(row[column]);
            })
    
            body.push(dataRow);
        });
    
        return body;
    }

    table(data, columns) {
        return {
          table: {
            headerRows: 1,
            body: this.buildTableBody(data, columns)
          }
        };
      }






  generarPDF(solicitudesSalasFiltradas) {

    this.generateRows(solicitudesSalasFiltradas);
    console.log('llama el metodo en PDFReportes');
    console.log(solicitudesSalasFiltradas);

        this.pdfmake.docDefinition = {
    
            content: [
                { text: 'COOPESPARTA R.L', style: 'header' },
                {text: 'Reporte de "Inserte Sala" para "Inserte Usuario" en las fechas "Inserte Fecha"', style: 'subheader'},

                //Tabla de solicitudes filtradas
                this.table(this.generateRows(solicitudesSalasFiltradas), ['SALA', 'SOLICITANTE',' FECHA', 'HORARIO', 'MOTIVO']),
                





                {text: 'Tabla de Solicitudes filtradas:'},
                {
                    style: 'tabla',
                    table: {
                        headerRows: 1,
                        body: [
                            [{text: 'Sala', style: 'tableHeader'}, {text: 'Solicitante', style: 'tableHeader'}, {text: 'Fecha', style: 'tableHeader'}, {text: 'Motivo', style: 'tableHeader'}],
                            ['Sample value 1', 'Sample value 2', 'Sample value 3', 'Sample value 3'],
                            ['Sample value 1', 'Sample value 2', 'Sample value 3', 'Sample value 3'],
                            ['Sample value 1', 'Sample value 2', 'Sample value 3', 'Sample value 3'],
                            ['Sample value 1', 'Sample value 2', 'Sample value 3', 'Sample value 3'],
                            ['Sample value 1', 'Sample value 2', 'Sample value 3', 'Sample value 3'],
                            
                        ]
                    },
                    layout: 'headerLineOnly'
                },


            ],styles: {
                header: {
                  fontSize: 18,
                  bold: true,
                  margin: [180, 0, 0, 20]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [20, 0, 0, 20]
                  },
                  tabla:{
                    margin: [0, 5, 0, 15]
                  },
            }


           

        }//Final de definicion de PDF
    
        this.pdfmake.open();
    }//Final del metodo generarPDF()

}// Final de la Clase



