import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-registo-usuario',
  templateUrl: './registo-usuario.component.html',
  styleUrls: ['./registo-usuario.component.css']
})
export class RegistoUsuarioComponent implements OnInit {

  identity:any;
  mostrar;
  constructor(private _route: ActivatedRoute,
    private _router: Router, ) {

      localStorage.setItem('identity', JSON.stringify("false"));
      this.identity = localStorage.getItem('identity');
      this.mostrar = true;}
  ngOnInit() {
    //$('#exampleModal').hide();
  //   $('body').append('<div class="modal-backdrop fade show"></div>');
  //   $('body').addClass('modal-open');
  //   $('#exampleModal').addClass('show');
  //  $('#exampleModal').css('display','block');
    
  }

  closeModal()
  {
    
  }
  principal() {
    localStorage.setItem('identity', JSON.stringify("true"));
    //alert(localStorage.getItem('identity'));
    this.identity = localStorage.getItem('identity');
    console.log(this.identity);
    this.mostrar = false;
    this.identity =true;
    
   // alert(this.identity);
   // this._router.navigate(['/principal']);
  }
}
