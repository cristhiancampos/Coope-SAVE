export class solicitudVehiculo{
    constructor(
        public _id:string,        
        public vehiculo: string,
        public  usuario:String,
        public fecha :{},
        public horaSalida:{},
        public horaRegreso:{},
        public destino: {},
        public descripcion :String,
        public estado :String,
        public acompanantes :{},
        public reated_at: String,
        public updated_at: String
    ){}
}