import { error } from "console";
import { AppDataSource } from "../../../config";
import { LoanHeader } from '../interfaces/LoanHeader';

type LoanServicesType = {
    create : (loanHeader:LoanHeader, userID: string) => void,
    createAllLoan : (tenantName:string,LoanHeader: LoanHeader[], userID) => void,
    updateAllLoan : () => void,
    updateLoan : () => void,
    deleteAllLoan : () => void,
    deletOneLoan : () => void
}

const queryRunner = AppDataSource.createQueryRunner();

let LoanService: LoanServicesType = {
    create: async function (loanHeader, userID): Promise<void> {
        queryRunner.connect()
        queryRunner.startTransaction()
        try {
            const result =await queryRunner.query(`
                INSERT INTO "rpccode3"."LoanHeader" ("user_id", "person_id", "frequency_id", "loan_num", "amount", "dues", "interest", "start_date", "end_date", "state_id") 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
                
                `,[
                    userID,
                    loanHeader.person_id,
                    loanHeader.frequency_id,
                    '11000',
                    loanHeader.amount,
                    loanHeader.dues,
                    loanHeader.interest,
                    loanHeader.start_date,
                    loanHeader.start_date,
                    loanHeader.loanState
                ])
            if (result.length < 0) {
                throw new Error('Created loan header failed ')
            }

            return result
        } catch (error) {
            queryRunner.rollbackTransaction()
            throw error
        }finally {
            queryRunner.release()
        }
    },
    createAllLoan: async function (tenantName,loanHeader, userID): Promise<void> {
        queryRunner.connect()
        queryRunner.startTransaction()
        try {
            for(const loan of loanHeader){
                await queryRunner.query(`
                    INSERT INTO "${tenantName}"."LoanHeader" ("user_id", "person_id", "frequency_id", "loan_num", "amount", "dues", "interest", "start_date", "end_date", "state_id") 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    
                    `,[
                        userID,
                        loan.person_id,
                        loan.frequency_id,
                        '11000',
                        loan.amount,
                        loan.dues,
                        loan.interest,
                        loan.start_date,
                        loan.start_date,
                        loan.loanState
                    ])
            }
            // if (result.length < 0) {
            //     throw new Error('Created loan header failed ')
            // }

            // return result
        } catch (error) {
            queryRunner.rollbackTransaction()
            throw error
        }finally {
            queryRunner.release()
        }
    },
    updateAllLoan: function (): void {
        throw new Error("Function not implemented.")
    },
    updateLoan: function (): void {
        throw new Error("Function not implemented.")
    },
    deleteAllLoan: function (): void {
        throw new Error("Function not implemented.")
    },
    deletOneLoan: function (): void {
        throw new Error("Function not implemented.")
    }
}
