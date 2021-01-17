export class mdlCountryList{
    public  StatusCode :string;
    public  StatusDescription :string;
    public  CountryData: Array<Countries> = new Array<Countries>();
}

export class Countries{
    public  CountryName : string;
    public  IDNo : number;
}

export class mdlAddCountryReq{
    public CountryName: string;
}