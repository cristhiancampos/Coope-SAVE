export class Usuario{
    constructor(
        public _id:string,        
        public nombre:string,
        public apellidos:string,
        public correo :string,
        public contrasena :string,
        public role :string,
        public departamento :String
    ){}
}