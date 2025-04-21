

export interface Invoice {
    number: string,
    phone: string,
    validate: string,
    date: string,
    client: string,
    address: string,
    items: Item[],

}

export interface Item {
    id: string,
    quantity: string,
    price: string,
    description: string,
    valuetotal: string
}