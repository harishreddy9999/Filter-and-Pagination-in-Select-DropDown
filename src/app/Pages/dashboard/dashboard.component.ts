import { Component, OnInit } from '@angular/core';
import { Countries, mdlCountryList, mdlAddCountryReq } from '../../Model/mdlCountryList';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public SearchCountry: string;
  public pageNumber: number;
  public CountriesData: mdlCountryList = new mdlCountryList();
  public SortedCountries: Array<Countries> = new Array<Countries>();
  public FilteredCountries: Array<Countries> = new Array<Countries>();
  public ShowLoading: boolean;
  public UserType: string;
  constructor(private http: HttpClient,private router: Router) { 
    this.UserType = sessionStorage.getItem("UserType")
    this.GetCountries();
  }

  ngOnInit(): void {
  }

  ShowSponsors() {
    this.SearchCountry = "";
    document.getElementById("SponsorDropdown").classList.toggle("show");
    this.GetCountries();
  }
  filterSponsor() {
    //console.log(this.SearchCountry);
    this.FilteredCountries = [];
    for(var i=0;i<this.CountriesData.CountryData.length;i++){
      if(this.CountriesData.CountryData[i].CountryName.indexOf(this.SearchCountry)>-1){
        let optioncountries: Countries = new Countries();
        if(this.CountriesData.CountryData[i].CountryName!=null && this.CountriesData.CountryData[i].CountryName!=undefined){
          optioncountries.CountryName = this.CountriesData.CountryData[i].CountryName;
          optioncountries.IDNo = this.CountriesData.CountryData[i].IDNo;
          this.FilteredCountries.push(optioncountries);
        }
      }
    }
    //console.log(this.FilteredCountries);
    if(this.FilteredCountries.length>5){
      this.ShowAddMore = true;
    }else{
      this.ShowAddMore = false;
    }
    this.pageNumber = 1;
    if(this.FilteredCountries.length % 5 ==0){
      this.MaxPageNumber = this.FilteredCountries.length/5;
    }else{
      this.MaxPageNumber = Math.floor(this.FilteredCountries.length/5)+1;
    }
    this.GetRecords();
    
  }

  SelectedCountry(value){
    //console.log(value);
    document.getElementById("sponsorvalue").innerHTML = value;
    document.getElementById("SponsorDropdown").style.display = "none";
    document.getElementById("SponsorDropdown").classList.remove('show');
  }
  public RecordsPerPage: number = 5;
  public ShowAddMore: boolean = true;
  public ShowNotFound: boolean;
  public ShowAddBtn: boolean;
  public MaxPageNumber: number;
  GetCountries(){
    this.ShowLoading = true;
    this.http.get<mdlCountryList>("http://localhost:57940/api/Values/GETCOUNTRYLIST").toPromise().
    then((result) => {
      ////console.log(result);
      this.ShowLoading = false;
      this.CountriesData = result;
      if(this.CountriesData.StatusCode=="S"){
        this.pageNumber = 1;
        this.FilteredCountries = [];
        for(var i=0;i<this.CountriesData.CountryData.length;i++){
          let optioncountries: Countries = new Countries();
          if(this.CountriesData.CountryData[i].CountryName!=null && this.CountriesData.CountryData[i].CountryName!=undefined){
            optioncountries.CountryName = this.CountriesData.CountryData[i].CountryName;
            optioncountries.IDNo = this.CountriesData.CountryData[i].IDNo;
            this.FilteredCountries.push(optioncountries);
          }
          
        }
        //console.log(this.FilteredCountries);
        this.GetRecords();
        if(this.FilteredCountries.length % 5 ==0){
          this.MaxPageNumber = this.FilteredCountries.length/5;
        }else{
          this.MaxPageNumber = Math.floor(this.FilteredCountries.length/5)+1;
        }
      }else{
        alert(this.CountriesData.StatusDescription)
      }
    }, (error) => {
      this.ShowLoading = false;
      //console.log(error);
    });
  }

  GetRecords(){
    this.SortedCountries = [];
    let MinRecordNum = this.RecordsPerPage * (this.pageNumber-1);
    let MaxRecordNum = this.RecordsPerPage * (this.pageNumber);
    for(var i=MinRecordNum;i<MaxRecordNum;i++){
      let optioncountries: Countries = new Countries();
      if(this.FilteredCountries[i]!=null && this.FilteredCountries[i]!=undefined){
        if(this.FilteredCountries[i].CountryName!=null && this.FilteredCountries[i].CountryName!=undefined){
          optioncountries.CountryName = this.FilteredCountries[i].CountryName;
          optioncountries.IDNo = this.FilteredCountries[i].IDNo;
          this.SortedCountries.push(optioncountries);
        }
      }
    }
    this.pageNumber = this.pageNumber + 1;
    if(this.pageNumber>this.MaxPageNumber){
      this.ShowAddMore = false;
    }else{
      this.ShowAddMore = true;
    }
    if(this.SortedCountries.length>0){
      this.ShowNotFound = false;
    }else{
      this.ShowNotFound = true;
      if(this.UserType=="Admin"){
        this.ShowAddBtn = true;
      }else{
        this.ShowAddBtn = false;
      }
    }
    //console.log(this.pageNumber);
    //console.log(this.SortedCountries);
  }

  public objAddCountryReq : mdlAddCountryReq = new mdlAddCountryReq();
  AddCountry(){
    //console.log(this.SearchCountry);
    document.getElementById("sponsorvalue").innerHTML = this.SearchCountry;
    document.getElementById("SponsorDropdown").style.display = "none";
    document.getElementById("SponsorDropdown").classList.remove('show');
    this.ShowLoading = true;
    this.objAddCountryReq.CountryName = this.SearchCountry;
    this.http.post<mdlCountryList>("http://localhost:57940/api/Values/AddNewCountry", this.objAddCountryReq).toPromise().
    then((result) => {
      //console.log(result);
      this.ShowLoading = false;
      this.CountriesData = result;
      this.ShowNotFound = false;
      if(this.CountriesData.StatusCode=="S"){
        this.GetCountries();
      }else{
        alert(this.CountriesData.StatusDescription);
      }
      
    }, (error) => {
      this.ShowLoading = false;
      //console.log(error);
    });
  }

  Logout(){
    sessionStorage.clear();
    this.router.navigate(['/Login']);
  }

}
