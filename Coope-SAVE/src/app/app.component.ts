import {OnDestroy, Component, Input, ElementRef, HostBinding, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any,jQuery: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements   OnDestroy {

  title = 'Coope-SAVE';
  public isSolicitudSala;
  interval: any;
  @HostBinding('class.owl-carousel') owlClass = true;
  $owl: any;
  @Input() options: any = {};
  // slides = [
  //   { src: 'assets/img/image02.jpg' },
  //   { src: 'assets/img/image03.jpg' },
  //   { src: 'assets/img/image04.jpg' },
  //   { src: 'assets/img/image05.jpg' }
  // ];

  constructor(private _router: Router,private el: ElementRef) {
    this.isSolicitudSala = false;
    $ = $ || jQuery;
    
  }
  ngAfterViewInit() {
    // if($) {
    //   $('#carrusell').carousel();
    //     this.$owl = $(this.el.nativeElement).owlCarousel(this.options);
    // }
}
trigger(action: string, options?: any[]) {
 // this.$owl.trigger(action, options)
}

ngOnDestroy() {
  // this.$owl.trigger('destroy.owl.carousel').removeClass('owl-loaded');
  // delete this.$owl;
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
   // $('#carrusel').carousel();
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
