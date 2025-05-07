
import { Invoice, Item } from "@/interface/invoice-interface";
import { INVOICE_KEY } from "@/constants/invoice";

export class InvoiceService {
    private storageKey: string;

    constructor(key: string = INVOICE_KEY) {
        this.storageKey = key;
    }

    // crea un item con ID y valor total calculado 
    public createItem(item: Omit<Item, "id">): Item {
        const valuetotal = (
            Number(item.quantity.trim()) * Number(item.price.trim())
        ).toFixed(2);

        return {
            ...item,
            valuetotal,
            id: crypto.randomUUID(),
        };
    }

    // guarda la factura en almacenamiento
    public saveInvoice(invoice: Invoice): void {
        localStorage.setItem(this.storageKey, JSON.stringify(invoice));
    }

    // obtiene la factura de almacenamiento
    public getInvoice(): Invoice | null {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : null;
    }

    // elimina la factura del almacenamiento
    public deletedInvoice(): void {
        localStorage.removeItem(this.storageKey);
    }

    // devuelve un invoice vacio
    public getEmptyInvoice(): Invoice {
        return {
            number: "",
            phone: "",
            validate: "",
            createdDate: "",
            client: "",
            address: "",
            items: [],
            saleprice: 0
        };
    }

    // devuelve un item vacio
    public getEmptyItem(): Omit<Item, "id"> {
        return {
            quantity: "",
            price: "",
            description: '',
            valuetotal: ""
        }
    }

    // calcula el total de la factuea
    public calculateTotal(items: Item[]): number {
        return items.reduce((acc, item) => acc + Number(item.valuetotal), 0);
    }
    // verifica los campos de la cabecera 
    public isVerifyHeader = (invoice: Invoice): boolean => {
        return (
            invoice.validate.trim() !== "" &&
            invoice.client.trim() !== "" &&
            invoice.createdDate.trim() !== "" 
            // invoice.createdDate !== null &&
            // invoice.createdDate instanceof Date &&
            // !isNaN(invoice.createdDate.getTime())
        )
    }

    // verifica los campos de los item 
    public isVerifySale = (item: Item): boolean => {
        return (
            item.quantity.trim() !== "" &&
            item.price.trim() !== "" &&
            item.description.trim() !== "")
    }

}
