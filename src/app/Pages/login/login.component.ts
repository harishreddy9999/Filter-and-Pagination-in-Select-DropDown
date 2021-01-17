import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mdlCountryList, Countries } from '../../Model/mdlCountryList';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public UserName: string = "";
  public FormSubmitted: boolean;
  constructor(private router: Router){

  }
  ngOnInit(): void {
  }

  continuous(valid){
    this.FormSubmitted = true;
    if(!valid){
      return;
    }
    sessionStorage.setItem("UserType", this.UserName);
    this.router.navigate(['/Dashboard']);
  }



}
