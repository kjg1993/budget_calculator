export type Expense = {
    id: string;
    expenseName: string;
    amount: number;
    category: string;
    date: Date | null;  // Cambia `Value` por `Date | null`

}

export type DraftExpense =  Omit<Expense, 'id'>


type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];


export type Categories = {
    id: string;
    name: string;
    icon: string;
}