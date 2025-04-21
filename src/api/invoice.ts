
import axios from "./axios"
import { Invoice } from "@/interface/invoice-interface"

export const createInvoiceRequest = async (invoice: Invoice): Promise<any> => {
    return axios.post('/invoice/createinvoice', invoice)
}






