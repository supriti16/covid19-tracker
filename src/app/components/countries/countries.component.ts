import { map } from 'rxjs/operators';
import { DateWiseData } from './../../models/date-wise-data';
import { GlobalDataSummary } from './../../models/global-data';
import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { merge } from 'rxjs';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  data : GlobalDataSummary[];
  countries :string[]=[];
  totalConfirmed=0;
  totalActive=0;
  totalDeaths=0;
  totalRecovered=0;
  dateWiseData ;
  dataTable =[];
  loading = true;
  selectedCountryData : DateWiseData[];
  // chart={
  //   LineChart : 'LineChart',
  //   height : 500,
  //   options: {
      
  //     animation :{
  //       duration :1000,
  //       easing : 'out',
  //     },
  // }
  // }
  constructor(private service : DataServiceService) { }
  
  ngOnInit(): void {
    

    merge(
      this.service.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData=result;
          this.updateChart();
        })
      ),
      this.service.getGlobalData().pipe(map(result=>{
        this.data =result;
        this.data.forEach(cs=>{
          this.countries.push(cs.country)
        })
      }))
    ).subscribe({
      complete : ()=>{
       this.updateValues('India')
       this.loading=false;
      }
    })
  }
  updateChart(){
    this.dataTable=[];
    this.dataTable.push(["Date","Cases"])
    this.selectedCountryData.forEach(cs=>{
      this.dataTable.push([cs.date,cs.cases])
    })

  }
  updateValues(country:string){
    console.log(country);
    this.data.forEach(cs=>{
      if(cs.country == country){
        this.totalActive=cs.active
        this.totalRecovered=cs.recovered
        this.totalDeaths=cs.deaths
        this.totalConfirmed=cs.confirmed
      }
    })
    this.selectedCountryData=  this.dateWiseData[country]
    this.updateChart();
  }

}
