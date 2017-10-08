import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.Component.css']
})
export class PrincipalComponent implements OnInit {
  identity=true;
  
  constructor() { }

  ngOnInit() {

    // $("head").append($("<link rel='stylesheet' href='./principal.Component.css' type='text/css' media='screen' />"))
    //this.identity = localStorage.getItem('identity');
   // alert('principal'+this.identity);
    
  }


}
