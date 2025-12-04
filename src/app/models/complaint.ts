import { ComplaintCategory } from "../enums/ComplaintCategory";
import { UserType } from "../enums/userType";

export interface ComplaintDto{
         TripId:string,
         Description:string,
         category:ComplaintCategory,
         ComplainerType:UserType,
}
