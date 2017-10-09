import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.Component.css']
})
export class PrincipalComponent implements OnInit {
  identity = true;
  mmostrar = false;

  constructor() { }
  mostrar() {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $('#exampleModal').removeClass('show');
    $('#exampleModal').css('display', 'none');
    this.mmostrar = true;
  }
  salir() {
    /*$(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $('#exampleModal').removeClass('show');
    $('#exampleModal').css('display', 'none');*/
  }
  ngOnInit() {
    $('body').append('<div class="modal-backdrop fade show" ></div>');
    $('body').addClass('modal-open');
    $('#exampleModal').addClass('show');
    $('#exampleModal').css('display', 'block');

    // $("head").append($("<link rel='stylesheet' href='./principal.Component.css' type='text/css' media='screen' />"))
    // this.identity = localStorage.getItem('identity');
    // alert('principal'+this.identity);

  }


}
