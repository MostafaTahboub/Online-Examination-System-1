import { DataSource } from "typeorm";
import dotenv from 'dotenv';

const dataSource = new DataSource({
    type:"mysql",
    host:process.env.DB_HOST,
    port:Number(process.env.DB_PORT),
    username:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:"OnlineExaminationSystem",
    synchronize:true,  
    logging:true
   })

   dataSource.initialize().then(()=>{
       console.log('connected to database :)');
   })
   .catch((err)=>{
       console.log('failed to connect to db !! '+err);
   })
   
   export default dataSource;
   