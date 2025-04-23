
import axios from "./axios"
import { Invoice, PaginateInvoiceParams } from "@/interface/invoice-interface"

export const createInvoiceRequest = async (invoice: Invoice): Promise<any> => {
    return axios.post('/invoice/createinvoice', invoice)
}

export const getNextNumberRequest = async (): Promise<any> => {
    return axios.get('/invoice/lastnumber')
}

export const paginateInvoiceRequest = (
    params: PaginateInvoiceParams): Promise<any> => {
    return axios.get('/invoice', { params })
}






