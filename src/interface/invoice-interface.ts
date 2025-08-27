export interface Invoice {
    number: string;
    phone: string;
    validate: string;
    createdDate: string;
    client: string;
    address: string;
    items: Item[];
    saleprice: number;
}
export interface Item {
    id: string,
    quantity: string,
    price: string,
    description: string,
    valuetotal: string
}
export interface PaginatedInvoiceResponse {
    page: number,
    perPage: number,
    pages: number,
    data: Invoice[],
    total: number
}

export interface PaginateInvoiceParams {
    page?: number;
    perPage?: number;
    query?: string;
    sort?: string;
    startDate?: string;
    endDate?: string;
}
export interface ReportInvoiceParams {
    startDate?: string;
    endDate?: string;
}
