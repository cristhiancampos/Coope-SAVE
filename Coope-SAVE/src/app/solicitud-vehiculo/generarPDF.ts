import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, Pipe, PipeTransform } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {SolicitudVehiculoComponent} from './solicitud-vehiculo.component';
import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';
import { ImgBases64 } from './imgBase64';

export class GenerarPDF {
   
componenteVehiculi: SolicitudVehiculoComponent;
imgUrl: ImgBases64;
i=0;

    
constructor(
    private pdfmake: PdfmakeService
    

  ) {
      this.imgUrl= new ImgBases64();
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

  


  generarPDF(solicitudAgregada) {
       

        
       
        

        //var docDefinition = 
        let acompanantes = '';
        for (var index = 0; index < solicitudAgregada.acompanantes.length; index++) {
            
            if(index==0){
                acompanantes= solicitudAgregada.acompanantes[index].nombre + ' ' + solicitudAgregada.acompanantes[index].apellidos
            } else {
                acompanantes += '  /  '+solicitudAgregada.acompanantes[index].nombre + ' ' + solicitudAgregada.acompanantes[index].apellidos;
        }
        }

        this.pdfmake.docDefinition = {
    
          content: [
    
            { text: 'COOPESPARTA R.L', style: 'header' },
            { text: 'Traslado y uso de Vehículos', style: 'subheader' },
    
            {
              style: 'placa',
              alignment: 'left',
              columns: [
                {
                  width: 125,
                  text: 'Placa:'
                },
                {
                  text: '' + solicitudAgregada.vehiculo + ''
                },
                {
                  text: 'Fecha:'
                },
                {
                  text: '' + solicitudAgregada.fecha.day + '/' + solicitudAgregada.fecha.month + '/' + solicitudAgregada.fecha.year + ''
                }
              ]
            },
            
            {
              style: 'placa',
              alignment: 'left',
              columns: [
                {
                  width: 125,
                  text: 'Hora Salida:'
                },
                {
                    
                  text: '' +this.horaFormato12Horas(solicitudAgregada.horaSalida)+''
                },
                {
                  text: 'Hora Regreso:'
                },
                {
                  
                  text: '' +  this.horaFormato12Horas(solicitudAgregada.horaRegreso) + ''
                }
              ]
            },
            {
              style: 'datos',
              alignment: 'left',
              columns: [
                {
                  width: 125,
                  text: 'Motivo de la Gira:'
                },
                {
                  text: '' + solicitudAgregada.descripcion + ''
                }
              ]
            },
            {
              style: 'datos',
              alignment: 'left',
              columns: [
                {
                  width: 125,
                  text: 'Destino:'
                },
                {
                  text: '' + solicitudAgregada.destino + ''
                }
              ]
            },
            {
              style: 'datos',
              alignment: 'left',
              columns: [
                {
                  width: 125,
                  text: 'Acompañantes:'
                },
                {
                  text: '' + acompanantes + ''
                }
              ]
            },
            {
              style: 'placa',
              alignment: 'left',
              columns: [
                {
                  width: 125,
                  text: 'Encargado:'
                },
                {
                  text: '' + solicitudAgregada.usuario + ''
                },
                {
                  width: 40,
                  text: 'Firma:'
                },
                {
                  text: '______________________________'
                }
              ]
            },//Aqi se repite abajo 
            { text: 'Entrega del Vehículo', style: 'header2' },
    
            {
              style: 'entrega',
              alignment: 'left',
              columns: [
                {
                  width: 50,
                  text: 'Fecha:'
                },
                {
                  text: '______________________________'
                },
                {
                  width: 50,
                  text: 'Hora:'
                },
                {
                  text: '______________________________'
                }
              ]
            },
            {
              style: 'entrega',
              alignment: 'left',
              columns: [
                {
                  width: 100,
                  text: 'Entregado por:'
                },
                {
                  text: '______________________________'
                },
                {
                  width: 50,
                  text: 'Firma:'
                },
                {
                  text: '______________________________'
                }
              ]
            },
            {
              style: 'entrega',
              alignment: 'left',
              columns: [
                {
                  width: 90,
                  text: 'Recivido por:'
                },
                {
                  text: '______________________________'
                },
                {
                  width: 50,
                  text: 'Firma:'
                },
                {
                  text: '______________________________'
                }
              ]
            },
            {
              style: 'entrega',
              alignment: 'left',
              columns: [
                {
                  width: 80,
                  text: 'Kilometraje:'
                },
                {
                  text: '______________________________'
                },
                {
                  width: 80,
                  text: 'Combustible:'
                },
                {
                  style: 'tablaCombustible',
                  table: {
                    body: [
                      ['1/4', '1/2', '3/4', 'lleno'],
    
                    ]
                  }
                }
              ]
            },
            {
              style: 'titulo3',
              text: 'Estado del Vehiculo al momento de la entrega'
            },
    
            {
              style: 'herramientas',
              columns: [
    
                {
    
                
                 image: ''+ this.imgUrl.getImgBase64()+'',
                    width: 260,
                    height: 250
                },
                [
    
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Radio FM/AM:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Repuestos:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Gata:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Llave Rana:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Maletin:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Linterna de Mano:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: '2 Destornilladores:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: '1 Alicate:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Extintor:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Chaleco:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Triángulo:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Lagartos:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  [
                    {
                      style: 'indice',
                      text: 'Indice'
                    },
                    [
                      {
                        columns: [
                          {
                            width: 55,
                            text: 'Rayón:'
                          },
                          {
                            text: '.....'
                          },
                          {
                            width: 55,
                            text: 'Golpe:'
                          },
                          {
                            text: 'Ø'
                          },
                        ]
                      }
                    ],
                    [
                      {
                        columns: [
                          {
                            width: 70,
                            text: 'Raspadura:'
                          },
                          {
                            text: 'X'
                          },
                          {
                            width: 70,
                            text: 'Abolladura:'
                          },
                          {
                            text: 'O'
                          }
                        ]
                      },
                    ]
    
                  ],
                ]
    
              ]
            },
            { text: 'Recección del Vehículo', style: 'header2' },
    
            {
              style: 'entrega',
              alignment: 'left',
              columns: [
                {
                  width: 50,
                  text: 'Fecha:'
                },
                {
                  text: '______________________________'
                },
                {
                  width: 50,
                  text: 'Hora:'
                },
                {
                  text: '______________________________'
                }
              ]
            },
            {
              style: 'entrega',
              alignment: 'left',
              columns: [
                {
                  width: 100,
                  text: 'Entregado por:'
                },
                {
                  text: '______________________________'
                },
                {
                  width: 50,
                  text: 'Firma:'
                },
                {
                  text: '______________________________'
                }
              ]
            },
            {
              style: 'entrega',
              alignment: 'left',
              columns: [
                {
                  width: 90,
                  text: 'Recivido por:'
                },
                {
                  text: '______________________________'
                },
                {
                  width: 50,
                  text: 'Firma:'
                },
                {
                  text: '______________________________'
                }
              ]
            },
            {
              style: 'entrega',
              alignment: 'left',
              columns: [
                {
                  width: 80,
                  text: 'Kilometraje:'
                },
                {
                  text: '______________________________'
                },
                {
                  width: 80,
                  text: 'Combustible:'
                },
                {
                  style: 'tablaCombustible',
                  table: {
                    body: [
                      ['1/4', '1/2', '3/4', 'lleno'],
    
                    ]
                  }
                }
              ]
            },
            {
              style: 'titulo3',
              text: 'Estado del Vehiculo al momento de la entrega'
            },
    
            {
              style: 'herramientas',
              columns: [
    
                {
    
                  image: ''+ this.imgUrl.getImgBase64()+'',
                  width: 260,
                  height: 250
                },
                [
    
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Radio FM/AM:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Repuestos:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Gata:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Llave Rana:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Maletin:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Linterna de Mano:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: '2 Destornilladores:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: '1 Alicate:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Extintor:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Chaleco:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Triángulo:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  {
                    style: 'espacioMarca',
                    alignment: 'left',
                    columns: [
                      {
                        width: 125,
                        text: 'Lagartos:'
                      },
                      {
                        text: '[         ]'
                      }
                    ]
    
                  },
                  [
                    {
                      style: 'indice',
                      text: 'Indice'
                    },
                    [
                      {
                        columns: [
                          {
                            width: 55,
                            text: 'Rayón:'
                          },
                          {
                            text: '.....'
                          },
                          {
                            width: 55,
                            text: 'Golpe:'
                          },
                          {
                            text: 'Ø'
                          },
                        ]
                      }
                    ],
                    [
                      {
                        columns: [
                          {
                            width: 70,
                            text: 'Raspadura:'
                          },
                          {
                            text: 'X'
                          },
                          {
                            width: 70,
                            text: 'Abolladura:'
                          },
                          {
                            text: 'O'
                          }
                        ]
                      },
                    ]
    
                  ],
                ]
    
              ]
            },
            {
              style: 'titulo5',
              text: 'Observaciones'
            },
            {
              width: '*',
              text: '_______________________________________________________________________________________________'
            },
            {
              width: '*',
              text: '_______________________________________________________________________________________________'
            },
            {
              width: '*',
              text: '_______________________________________________________________________________________________'
            },
            {
              width: '*',
              text: '_______________________________________________________________________________________________'
            },
            {
              width: '*',
              text: '_______________________________________________________________________________________________'
            },
            {
              width: '*',
              text: '_______________________________________________________________________________________________'
            },
            {
              style: 'titulo4',
              text: 'Nota: Es obligación de todo usuario revisar el vehículoantes de salir y al regresar, así como mantener el aseo del mismo'
            },
            {
                style: 'tableExample',
                table: {
                    
                    body: [
                        
                        function(){
                            for (var index = 0; index < 8; index++) {
                                var element = solicitudAgregada[index];
                                return ['row'+index+'', 'column'+index+''];
                            }
                        },

                        
                     
                    ]
                }
            }
    
          ], styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [180, 0, 0, 20]
            },
            subheader: {
              fontSize: 16,
              bold: true,
              margin: [153, 0, 0, 20]
            },
            placa: {
              fontSize: 12,
              bold: true,
              margin: [0, 10, 0, 10]
            },
            datos: {
              fontSize: 12,
              margin: [0, 5, 0, 10]
            },
            header2: {
              fontSize: 18,
              bold: true,
              margin: [180, 20, 0, 20]
            },
            entrega: {
              fontSize: 12,
              bold: true,
              margin: [0, 10, 0, 10]
            },
            titulo3: {
              fontSize: 14,
              bold: true,
              margin: [0, 15, 0, 0]
            },
            tablaCombustible: {
              margin: [0, -8, 0, 0]
            },
            herramientas: {
              margin: [0, 10, 0, 0]
            },
            espacioMarca: {
              fontSize: 12,
              margin: [60, 0, 0, 1]
            },
            indice: {
              margin: [0, 3, 0, 0]
            },
            titulo4: {
              fontSize: 14,
              bold: true,
              margin: [0, 80, 0, 0]
            },
            titulo5: {
              fontSize: 14,
              bold: true,
              margin: [0, 40, 0, 0]
            }
          }
        };
        this.pdfmake.open();
    
      }


}




