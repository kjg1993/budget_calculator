import { useReducer, createContext, Dispatch, ReactNode, useMemo } from 'react'
import { BudgetActions, budgetReducer, BudgetState, initialState } from '../reducers/budget-reducer'

// Creamos un tipo que describe cómo será nuestro contexto
type BudgetContextProps = {
    state: BudgetState // Aquí guardaremos el estado del presupuesto
    dispatch: Dispatch<BudgetActions> // Aquí guardaremos la función para enviar acciones al reductor
    totalExpense: number
    remainingBudget: number
}

// Creamos un tipo para las propiedades del proveedor (lo que recibirá)
type BudgetProviderProps = {
    children: ReactNode // Los hijos son los componentes que estarán dentro del proveedor
}

// Creamos nuestro contexto de presupuesto (es como una caja donde guardamos el estado)
export const BudgetContext = createContext<BudgetContextProps>(null!)

// Creamos nuestro proveedor de contexto
export const BudgetProvider = ({ children }: BudgetProviderProps) => {
    // Usamos useReducer para gestionar el estado
    // budgetReducer es la función que actualiza el estado
    // initialState es el estado que tendremos al principio
    const [state, dispatch] = useReducer(budgetReducer, initialState)

    
    const totalExpense  = useMemo(() => state.expenses.reduce((total, expense) => expense.amount + total, 0), [state.expenses])

    const remainingBudget = state.budget - totalExpense

    
    return (
        // Aquí decimos que todo lo que esté dentro de BudgetContext.Provider
        // podrá acceder al estado y a la función dispatch
        <BudgetContext.Provider 
            value={{
                state, // Pasamos el estado del presupuesto
                dispatch, // Pasamos la función para enviar acciones
                totalExpense,
                remainingBudget
            }}
        > 
            {children} {/* Esto es lo que se mostrará dentro del proveedor */}
        </BudgetContext.Provider>
    )
}
