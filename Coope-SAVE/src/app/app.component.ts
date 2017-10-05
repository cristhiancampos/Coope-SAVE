import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Coope-SAVE';
  public isSolicitudSala;
  interval: any;
  slides = [
    { src: 'assets/img/image02.jpg' },
    { src: 'assets/img/image03.jpg' },
    { src: 'assets/img/image04.jpg' },
    { src: 'assets/img/image05.jpg' }
  ];
  constructor(private _router: Router) {
    this.isSolicitudSala = false;
  }

  principal() {
    // if ($('#mainSlider').hasClass('carousel')) {
    // } else {
    //   $('#main').append('<div id="mainSlider" class="carousel carousel-slider center" data-indicators="true" > <a class="carousel-item" href="/"><img src="assets/img/image03.jpg" ></a><a class="carousel-item" href="/" ><img src="assets/img/image02.jpg"></a><a class="carousel-item" href="/"><img src="assets/img/image04.jpg"></a><a class="carousel-item" href="/"><img src="assets/img/image05.jpg"></a> </div>');
    //   this.carouselInit('1');
    //   this.isSolicitudSala = false;
    // }
  }
  solicitarSala(solicitud: boolean) {
    // this.isSolicitudSala = solicitud;
    // this.carouselInit('3');
    // $('#mainSlider').remove('.carousel');
    // this._router.navigate(['/solicitudSala']);

  }
  // método que realiza una acción después de haberse cargado el componente
  ngOnInit() {
    this.isSolicitudSala = false;
    // this.carouselInit('1');
  }

  // inicia el carousel de imagenes
  carouselInit(v: any) {

  //   // clearInterval(interval);
  //   if (v === '1') {
  //     $('.carousel.carousel-slider').carousel({ fullWidth: true });
  //     this.interval = setInterval(function () {
  //       $('.carousel.carousel-slider').carousel('next', 1);
  //     }, 4000);


  //   } else if (v === '2') {
  //     clearInterval(this.interval);
  //     this.carouselInit('1');
  //   } else if (v === '3') {
  //     clearInterval(this.interval);
  //   }

   }

}
