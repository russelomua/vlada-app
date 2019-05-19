export class CreditCardModel {
    public name: string;
    public number: number;
    public cvv: number;
    public exp: string;

    checkCard() {
        return (this.name && this.number && this.cvv && this.exp);
    }
}
